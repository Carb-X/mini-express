const Layer = require('./layer');

class Route {
  constructor(path) {
    this.path = path;
    this._stack = [];
    this.methods = {};
  }

  hasMethod(method) {
    return Boolean(this.methods[method]);
  }

  get(fn) {
    const layer = new Layer('/', fn);
    layer.method = 'GET';
    this.methods['GET'] = true;
    this._stack.push(layer);
  }

  dispatch(req, res) {
    const layer = this._stack.find(({ method }) => req.method === method);
    !!layer && layer.handleReq(req, res);
  }
}

module.exports = Route;
