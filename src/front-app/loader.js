import runtime from './runtime';
import { registerDefaultEngines } from './engines/index';
import { installHoverImages } from '../shared/hover-images';
import { installTwoRows } from './two-rows';
import './two-rows.css';

(function () {
  const selector = '.cci-wpc-carousel[data-wpc-api]';
  const controlRootSelector = '.cci-wpc-carousel, [data-wpc-react-root="true"]';
  const controlViewportSelector =
    '.cci-rows-viewport, .owl-stage-outer, .cci-wpc-render-preview-viewport';
  const controlDotsSelector = '.owl-dots, .cci-wpc-render-preview-dots';
  const loaded = new WeakSet();
  const observedControlRoots = new WeakMap();
  const observedOwlAccessibilityRoots = new WeakSet();
  const observedLazyCarousels = new WeakSet();
  const activeRequests = new WeakMap();
  const templateStyles = new WeakMap();
  const owlFocusableTabIndexes = new WeakMap();
  const owlItemAriaHiddenValues = new WeakMap();
  const owlKeyboardDots = new WeakSet();
  let dynamicObserverAttached = false;
  let filterbarListenerAttached = false;
  let lazyObserver = null;
  let refreshScheduled = false;
  let resizeListenerAttached = false;

  registerDefaultEngines(runtime);
  installTwoRows(runtime);
  installHoverImages();

  function scheduleControlSync(root) {
    if (!root) {
      return;
    }

    const sync = function () {
      syncControlMetrics(root);
    };

    window.requestAnimationFrame(sync);
    window.setTimeout(sync, 80);
    window.setTimeout(sync, 260);
  }

  function syncControlMetrics(root) {
    if (!root || !root.querySelector) {
      return;
    }

    const viewport = root.querySelector(controlViewportSelector);

    if (!viewport) {
      return;
    }

    const rootRect = root.getBoundingClientRect();
    const viewportRect = viewport.getBoundingClientRect();

    if (!rootRect.width || !viewportRect.height) {
      return;
    }

    const axis =
      Math.round(Math.max(0, viewportRect.top - rootRect.top + viewportRect.height / 2) * 100) /
      100;
    const axisValue = `${axis}px`;

    if (root.style.getPropertyValue('--wpc-control-axis-y') !== axisValue) {
      root.style.setProperty('--wpc-control-axis-y', axisValue);
    }
  }

  function restoreAttribute(element, attribute, value) {
    if (value === null) {
      element.removeAttribute(attribute);
      return;
    }

    element.setAttribute(attribute, value);
  }

  function syncOwlSlideAccessibility(root) {
    if (!root || !root.querySelectorAll) {
      return;
    }

    const focusableSelector = [
      'a[href]',
      'area[href]',
      'button',
      'input',
      'select',
      'textarea',
      'iframe',
      'audio[controls]',
      'video[controls]',
      '[contenteditable="true"]',
      '[tabindex]',
    ].join(',');

    root.querySelectorAll('.owl-item').forEach(function (item) {
      const isActive = item.classList.contains('active');

      if (!owlItemAriaHiddenValues.has(item)) {
        owlItemAriaHiddenValues.set(item, item.getAttribute('aria-hidden'));
      }

      if (isActive) {
        restoreAttribute(item, 'aria-hidden', owlItemAriaHiddenValues.get(item));
      } else {
        item.setAttribute('aria-hidden', 'true');
      }

      item.querySelectorAll(focusableSelector).forEach(function (control) {
        if (!owlFocusableTabIndexes.has(control)) {
          owlFocusableTabIndexes.set(control, control.getAttribute('tabindex'));
        }

        if (isActive) {
          restoreAttribute(control, 'tabindex', owlFocusableTabIndexes.get(control));
        } else {
          control.setAttribute('tabindex', '-1');
        }
      });
    });
  }

  function runtimeLabel(key, fallback) {
    return window.wpPostsCarouselRuntimeConfig?.labels?.[key] || fallback;
  }

  function syncOwlControlAccessibility(root) {
    if (!root || !root.querySelectorAll) {
      return;
    }

    const carouselId = root.getAttribute('id');
    const navigation = [
      {
        selector: '.owl-prev',
        label: runtimeLabel('previousSlide', 'Previous slide'),
      },
      {
        selector: '.owl-next',
        label: runtimeLabel('nextSlide', 'Next slide'),
      },
    ];

    navigation.forEach(function (item) {
      root.querySelectorAll(item.selector).forEach(function (control) {
        const isDisabled = control.disabled || control.classList.contains('disabled');

        if (control.tagName === 'BUTTON') {
          control.setAttribute('type', 'button');
        }

        control.setAttribute('aria-label', item.label);
        control.setAttribute('aria-disabled', isDisabled ? 'true' : 'false');
        control.setAttribute('tabindex', isDisabled ? '-1' : '0');

        if (carouselId) {
          control.setAttribute('aria-controls', carouselId);
        }
      });
    });

    const goToSlideLabel = runtimeLabel('goToSlide', 'Go to slide %d');
    root.querySelectorAll('.owl-dots .owl-dot').forEach(function (dot, index) {
      dot.setAttribute('role', 'button');
      dot.setAttribute('tabindex', '0');
      dot.setAttribute('aria-label', goToSlideLabel.replace('%d', String(index + 1)));

      if (dot.classList.contains('active')) {
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.removeAttribute('aria-current');
      }

      if (carouselId) {
        dot.setAttribute('aria-controls', carouselId);
      }

      if (owlKeyboardDots.has(dot)) {
        return;
      }

      owlKeyboardDots.add(dot);
      dot.addEventListener('keydown', function (event) {
        if (event.key !== 'Enter' && event.key !== ' ') {
          return;
        }

        event.preventDefault();
        dot.click();
      });
    });
  }

  function syncOwlAccessibility(root) {
    syncOwlSlideAccessibility(root);
    syncOwlControlAccessibility(root);
  }

  function observeOwlAccessibility(root) {
    if (!root || observedOwlAccessibilityRoots.has(root)) {
      return;
    }

    observedOwlAccessibilityRoots.add(root);
    const sync = function () {
      window.requestAnimationFrame(function () {
        syncOwlAccessibility(root);
      });
    };
    const ownerWindow = root.ownerDocument?.defaultView || window;
    const jquery = ownerWindow.jQuery || window.jQuery;

    if (jquery) {
      jquery(root).on(
        'initialized.owl.carousel.wpcAccessibility changed.owl.carousel.wpcAccessibility translated.owl.carousel.wpcAccessibility refreshed.owl.carousel.wpcAccessibility resized.owl.carousel.wpcAccessibility',
        sync,
      );
    }

    sync();
  }

  function observeControlRoot(root) {
    if (!root || observedControlRoots.has(root)) {
      return;
    }

    const observers = [];
    observedControlRoots.set(root, observers);
    observeOwlAccessibility(root);
    let resizeObserver = null;
    const observeViewport = function () {
      if (!resizeObserver) {
        return;
      }

      const viewport = root.querySelector(controlViewportSelector);

      if (viewport) {
        resizeObserver.observe(viewport);
      }
    };

    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(function () {
        scheduleControlSync(root);
      });
      resizeObserver.observe(root);
      observeViewport();
      observers.push(resizeObserver);
    }

    if ('MutationObserver' in window) {
      const observer = new MutationObserver(function () {
        observeViewport();
        scheduleControlSync(root);
        syncOwlAccessibility(root);
      });
      observer.observe(root, {
        childList: true,
        subtree: true,
      });
      observers.push(observer);
    }

    scheduleControlSync(root);
  }

  function relatedControlRoots(element) {
    const roots = [];

    if (element) {
      roots.push(element);
    }

    const reactRoot =
      element?.previousElementSibling?.getAttribute('data-wpc-react-root') === 'true'
        ? element.previousElementSibling
        : null;

    if (reactRoot) {
      roots.push(reactRoot);
    }

    return roots.filter(Boolean);
  }

  function observeControlRoots(element) {
    relatedControlRoots(element).forEach(observeControlRoot);
  }

  function syncAllControlRoots() {
    document.querySelectorAll(controlRootSelector).forEach(observeControlRoot);
  }

  function scheduleObserve() {
    if (refreshScheduled) {
      return;
    }

    refreshScheduled = true;

    const refresh = function () {
      refreshScheduled = false;
      observe();
      syncAllControlRoots();
    };

    if ('requestAnimationFrame' in window) {
      window.requestAnimationFrame(refresh);
      return;
    }

    window.setTimeout(refresh, 0);
  }

  function attachControlResizeListener() {
    if (resizeListenerAttached) {
      return;
    }

    resizeListenerAttached = true;
    window.addEventListener('resize', syncAllControlRoots);
  }

  function dispatch(element, name, detail) {
    element.dispatchEvent(
      new CustomEvent(name, {
        bubbles: true,
        detail,
      }),
    );
  }

  function handleMountError(element, error) {
    element.dataset.wpcLazyState = 'error';
    element.removeAttribute('aria-busy');
    const presentation = element.querySelector('[data-wpc-loading-presentation]');
    if (presentation) {
      presentation.dataset.wpcLoadingState = 'error';
      element.style.display = 'block';
      const message = presentation.querySelector('[data-wpc-loading-message]');
      message.textContent = message.dataset.wpcErrorLabel;
      message.classList.remove('screen-reader-text');
      const retry = presentation.querySelector('[data-wpc-loading-retry]');
      retry.hidden = false;
      retry.onclick = () => loadCarousel(element, { force: true }).catch(() => {});
    }

    dispatch(element, 'wp-posts-carousel:error', {
      error,
      element,
    });

    runtime.hooks.doAction('carouselError', error, element);
  }

  function mountRenderer(rendererName, element, data) {
    const mounted = runtime.mountRenderer(rendererName, element, data);

    if (mounted) {
      return Promise.resolve();
    }

    if (rendererName === 'react' && !runtime.getRenderer('react')) {
      return import('./react-renderer').then(function (renderer) {
        runtime.registerRenderer('react', renderer);
        runtime.mountRenderer('react', element, data);
      });
    }

    if (
      window.wpPostsCarouselFrontend &&
      typeof window.wpPostsCarouselFrontend.mount === 'function'
    ) {
      window.wpPostsCarouselFrontend.mount(element, data);
    }

    return Promise.resolve();
  }

  function filterPrefix(element) {
    return element.dataset.wpcFilterPrefix || 'wpcf_';
  }

  function filterParamsFromLocation(element) {
    const prefix = filterPrefix(element);
    const params = new URLSearchParams();

    new URLSearchParams(window.location.search).forEach(function (value, key) {
      if (key.indexOf(prefix) === 0) {
        params.set(key, value);
      }
    });

    return params;
  }

  function carouselApiUrl(element, filterParams) {
    const url = new URL(element.dataset.wpcApi, window.location.href);
    const prefix = filterPrefix(element);
    const params = filterParams || filterParamsFromLocation(element);

    Array.from(url.searchParams.keys()).forEach(function (key) {
      if (key.indexOf(prefix) === 0) {
        url.searchParams.delete(key);
      }
    });

    params.forEach(function (value, key) {
      if (key.indexOf(prefix) === 0) {
        url.searchParams.set(key, value);
      }
    });

    if (element.id) {
      url.searchParams.set('instance_id', element.id);
    }

    if (element.dataset.wpcRenderer) {
      url.searchParams.set('renderer', element.dataset.wpcRenderer);
    }

    return url.toString();
  }

  function destroyOwlCarousel(element) {
    const ownerWindow = element?.ownerDocument?.defaultView || window;
    const jquery = ownerWindow.jQuery || window.jQuery;

    if (!jquery || !jquery.fn || !jquery.fn.owlCarousel) {
      return;
    }

    try {
      jquery(element).trigger('destroy.owl.carousel');
    } catch (error) {}
  }

  function executeScripts(scripts, ownerDocument = document) {
    const targetDocument = ownerDocument || document;
    const target = targetDocument.body || targetDocument.head || targetDocument.documentElement;

    if (!target) {
      return;
    }

    scripts.forEach(function (sourceScript) {
      const script = targetDocument.createElement('script');

      Array.from(sourceScript.attributes).forEach(function (attribute) {
        script.setAttribute(attribute.name, attribute.value);
      });

      script.text = sourceScript.textContent || '';
      target.appendChild(script);
      script.parentNode.removeChild(script);
    });
  }

  function replaceCarouselHtml(element, data) {
    if (!data || !data.html) {
      return element;
    }

    const ownerDocument = element.ownerDocument || document;
    const template = ownerDocument.createElement('template');
    template.innerHTML = data.html;

    const nextElement = Array.from(
      template.content.querySelectorAll('.cci-wpc-carousel[data-wpc-id]'),
    ).find(function (candidate) {
      return candidate.id === element.id || candidate.dataset.wpcId === element.dataset.wpcId;
    });

    if (!nextElement) {
      return element;
    }

    const scripts = Array.from(template.content.querySelectorAll('script'));
    if (element.dataset.wpcEditorOwlInit) {
      nextElement.dataset.wpcEditorOwlInit = element.dataset.wpcEditorOwlInit;
    }
    if (element.dataset.wpcEditorOwlAttempts) {
      nextElement.dataset.wpcEditorOwlAttempts = element.dataset.wpcEditorOwlAttempts;
    }

    destroyOwlCarousel(element);
    element.replaceWith(nextElement);
    executeScripts(scripts, ownerDocument);

    return nextElement;
  }

  function isFullReactElement(element) {
    return (
      element &&
      element.dataset.wpcRenderer === 'react' &&
      ['full', 'render'].includes(element.dataset.wpcReactMode || '')
    );
  }

  function reactRootForElement(element) {
    const root = element?.previousElementSibling;

    return root && root.getAttribute('data-wpc-react-root') === 'true' ? root : null;
  }

  function waitForReactRoot(element) {
    if (!isFullReactElement(element)) {
      return Promise.resolve(element);
    }

    return new Promise(function (resolve, reject) {
      let attempts = 0;
      const check = function () {
        const root = reactRootForElement(element);

        if (root && root.childElementCount > 0 && !root.hasAttribute('data-wpc-mounting')) {
          resolve(element);
          return;
        }

        attempts += 1;

        if (attempts >= 150) {
          reject(new Error('CCI Posts Carousel All In One React preview did not mount.'));
          return;
        }

        window.setTimeout(check, 100);
      };

      check();
    });
  }

  function fallbackToHtml(element, data, error) {
    runtime.getRenderer('react')?.unmount?.(element);
    if (data && data.html) {
      const fallbackElement = replaceCarouselHtml(element, data);
      loaded.add(fallbackElement);
      fallbackElement.dataset.wpcLazyState = 'ready';
      fallbackElement.removeAttribute('aria-busy');
      fallbackElement.dataset.wpcRendererFallback = 'html';
      fallbackElement.wpPostsCarouselData = data;
      observeControlRoots(fallbackElement);

      dispatch(fallbackElement, 'wp-posts-carousel:fallback', {
        carousel: data,
        element: fallbackElement,
        error,
      });

      return fallbackElement;
    }

    element.style.visibility = 'visible';
    element.style.minHeight = '';
    element.style.overflow = '';
    element.removeAttribute('aria-busy');

    return element;
  }

  function renderCarouselData(element, data, options) {
    if (Array.isArray(data.slides) && data.slides.length === 0) {
      destroyOwlCarousel(element);
      runtime.getRenderer('react')?.unmount?.(element);
      reactRootForElement(element)?.remove();
      const message = element.ownerDocument.createElement('p');
      message.className = 'cci-wpc-empty';
      message.setAttribute('role', 'status');
      message.textContent = runtimeLabel('noContent', 'No content found.');
      element.replaceChildren(message);
      element.style.display = 'block';
      element.style.minHeight = '';
      element.removeAttribute('aria-hidden');
      element.removeAttribute('aria-busy');
      element.dataset.wpcLazyState = 'ready';
      loaded.add(element);
      return Promise.resolve(element);
    }
    const rendererName = runtime.hooks.applyFilters(
      'carouselRenderer',
      element.dataset.wpcRenderer || 'php',
      element,
      data,
    );
    const shouldReplaceHtml = Boolean(
      data.html &&
      rendererName !== 'react' &&
      (options.replaceHtml || currentElementNeedsHtml(element)),
    );
    const currentElement = shouldReplaceHtml ? replaceCarouselHtml(element, data) : element;

    data = runtime.hooks.applyFilters('carouselData', data, currentElement);
    loaded.add(currentElement);
    currentElement.dataset.wpcLazyState = 'ready';
    if (!currentElement.querySelector('[data-wpc-loading-presentation]')) {
      currentElement.removeAttribute('aria-busy');
    }
    currentElement.wpPostsCarouselData = data;

    dispatch(currentElement, 'wp-posts-carousel:ready', {
      carousel: data,
      element: currentElement,
    });

    runtime.hooks.doAction('carouselReady', data, currentElement);

    return mountRenderer(rendererName, currentElement, data)
      .then(function () {
        return waitForReactRoot(currentElement);
      })
      .then(function () {
        currentElement.querySelector('[data-wpc-loading-presentation]')?.remove();
        currentElement.removeAttribute('aria-busy');
        observeControlRoots(currentElement);

        return currentElement;
      })
      .catch(function (error) {
        if (rendererName === 'react' && data.html) {
          return fallbackToHtml(currentElement, data, error);
        }

        loaded.delete(currentElement);
        handleMountError(currentElement, error);
        throw error;
      });
  }

  function currentElementNeedsHtml(element) {
    return element?.dataset?.wpcLazyRender === 'true' || !element?.childElementCount;
  }

  function ensureTemplateStyle(element, data) {
    const style = data?.template?.stylesheet;
    const ownerDocument = element.ownerDocument || document;
    if (!style?.handle || !style?.url) {
      return Promise.resolve();
    }
    const url = new URL(style.url, ownerDocument.baseURI);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return Promise.reject(
        new Error('CCI Posts Carousel All In One template stylesheet URL is invalid.'),
      );
    }
    url.searchParams.set('ver', style.version || '');
    let styles = templateStyles.get(ownerDocument);
    if (!styles) {
      styles = new Map();
      templateStyles.set(ownerDocument, styles);
    }
    if (styles.has(style.handle)) {
      return styles.get(style.handle);
    }
    if (ownerDocument.getElementById(`${style.handle}-css`)) {
      return Promise.resolve();
    }
    const link = ownerDocument.createElement('link');
    link.id = `${style.handle}-css`;
    link.rel = 'stylesheet';
    link.href = url.toString();
    const promise = new Promise(function (resolve, reject) {
      link.onload = resolve;
      link.onerror = function () {
        styles.delete(style.handle);
        link.remove();
        reject(new Error('CCI Posts Carousel All In One template stylesheet failed to load.'));
      };
    });
    styles.set(style.handle, promise);
    ownerDocument.head.appendChild(link);
    return promise;
  }

  function loadCarousel(element, options) {
    options = {
      filterParams: null,
      force: false,
      replaceHtml: false,
      ...(options || {}),
    };

    if (!options.force && loaded.has(element)) {
      return Promise.resolve(element);
    }

    if (activeRequests.has(element)) {
      activeRequests.get(element).abort();
    }

    const controller = new AbortController();
    activeRequests.set(element, controller);
    loaded.add(element);
    element.dataset.wpcLazyState = 'loading';
    const presentation = element.querySelector('[data-wpc-loading-presentation]');
    if (presentation) {
      presentation.dataset.wpcLoadingState = 'loading';
      element.setAttribute('aria-busy', 'true');
      const message = presentation.querySelector('[data-wpc-loading-message]');
      message.textContent = message.dataset.wpcLoadingLabel;
      message.classList.add('screen-reader-text');
      presentation.querySelector('[data-wpc-loading-retry]').hidden = true;
    }

    return fetch(carouselApiUrl(element, options.filterParams), {
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('CCI Posts Carousel All In One API request failed.');
        }

        return response.json();
      })
      .then(function (data) {
        if (controller.signal.aborted || activeRequests.get(element) !== controller) {
          return element;
        }
        return ensureTemplateStyle(element, data).then(function () {
          if (controller.signal.aborted || activeRequests.get(element) !== controller) {
            return element;
          }
          return renderCarouselData(element, data, options);
        });
      })
      .catch(function (error) {
        if (activeRequests.get(element) !== controller) {
          return element;
        }
        loaded.delete(element);
        if (error && error.name === 'AbortError') {
          return element;
        }

        handleMountError(element, error);
        throw error;
      })
      .finally(function () {
        if (activeRequests.get(element) === controller) {
          activeRequests.delete(element);
        }
      });
  }

  function carouselForFilterbar(filterbar) {
    const target = filterbar.getAttribute('data-wpc-filterbar-for');

    if (target) {
      const element = document.getElementById(target);

      if (element && element.matches(selector)) {
        return element;
      }
    }

    const sibling = filterbar.nextElementSibling;

    return sibling && sibling.matches(selector) ? sibling : null;
  }

  function filterParamsForOption(carousel, option) {
    const params = filterParamsFromLocation(carousel);
    const param = option.getAttribute('data-wpc-filter-param');
    const value = option.getAttribute('data-wpc-filter-value');

    if (param) {
      if (value) {
        params.set(param, value);
      } else {
        params.delete(param);
      }

      return params;
    }

    return filterParamsFromLocation({
      dataset: {
        wpcFilterPrefix: filterPrefix(carousel),
      },
    });
  }

  function syncFilterbarState(filterbar, params) {
    filterbar.querySelectorAll('.cci-wpc-filterbar-option').forEach(function (option) {
      const param = option.getAttribute('data-wpc-filter-param');
      const value = option.getAttribute('data-wpc-filter-value') || '';

      if (!param) {
        return;
      }

      const active = value ? params.get(param) === value : !params.has(param);
      option.classList.toggle('cci-wpc-active', active);

      if (active) {
        option.setAttribute('aria-current', 'true');
      } else {
        option.removeAttribute('aria-current');
      }
    });
  }

  function syncBrowserFilterParams(carousel, params) {
    if (!window.history || !window.history.pushState) {
      return;
    }

    const prefix = filterPrefix(carousel);
    const url = new URL(window.location.href);

    Array.from(url.searchParams.keys()).forEach(function (key) {
      if (key.indexOf(prefix) === 0) {
        url.searchParams.delete(key);
      }
    });

    params.forEach(function (value, key) {
      if (key.indexOf(prefix) === 0) {
        url.searchParams.set(key, value);
      }
    });

    window.history.pushState({ wpPostsCarouselFilters: true }, '', url.toString());
  }

  function setFilterLoading(filterbar, carousel, loading) {
    filterbar.dataset.wpcLoading = loading ? 'true' : 'false';
    carousel.dataset.wpcFilterState = loading ? 'loading' : 'ready';
    carousel.setAttribute('aria-busy', loading ? 'true' : 'false');
  }

  function handleFilterbarClick(event) {
    const option = event.target.closest('.cci-wpc-filterbar-option');

    if (
      !option ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const filterbar = option.closest('.cci-wpc-filterbar');
    const carousel = filterbar ? carouselForFilterbar(filterbar) : null;

    if (!carousel) {
      return;
    }

    event.preventDefault();

    const params = filterParamsForOption(carousel, option);
    setFilterLoading(filterbar, carousel, true);

    loadCarousel(carousel, {
      filterParams: params,
      force: true,
      replaceHtml: true,
    })
      .then(function (nextCarousel) {
        syncFilterbarState(filterbar, params);
        syncBrowserFilterParams(nextCarousel || carousel, params);
      })
      .catch(function () {
        window.location.href = option.href;
      })
      .finally(function () {
        const nextCarousel = carouselForFilterbar(filterbar) || carousel;
        setFilterLoading(filterbar, nextCarousel, false);
      });
  }

  function attachFilterbarListener() {
    if (filterbarListenerAttached) {
      return;
    }

    filterbarListenerAttached = true;
    document.addEventListener('click', handleFilterbarClick);
    window.addEventListener('popstate', function () {
      document.querySelectorAll('.cci-wpc-filterbar').forEach(function (filterbar) {
        const carousel = carouselForFilterbar(filterbar);

        if (!carousel) {
          return;
        }

        const params = filterParamsFromLocation(carousel);
        syncFilterbarState(filterbar, params);
        loadCarousel(carousel, {
          filterParams: params,
          force: true,
          replaceHtml: true,
        }).catch(function () {});
      });
    });
  }

  function nodeContainsCarousel(node) {
    if (!node || node.nodeType !== 1) {
      return false;
    }

    return node.matches(selector) || Boolean(node.querySelector(selector));
  }

  function attachDynamicObserver() {
    if (dynamicObserverAttached || !('MutationObserver' in window)) {
      return;
    }

    if (!document.body) {
      document.addEventListener('DOMContentLoaded', attachDynamicObserver, {
        once: true,
      });
      return;
    }

    dynamicObserverAttached = true;

    const observer = new MutationObserver(function (mutations) {
      const hasCarousel = mutations.some(function (mutation) {
        return Array.from(mutation.addedNodes).some(nodeContainsCarousel);
      });

      if (hasCarousel) {
        scheduleObserve();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function observe() {
    const carousels = document.querySelectorAll(selector);

    if (!carousels.length) {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      carousels.forEach(function (carousel) {
        observeControlRoot(carousel);
        loadCarousel(carousel).catch(function () {});
      });
      return;
    }

    if (!lazyObserver) {
      lazyObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
              return;
            }

            loadCarousel(entry.target).catch(function () {});
            observedLazyCarousels.delete(entry.target);
            lazyObserver.unobserve(entry.target);
          });
        },
        {
          rootMargin: '220px 0px',
          threshold: 0.01,
        },
      );
    }

    carousels.forEach(function (carousel) {
      observeControlRoot(carousel);

      if (loaded.has(carousel) || observedLazyCarousels.has(carousel)) {
        return;
      }

      observedLazyCarousels.add(carousel);
      lazyObserver.observe(carousel);
    });
  }

  attachControlResizeListener();
  attachDynamicObserver();
  attachFilterbarListener();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      observe();
      syncAllControlRoots();
    });
  } else {
    observe();
    syncAllControlRoots();
  }

  window.wpPostsCarouselLazyLoad = {
    render: renderCarouselData,
    load: loadCarousel,
    refresh: scheduleObserve,
    refreshControls: syncAllControlRoots,
    syncControls: observeControlRoots,
  };
})();
