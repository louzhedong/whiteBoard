const { compilation } = require('webpack');

class HelloPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('HelloCompilationPlugin', compilation => {
      compilation.hooks.optimize.tap('HelloCompilationPlugin', () => {
        console.log('Assets are being optimized');
      });
    });
  }
}

module.exports = HelloPlugin;
