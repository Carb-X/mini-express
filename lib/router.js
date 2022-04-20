const Layer = require('./layer');
const Route = require('./route');
const { METHODS } = require('http');

class Router {
  constructor() {
    this._stack = [];
    METHODS.forEach((method) => {
      this[method.toLocaleLowerCase()] = this._method.bind(
        this,
        method.toLocaleLowerCase()
      );
    });
  }

  _route(path) {
    const route = new Route(path);
    const layer = new Layer(path, (req, res) => {
      route.dispatch(req, res);
    });
    layer.route = route;
    this._stack.push(layer);
    return route;
  }

  _method(method, path, fn) {
    const route = this._route(path);
    route[method](fn);
  }

  handle(req, res) {
    res.send = function (body) {
      res.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      res.end(body);
    };
    const matchLayer = this._stack.find(
      (layer) =>
        layer.match(req.url) &&
        !!layer.route &&
        layer.route.hasMethod(req.method)
    );
    matchLayer ? matchLayer.handle(req, res) : res.end('404');
  }
}

module.exports = Router;
