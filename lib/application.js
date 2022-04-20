const http = require('http');
const Router = require('./router');

class Application {
  constructor() {
    this._router = new Router();
  }
  listen(...args) {
    // 将 handle 作为 server 的 requestListener，处理所有请求
    const handle = (req, res) => this._router.handle(req, res);
    const server = http.createServer(handle.bind(this));
    return server.listen(...args);
  }
  get(path, fn) {
    this._router.get(path, fn);
  }
}

module.exports = Application;
