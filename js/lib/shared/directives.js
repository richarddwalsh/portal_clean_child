// sharedDirectives.js
console.log('loading shared directives');
const clickOutsideHandlerMap = new Map();

window.clickOutsideDirective = {
  bind(el, binding, vnode) {
    function clickOutsideHandler(event) {
      if (!(el === event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event);
      }
    }

    clickOutsideHandlerMap.set(el, clickOutsideHandler);
    document.addEventListener('click', clickOutsideHandler, true);
  },
  unbind(el) {
    const handler = clickOutsideHandlerMap.get(el);
    if (handler) {
      document.removeEventListener('click', handler);
      clickOutsideHandlerMap.delete(el);
    }
  },
};