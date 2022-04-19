const Layer = require('./layer');
const Route = require('./route');

class Router {
  constructor() {
    this._stack = [];
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

  get(path, fn) {
    const route = this._route(path);
    route.get(fn);
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
