/* eslint-disable no-console */
'use strict';

class MyEventEmitter {
  constructor() {
    this.events = new Map();
  }
  on(event, ...callbacks) {
    if (!this.events.has(event)) {
      this.events.set(event, [...callbacks]);
    } else {
      this.events.get(event).push(...callbacks);
    }
  }
  once(event, cb) {
    const wrapper = (...args) => {
      cb(...args);
      this.off(event, wrapper);
    };

    this.on(event, wrapper);
  }
  off(event, cb) {
    this.events.set(
      event,
      this.events.get(event).filter((listener) => listener !== cb),
    );
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
    const wrapper = (...args) => {
      cb(...args);
      this.off(event, wrapper);
    };

    if (this.events.has(event)) {
      this.events.get(event).unshift(wrapper);
    } else {
      this.events.set(event, [wrapper]);
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
