import './style.css';

let mouseX = 100,
  mouseY = 100,
  lineColor = 'red',
  lineShape = '.',
  lineWidth = 10,
  canvas_element,
  canvas_context,
  canvas_width,
  canvas_height,
  oldPosition,    // 老的坐标
  drawing = false, // 是否正在画图
  mode = 'PENCIL';  // PENCIL, ERASER

let snapshoot = []; // 快照
let step = -1; // 当前的快照索引

/**
 * 画笔
 * @param {} pos 
 * 
 */
function draw_canvas(pos) {
  if (oldPosition) {
    canvas_context.strokeStyle = lineColor;
    canvas_context.lineWidth = lineWidth;
    canvas_context.lineCap = 'round';
    canvas_context.beginPath();
    canvas_context.moveTo(oldPosition.x, oldPosition.y);
    canvas_context.lineTo(pos.x, pos.y);
    canvas_context.stroke();
    canvas_context.closePath();
  }
}

/**
 * 橡皮擦
 * @param {} pos 
 */
function eraser(pos) {
  if (oldPosition) {
    canvas_context.strokeStyle = '#fff';
    canvas_context.lineWidth = 20;
    canvas_context.lineCap = 'round';
    canvas_context.beginPath();
    canvas_context.moveTo(oldPosition.x, oldPosition.y);
    canvas_context.lineTo(pos.x, pos.y);
    canvas_context.stroke();
    canvas_context.closePath();
  }
}

/**
 * 清空画布
 */
function clean() {
  canvas_context.fillStyle = '#fff';
  canvas_context.beginPath();
  canvas_context.fillRect(0, 0, canvas_width, canvas_height);
  canvas_context.closePath();
}

function mousePosition(e) {
  const event = e || window.event;
  let x, y;
  x = event.clientX + document.documentElement.scrollLeft;
  y = event.clientY + document.documentElement.scrollTop;
  return { x, y };
}

// 设置当前鼠标的坐标位置
function setPosition(e) {
  const event = e || window.event;
  const position = mousePosition(e);
  mouseX = position.x;
  mouseY = position.y;
  // 画笔
  if (mode === 'PENCIL') {
    draw_canvas(position);
  } else if (mode === 'ERASER') {
    eraser(position);
  }

  oldPosition = position;
}

// 保存当前画布到快照
function saveCurrentToSnapshoot() {
  step++;
  if (step < snapshoot.length) {
    snapshoot.length = step;
  }
  snapshoot.push(canvas_element.toDataURL());
}

/**
 * 撤销和反撤销
 * type 为 undo, redo
 */
function canvasUndoOrRedo(type) {
  if (step >= 0 && type === 'undo') {
    step--;
    operate();
  }
  if (step <= snapshoot.length && type === 'redo') {
    step++;
    operate();
  }

  function operate() {
    let image = new Image();
    image.src = snapshoot[step];
    image.addEventListener('load', function () {
      let cacheCanvas = document.createElement('canvas');
      let cacheCtx = cacheCanvas.getContext('2d');
      cacheCanvas.width = canvas_width;
      cacheCanvas.height = canvas_height;
      cacheCtx.drawImage(image, 0, 0);
      canvas_context.clearRect(0, 0, canvas_width, canvas_height);
      canvas_context.drawImage(cacheCanvas, 0, 0);
      cacheCanvas = null;  // 回收变量
      cacheCtx = null;
    })
  }

}

window.onload = function () {
  const element = document.getElementById('whiteBoard');
  canvas_element = element;
  canvas_context = element.getContext('2d');
  canvas_width = canvas_element.width;
  canvas_height = canvas_element.height;

  const $pencil = document.querySelector('.pencil');
  const $eraser = document.querySelector('.eraser');
  const $clean = this.document.querySelector('.clean');
  $pencil.addEventListener('click', function () {
    mode = 'PENCIL';
  });

  $eraser.addEventListener('click', function () {
    mode = 'ERASER';
  });

  $clean.addEventListener('click', function () {
    clean();
  })

  element.onmousedown = function (e) {
    drawing = true;
  }

  element.onmousemove = function (e) {
    if (drawing) setPosition(e);
  }

  element.onmouseup = function (e) {
    drawing = false;
    oldPosition = {};
    saveCurrentToSnapshoot();
  }
}