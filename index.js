var raf = require('raf');

/**
 * Queue, for only one requestAnimationFrame() call per frame,
 * improves performance on some older mobile devices.
 *
 */
function RafQueue() {
  this.id = undefined;
  this.last = 0;

  this.entries = [];
  this.handles = {};
}

/**
 * @returns {number} Handle id.
 */
RafQueue.prototype.push = function (cb) {
  if (this.last === Number.MAX_SAFE_INTEGER) {
    this.last = 0;
  }

  var handle = this.last++;
  this.entries.push(cb);
  this.handles[handle] = cb;
  this._raf();
  return handle;
};

RafQueue.prototype._raf = function () {
  if (this.id) return;

  this.id = raf(() => {
    this.id = undefined;

    var entries = this.entries;
    this.entries = [];
    this.handles = {};

    for (var i = 0; i < entries.length; i++) {
      entries[i]();
    }
  });
};

/**
 * @returns {boolean}
 */
RafQueue.prototype.cancel = function (handle) {
  var cb = this.handles[handle];
  if (!cb) return false;

  var index = this.entries.indexOf(cb);
  if (index === -1) throw new Error();
  this.entries.splice(index, 1);
  return true;
};

module.exports = new RafQueue();
