const Layer = require('./layer');
const { METHODS } = require('http');
class Route {
  constructor(path) {
    this.path = path;
    this._stack = [];
    this.methods = {};
    METHODS.forEach((method) => {
      this[method.toLocaleLowerCase()] = this._method.bind(this, method);
    });
  }

  hasMethod(method) {
    return Boolean(this.methods[method]);
  }

  _method(method, fn) {
    const layer = new Layer('/', fn);
    layer.method = method;
    this.methods[method] = true;
    this._stack.push(layer);
  }

  dispatch(req, res) {
    const layer = this._stack.find(({ method }) => req.method === method);
    !!layer && layer.handleReq(req, res);
  }
}

// 批量添加 class method 的另一种写法
// METHODS.forEach((method) => {
//   Route.prototype[method.toLocaleLowerCase()] = function (fn) {
//     this._method(method, fn);
//   };
// });

module.exports = Route;
