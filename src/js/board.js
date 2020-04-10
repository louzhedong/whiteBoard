/*
 * @Author: louzhedong 
 * @Date: 2020-04-02 20:00:57 
 * @Last Modified by: louzhedong
 * @Last Modified time: 2020-04-09 19:38:46
 * 白板插件
 */
function Board($el) {
  this.mouseX = 100;
  this.mouseY = 100;
  this.lineColor = 'red';
  this.lineShape = '.';
  this.lineWidth = 10;
  this.canvas_element = null;
  this.canvas_context = null;
  this.canvas_width = 0;
  this.canvas_height = 0;
  this.oldPosition = {};    // 老的坐标
  this.drawing = false; // 是否正在画图
  this.mode = 'PENCIL';  // PENCIL; ERASER; TEXT

  this.snapshoot = []; // 快照
  this.step = -1; // 当前的快照索引
  this.init($el);
}

Board.prototype.init = function ($el) {
  this.canvas_element = $el;
  this.canvas_context = $el.getContext('2d');
  this.canvas_width = this.canvas_element.width;
  this.canvas_height = this.canvas_element.height;

  const _this = this;
  $el.onmousedown = (e) => {
    if (this.mode === 'TEXT') {  // 文字，就出现文本输入框
      const box = document.createElement('div');
      box.id = Math.random() * 10000;
      box.style.width = '100px';
      box.style.height = '40px';
      box.style.border = '1px solid #dadada';
      const position = this.mousePosition(e);
      box.style.position = 'absolute';
      box.style.left = position.x;
      box.style.top = position.y - 20;
      box.style.cursor = 'text';
      document.documentElement.appendChild(box);
    } else {
      _this.drawing = true;
    }
  }
  $el.onmousemove = (e) => {
    if (this.mode === 'TEXT') {

    } else {
      if (_this.drawing) _this.setPosition(e);
    }

  }
  $el.onmouseup = (e) => {
    if (this.mode === 'TEXT') {

    } else {
      _this.drawing = false;
      _this.oldPosition = {};
      _this.saveCurrentToSnapshoot();
    }
  }
}

// 设置Board的mode
Board.prototype.setMode = function (mode) {
  this.mode = mode;
}

// 画笔
Board.prototype.draw_canvas = function (pos) {
  if (this.oldPosition) {
    const canvas_context = this.canvas_context;
    canvas_context.strokeStyle = this.lineColor;
    canvas_context.lineWidth = this.lineWidth;
    canvas_context.lineCap = 'round';
    canvas_context.beginPath();
    canvas_context.moveTo(this.oldPosition.x, this.oldPosition.y);
    canvas_context.lineTo(pos.x, pos.y);
    canvas_context.stroke();
    canvas_context.closePath();
  }
}

// 橡皮擦
Board.prototype.eraser = function (pos) {
  if (this.oldPosition) {
    const canvas_context = this.canvas_context;
    canvas_context.strokeStyle = '#fff';
    canvas_context.lineWidth = 20;
    canvas_context.lineCap = 'round';
    canvas_context.beginPath();
    canvas_context.moveTo(this.oldPosition.x, this.oldPosition.y);
    canvas_context.lineTo(pos.x, pos.y);
    canvas_context.stroke();
    canvas_context.closePath();
  }
}

Board.prototype.clean = function () {
  const canvas_context = this.canvas_context;
  canvas_context.fillStyle = '#fff';
  canvas_context.beginPath();
  canvas_context.fillRect(0, 0, this.canvas_width, this.canvas_height);
  canvas_context.closePath();
}

Board.prototype.mousePosition = function (e) {
  const event = e || window.event;
  let x, y;
  x = event.clientX + document.documentElement.scrollLeft;
  y = event.clientY + document.documentElement.scrollTop;
  return { x, y };
}

// 设置当前鼠标的坐标位置
Board.prototype.setPosition = function (e) {
  const event = e || window.event;
  const position = this.mousePosition(e);
  this.mouseX = position.x;
  this.mouseY = position.y;
  // 画笔
  if (this.mode === 'PENCIL') {
    this.draw_canvas(position);
  } else if (this.mode === 'ERASER') {
    this.eraser(position);
  }

  this.oldPosition = position;
}

// 保存当前画布到快照
Board.prototype.saveCurrentToSnapshoot = function () {
  this.step++;
  if (this.step < this.snapshoot.length) {
    this.snapshoot.length = this.step;
  }
  this.snapshoot.push(this.canvas_element.toDataURL());
}

// 撤销和反撤销 type 为 undo, redo
Board.prototype.canvasUndoOrRedo = function (type) {
  const _this = this;
  if (this.step > 0 && type === 'undo') {
    this.step--;
    operate();
  }
  if (this.step >= 0 && this.step <= this.snapshoot.length && type === 'redo') {
    this.step++;
    operate();
  }

  function operate() {
    let image = new Image();
    image.src = _this.snapshoot[_this.step];
    image.addEventListener('load', function () {
      let cacheCanvas = document.createElement('canvas');
      let cacheCtx = cacheCanvas.getContext('2d');
      cacheCanvas.width = _this.canvas_width;
      cacheCanvas.height = _this.canvas_height;
      cacheCtx.drawImage(image, 0, 0);
      _this.canvas_context.clearRect(0, 0, _this.canvas_width, _this.canvas_height);
      _this.canvas_context.drawImage(cacheCanvas, 0, 0);
      cacheCanvas = null;  // 回收变量
      cacheCtx = null;
    })
  }
}

export default Board;