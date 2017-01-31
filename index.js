const raf = require('raf');

class RafQueue {
  constructor () {
    this.id = undefined;
    this.last = 0;

    this.entries = [];
    this.handles = {};
    this.runner = this.run.bind(this);
  }
  
  /**
   * @returns {number} Handle id.
   */
  push (cb) {
    if (this.last === Number.MAX_SAFE_INTEGER) {
      this.last = 0;
    }

    var handle = this.last++;
    this.entries.push(cb);
    this.handles[handle] = cb;
    this._raf();
    return handle;
  };
  
  /**
   * Run queued frames.
   */
  run () {
    this.id = undefined;

    var entries = this.entries;
    this.entries = [];
    this.handles = {};

    for (var i = 0; i < entries.length; i++) {
      entries[i]();
    }
  }

  _raf () {
    if (this.id) return;
    this.id = raf(this.runner);
  };

  /**
   * @returns {boolean} If handle was found and cancelled.
   */
  cancel (handle) {
    var cb = this.handles[handle];
    if (!cb) return false;

    var index = this.entries.indexOf(cb);
    if (index === -1) throw new Error();
    this.entries.splice(index, 1);
    return true;
  };
}

module.exports = new RafQueue();
