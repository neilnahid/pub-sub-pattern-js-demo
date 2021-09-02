const EventBusFactory = () => {
  const listeners = {};

  const fire = (event, payload) => {
    // publish an event listener
    let result;
    if (listeners[event])
      result = listeners[event].map((listener) => listener(payload));
    return result;
  };
  const listen = (event, listener) => {
    // create an event listener
    if (
      event &&
      listener &&
      typeof listener === "function" &&
      typeof event === "string"
    ) {
      if (Array.isArray(listeners[event]))
        listeners[event] = [...listeners[event], listener];
      else listeners[event] = [listener];
    }
  };

  const unsubscribe = (event, removeListener) => {
    // unsubscribe a listener from event
    if (listeners[event] && removeListener) {
      const listenerIndex = listeners[event].indexOf(removeListener);
      listeners[event].splice(listenerIndex, 1);
    }
  };

  return {
    fire,
    listen,
    unsubscribe,
  };
};
module.exports = EventBusFactory;
