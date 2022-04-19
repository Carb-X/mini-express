class Layer {
  constructor(path, fn) {
    this.path = path;
    this.handle = fn;
  }
  handleReq(req, res) {
    this.handle(req, res);
  }
  match(path) {
    return path === this.path;
  }
}

module.exports = Layer;
