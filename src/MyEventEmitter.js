/* eslint-disable no-console */
'use strict';

class MyEventEmitter {
  constructor() {
    this.events = new Map();
  }
  _onceWrapper(event, cb) {
    const wrapper = (...args) => {
      cb(...args);
      this.off(event, wrapper);
    };

    return wrapper;
  }
  on(event, ...callbacks) {
    if (!this.events.has(event)) {
      this.events.set(event, [...callbacks]);
    } else {
      this.events.get(event).push(...callbacks);
    }
  }
  once(event, cb) {
    this.on(event, this._onceWrapper(event, cb));
  }
  off(event, cb) {
    const listeners = this.events.get(event);

    if (listeners) {
      this.events.set(
        event,
        listeners.filter((listener) => listener !== cb),
      );
    }
  }
  emit(event, ...args) {
    if (this.events.has(event)) {
      for (const listener of this.events.get(event)) {
        listener(...args);
      }
    }
  }
  prependListener(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, [callback]);
    } else {
      this.events.get(event).unshift(callback);
    }
  }
  prependOnceListener(event, cb) {
    const prependOnceWrapper = this._onceWrapper(event, cb);

    if (this.events.has(event)) {
      this.events.get(event).unshift(prependOnceWrapper);
    } else {
      this.events.set(event, [prependOnceWrapper]);
    }
  }
  removeAllListeners(eventName) {
    if (this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
  }
  listenerCount(event) {
    if (this.events.has(event)) {
      return this.events.get(event).length;
    }

    return 0;
  }
}

module.exports = MyEventEmitter;
