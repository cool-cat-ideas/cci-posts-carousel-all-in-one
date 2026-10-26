import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import CarouselRenderer from '../shared/CarouselRenderer';
import { resolveReactEngineName } from './engines/index';

const roots = new WeakMap();

function useOwlState(element, slidesCount) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!window.jQuery) {
      return undefined;
    }

    const $ = window.jQuery;
    const $element = $(element);
    const onChanged = (event) => {
      if (event && event.item && Number.isInteger(event.item.index)) {
        const index = slidesCount ? event.item.index % slidesCount : event.item.index;
        setCurrent(index < 0 ? index + slidesCount : index);
      }
    };

    $element.on('changed.owl.carousel', onChanged);

    return () => {
      $element.off('changed.owl.carousel', onChanged);
    };
  }, [element, slidesCount]);

  return current;
}

function triggerOwl(element, eventName) {
  if (!window.jQuery) {
    return;
  }

  window.jQuery(element).trigger(eventName);
}

function dispatchSourceEvent(element, name, detail) {
  if (!element || typeof CustomEvent !== 'function') {
    return;
  }

  element.dispatchEvent(
    new CustomEvent(name, {
      bubbles: true,
      detail,
    }),
  );
}

const FALLBACK_ICON_LIBRARIES = {
  fontawesome: {
    classBase: 'fa',
    classPrefix: 'fa-',
    defaults: {
      previous: 'angle-left',
      next: 'angle-right',
      up: 'angle-up',
      down: 'angle-down',
    },
  },
  tabler: {
    classBase: 'ti',
    classPrefix: 'ti-',
    defaults: {
      previous: 'chevron-left',
      next: 'chevron-right',
      up: 'chevron-up',
      down: 'chevron-down',
    },
  },
};

function sanitizeIconName(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^A-Za-z0-9_-]/g, '');
}

function navigationIcon(options, direction) {
  const navigationIcons = options.navigation_icons || {};
  const configured = navigationIcons[direction];

  if (configured && typeof configured === 'object') {
    return configured;
  }

  const libraryKey = sanitizeIconName(
    options.nav_icon_library || navigationIcons.library || 'fontawesome',
  ).toLowerCase();
  const library = FALLBACK_ICON_LIBRARIES[libraryKey] || FALLBACK_ICON_LIBRARIES.fontawesome;
  const name = sanitizeIconName(options[`nav_icon_${direction}`] || library.defaults[direction]);

  return {
    className: `${library.classBase} ${library.classPrefix}${name}`.trim(),
    direction,
    library: libraryKey,
    name,
  };
}

function NavigationIcon({ icon }) {
  if (icon?.html) {
    return (
      <span className="cci-wpc-navigation-icon" dangerouslySetInnerHTML={{ __html: icon.html }} />
    );
  }

  return (
    <i className={icon?.className || navigationIcon({}, 'next').className} aria-hidden="true" />
  );
}

function FrontendEnhancement({ element, carousel, runtime }) {
  const slides = Array.isArray(carousel.slides) ? carousel.slides : [];
  const options = carousel.engine?.options || {};
  const current = useOwlState(element, slides.length);
  const title = carousel.title || element.getAttribute('aria-label') || '';
  const previousLabel = element.dataset.wpcPrevLabel || 'previous';
  const nextLabel = element.dataset.wpcNextLabel || 'next';
  const engineName = element.dataset.wpcEngine || carousel.engine?.name || 'owl-carousel';
  const isVerticalDirection = String(options.direction || 'horizontal') === 'vertical';
  const previousIcon = navigationIcon(options, isVerticalDirection ? 'up' : 'previous');
  const nextIcon = navigationIcon(options, isVerticalDirection ? 'down' : 'next');
  const label = useMemo(() => {
    if (!slides.length) {
      return title;
    }

    return title ? `${title} (${slides.length})` : `${slides.length} slides`;
  }, [slides.length, title]);
  const controlButtonStyle = {
    alignItems: 'center',
    appearance: 'none',
    background: '#fff',
    border: '1px solid var(--wpc-border, #dfe4d7)',
    borderRadius: '7px',
    color: 'var(--wpc-brand-strong, #566b30)',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: '12px',
    fontWeight: 700,
    justifyContent: 'center',
    lineHeight: 1,
    minHeight: '34px',
    padding: '0 12px',
  };

  useEffect(() => {
    const engine = runtime?.getEngine(engineName);
    const ready = !engine || !engine.available || engine.available();

    element.setAttribute('data-wpc-engine-state', ready ? 'ready' : 'fallback');
    dispatchSourceEvent(
      element,
      ready ? 'wp-posts-carousel:engine-ready' : 'wp-posts-carousel:engine-error',
      {
        carousel,
        engine: engineName,
        fallback: !ready,
      },
    );
  }, [carousel, element, engineName, runtime]);

  return (
    <div
      className="cci-wpc-react-controls"
      data-wpc-react-enhancement="controls"
      style={{
        alignItems: 'center',
        display: 'flex',
        gap: '8px',
        justifyContent: 'flex-end',
        margin: '0 0 8px',
      }}
    >
      <button
        type="button"
        className="cci-wpc-react-prev"
        style={controlButtonStyle}
        onClick={() => triggerOwl(element, 'prev.owl.carousel')}
      >
        <NavigationIcon icon={previousIcon} />
        <span className="screen-reader-text">{previousLabel}</span>
      </button>
      <span className="cci-wpc-react-status" aria-live="polite" style={{ fontSize: '13px' }}>
        {label}
        {slides.length > 1 ? ` - ${current + 1}/${slides.length}` : ''}
      </span>
      <button
        type="button"
        className="cci-wpc-react-next"
        style={controlButtonStyle}
        onClick={() => triggerOwl(element, 'next.owl.carousel')}
      >
        <NavigationIcon icon={nextIcon} />
        <span className="screen-reader-text">{nextLabel}</span>
      </button>
    </div>
  );
}

function FrontendReactRenderer({ element, carousel, runtime }) {
  const defaultMode =
    element.dataset.wpcReactMode || (element.dataset.wpcRenderer === 'react' ? 'full' : 'enhance');
  const mode = runtime?.hooks.applyFilters('reactRendererMode', defaultMode, element, carousel);
  const renderFull = mode === 'render' || mode === 'full';
  const engineName = runtime ? resolveReactEngineName(runtime, element, carousel) : 'fallback';

  useEffect(() => {
    if (!renderFull) {
      return undefined;
    }

    const previousDisplay = element.style.display;
    const previousHidden = element.getAttribute('aria-hidden');
    const mountNode = element.previousElementSibling;
    let frame;
    const reveal = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        mountNode.removeAttribute('data-wpc-mounting');
        mountNode.style.removeProperty('width');
        element.style.display = 'none';
        element.setAttribute('aria-hidden', 'true');
      });
    };
    element.addEventListener('wp-posts-carousel:engine-ready', reveal);
    element.addEventListener('wp-posts-carousel:engine-error', reveal);
    if (engineName === 'fallback') reveal();

    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener('wp-posts-carousel:engine-ready', reveal);
      element.removeEventListener('wp-posts-carousel:engine-error', reveal);
      element.style.display = previousDisplay;

      if (previousHidden === null) {
        element.removeAttribute('aria-hidden');
      } else {
        element.setAttribute('aria-hidden', previousHidden);
      }
    };
  }, [element, renderFull, engineName]);

  if (renderFull) {
    const engineAdapter = runtime?.getEngine(engineName) || null;

    return (
      <CarouselRenderer
        carousel={carousel}
        engineAdapter={engineAdapter}
        engineName={engineName}
        interactive
        labels={{
          next: element.dataset.wpcNextLabel || 'next',
          previous: element.dataset.wpcPrevLabel || 'previous',
        }}
        layout="carousel"
        limit={0}
        sourceElement={element}
      />
    );
  }

  return <FrontendEnhancement element={element} carousel={carousel} runtime={runtime} />;
}

function ensureMountNode(element) {
  let mountNode = element.previousElementSibling;

  if (mountNode && mountNode.getAttribute('data-wpc-react-root') === 'true') {
    syncMountNodeMetadata(mountNode, element);
    return mountNode;
  }

  mountNode = (element.ownerDocument || document).createElement('div');
  mountNode.setAttribute('data-wpc-react-root', 'true');
  element.parentNode.insertBefore(mountNode, element);
  syncMountNodeMetadata(mountNode, element);

  return mountNode;
}

function syncMountNodeMetadata(mountNode, element) {
  const classes = ['cci-wpc-react-root'];
  const template = element.dataset.wpcTemplate || '';
  const engine = element.dataset.wpcEngine || '';
  const demoKey = element.dataset.wpcDemoKey || '';
  const vertical =
    engine === 'swiper' && element.wpPostsCarouselData?.engine?.options?.direction === 'vertical';
  mountNode.dataset.wpcDirection = vertical ? 'vertical' : 'horizontal';
  if (vertical) classes.push('cci-wpc-carousel');

  if (template) {
    classes.push(`cci-wpc-${template}-template-theme`);
    mountNode.dataset.wpcTemplate = template;
  } else {
    delete mountNode.dataset.wpcTemplate;
  }

  if (demoKey) {
    classes.push(`cci-wpc-demo-${demoKey}`);
    mountNode.dataset.wpcDemoKey = demoKey;
  } else {
    delete mountNode.dataset.wpcDemoKey;
  }

  if (engine) {
    classes.push(engine === 'owl-carousel' ? 'owl-carousel' : `cci-wpc-engine-${engine}`);
  }

  mountNode.className = classes.join(' ');
  mountNode.dataset.wpcSourceId = element.id || '';
  mountNode.dataset.wpcRenderer = 'react';
}

export function mount(element, carousel, runtime) {
  if (!element || !carousel) {
    return;
  }

  const mountNode = ensureMountNode(element);
  if (
    ['full', 'render'].includes(element.dataset.wpcReactMode) &&
    element.style.display !== 'none'
  ) {
    mountNode.dataset.wpcMounting = 'true';
    mountNode.style.width = `${element.getBoundingClientRect().width}px`;
  }
  let root = roots.get(mountNode);

  if (!root) {
    root = createRoot(mountNode);
    roots.set(mountNode, root);
  }

  element.classList.add('cci-wpc-react-enhanced');
  root.render(<FrontendReactRenderer element={element} carousel={carousel} runtime={runtime} />);
}

export function unmount(element) {
  const mountNode = element?.previousElementSibling;
  if (mountNode?.getAttribute('data-wpc-react-root') !== 'true') return;
  roots.get(mountNode)?.unmount();
  roots.delete(mountNode);
  mountNode.remove();
  element.classList.remove('cci-wpc-react-enhanced');
}
