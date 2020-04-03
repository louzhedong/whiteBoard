/**
 * 
 * @param {*} name 指令名称，例如文本节点，设置为text
 * @param {*} el 指令对应的DOM元素
 * @param {*} vm vue实例
 * @param {*} key 指令对应的值，data中的属性
 * @param {*} attr 绑定的元素属性值，例如innerHTML
 */
function Watcher(name, el, vm, key, attr) {
  this.name = name;
  this.el = el;
  this.vm = vm;
  this.key = key;
  this.attr = attr;
}

Watcher.prototype.update = function() {
  this.el[this.attr] = this.vm.$data[this.key];
}

export default Watcher;