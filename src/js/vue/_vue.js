/*
 * @Author: louzhedong 
 * @Date: 2020-04-02 20:00:52 
 * @Last Modified by: louzhedong
 * @Last Modified time: 2020-04-03 18:31:39
 * 简易vue
 */
import Watcher from './watcher';

function myVue(options) {
  this._init(options);
}

myVue.prototype._init = function (options) {
  this.$options = options;
  this.$el = document.querySelector(options.el);
  this.$data = options.data;
  this.$methods = options.methods;

  this._binding = {};
  this._observe(this.$data);
  this._compile(this.$el);
  const _this = this;

  // 双向绑定后，初始化数据
  Object.keys(this.$data).forEach(function (key) {
    if (_this.$data.hasOwnProperty(key)) {
      const _directives = _this._binding[key]._directives;
      _directives.map(function (item) {
        item.update();
      })
    }
  })
}


// 做数据劫持，实现双向绑定
myVue.prototype._observe = function (obj) {
  const _this = this;
  Object.keys(obj).forEach(function (key) {
    if (obj.hasOwnProperty(key)) {
      _this._binding[key] = {
        _directives: []
      };
      let value = obj[key];
      if (typeof value === 'object') {
        _this._observe(value);
      }
      const binding = _this._binding[key];
      Object.defineProperty(_this.$data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
          return value;
        },
        set: function (newVal) {
          if (value !== newVal) {
            value = newVal;
            binding._directives.forEach(function (item) {
              item.update();
            })
          }
        }
      })
    }
  })
}

// 编译DOM元素指令
myVue.prototype._compile = function (root) {
  const _this = this;
  const nodes = root.children;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.children.length) {
      this._compile(node);
    }

    if (node.hasAttribute('v-click')) {
      node.onclick = (function () {
        const attrVal = nodes[i].getAttribute('v-click');
        const methodName = attrVal.split('(')[0];
        /**
         * (?<=exp)是以exp开头的字符串, 但不包含本身.
         * (?=exp)就匹配惟exp结尾的字符串, 但不包含本身.
         */
        const regex = /(?<=\()\S+(?=\))/g;
        const attrValMatch = attrVal.match(regex);
        if (attrValMatch) { // v-click绑定的函数中有括号，说明带参数
          const parameter = attrVal.match(regex)[0];
          if (parameter.indexOf(`'`) > -1 || parameter.indexOf(`"`) > -1) {
            return _this.$methods[methodName].bind(_this.$data, parameter.replace(new RegExp(`'`, 'g'), '').replace(new RegExp(`"`, 'g'), ''));
          } else {
            return _this.$methods[methodName].bind(_this.$data, _this.data[parameter]);
          }
        } else {
          return _this.$methods[methodName].bind(_this.$data);
        }
      })();
    }

    if (node.hasAttribute('v-model') && (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA')) {
      node.addEventListener('input', (function (index) {
        const attrVal = node.getAttribute('v-model');
        _this._binding[attrVal]._directives.push(new Watcher(
          'input',
          node,
          _this,
          attrVal,
          'value'
        ));

        return function () {
          _this.$data[attrVal] = nodes[index].value;
        }
      })(i));
    }

    if (node.hasAttribute('v-bind')) {
      var attrVal = node.getAttribute('v-bind');
      _this._binding[attrVal]._directives.push(new Watcher(
        'text',
        node,
        _this,
        attrVal,
        'innerHTML'
      ))
    }
  }
}

export default myVue;