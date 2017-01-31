rafqueue
========

batch together calls to window.requestAnimationFrame

improves performance on older devices

```javascript
const rafqueue = require('rafqueue');

var id = rafqueue.push(function () {
  document.body.innerHTML = 'ts ' + Date.now();
});

rafqueue.cancel(id);
```
