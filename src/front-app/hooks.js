function normalizePriority(priority) {
  const parsed = parseInt(priority, 10);

  return Number.isNaN(parsed) ? 10 : parsed;
}

function createStore() {
  return {
    actions: {},
    filters: {},
  };
}

function addHook(store, type, hookName, namespace, callback, priority) {
  if (!hookName || !namespace || typeof callback !== 'function') {
    return;
  }

  if (!store[type][hookName]) {
    store[type][hookName] = [];
  }

  store[type][hookName].push({
    callback,
    namespace,
    priority: normalizePriority(priority),
  });

  store[type][hookName].sort((a, b) => a.priority - b.priority);
}

function removeHook(store, type, hookName, namespace) {
  if (!store[type][hookName] || !namespace) {
    return;
  }

  store[type][hookName] = store[type][hookName].filter((hook) => hook.namespace !== namespace);
}

export function createHooks() {
  const store = createStore();

  return {
    addAction(hookName, namespace, callback, priority) {
      addHook(store, 'actions', hookName, namespace, callback, priority);
    },
    removeAction(hookName, namespace) {
      removeHook(store, 'actions', hookName, namespace);
    },
    doAction(hookName, ...args) {
      (store.actions[hookName] || []).forEach((hook) => {
        hook.callback(...args);
      });
    },
    addFilter(hookName, namespace, callback, priority) {
      addHook(store, 'filters', hookName, namespace, callback, priority);
    },
    removeFilter(hookName, namespace) {
      removeHook(store, 'filters', hookName, namespace);
    },
    applyFilters(hookName, value, ...args) {
      return (store.filters[hookName] || []).reduce(
        (filtered, hook) => hook.callback(filtered, ...args),
        value,
      );
    },
  };
}
