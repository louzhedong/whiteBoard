/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports) {

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

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7O0FBRWxCLG1CQUFtQjtBQUNuQixjQUFjOztBQUVkO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0EsS0FBSztBQUNMOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDIiwiZmlsZSI6Im1haW4uYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9pbmRleC5qc1wiKTtcbiIsImxldCBtb3VzZVggPSAxMDAsXG4gIG1vdXNlWSA9IDEwMCxcbiAgbGluZUNvbG9yID0gJ3JlZCcsXG4gIGxpbmVTaGFwZSA9ICcuJyxcbiAgbGluZVdpZHRoID0gMTAsXG4gIGNhbnZhc19lbGVtZW50LFxuICBjYW52YXNfY29udGV4dCxcbiAgY2FudmFzX3dpZHRoLFxuICBjYW52YXNfaGVpZ2h0LFxuICBvbGRQb3NpdGlvbiwgICAgLy8g6ICB55qE5Z2Q5qCHXG4gIGRyYXdpbmcgPSBmYWxzZSwgLy8g5piv5ZCm5q2j5Zyo55S75Zu+XG4gIG1vZGUgPSAnUEVOQ0lMJzsgIC8vIFBFTkNJTCwgRVJBU0VSXG5cbmxldCBzbmFwc2hvb3QgPSBbXTsgLy8g5b+r54WnXG5sZXQgc3RlcCA9IC0xOyAvLyDlvZPliY3nmoTlv6vnhafntKLlvJVcblxuLyoqXG4gKiDnlLvnrJRcbiAqIEBwYXJhbSB7fSBwb3MgXG4gKiBcbiAqL1xuZnVuY3Rpb24gZHJhd19jYW52YXMocG9zKSB7XG4gIGlmIChvbGRQb3NpdGlvbikge1xuICAgIGNhbnZhc19jb250ZXh0LnN0cm9rZVN0eWxlID0gbGluZUNvbG9yO1xuICAgIGNhbnZhc19jb250ZXh0LmxpbmVXaWR0aCA9IGxpbmVXaWR0aDtcbiAgICBjYW52YXNfY29udGV4dC5saW5lQ2FwID0gJ3JvdW5kJztcbiAgICBjYW52YXNfY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICBjYW52YXNfY29udGV4dC5tb3ZlVG8ob2xkUG9zaXRpb24ueCwgb2xkUG9zaXRpb24ueSk7XG4gICAgY2FudmFzX2NvbnRleHQubGluZVRvKHBvcy54LCBwb3MueSk7XG4gICAgY2FudmFzX2NvbnRleHQuc3Ryb2tlKCk7XG4gICAgY2FudmFzX2NvbnRleHQuY2xvc2VQYXRoKCk7XG4gIH1cbn1cblxuLyoqXG4gKiDmqaHnmq7mk6ZcbiAqIEBwYXJhbSB7fSBwb3MgXG4gKi9cbmZ1bmN0aW9uIGVyYXNlcihwb3MpIHtcbiAgaWYgKG9sZFBvc2l0aW9uKSB7XG4gICAgY2FudmFzX2NvbnRleHQuc3Ryb2tlU3R5bGUgPSAnI2ZmZic7XG4gICAgY2FudmFzX2NvbnRleHQubGluZVdpZHRoID0gMjA7XG4gICAgY2FudmFzX2NvbnRleHQubGluZUNhcCA9ICdyb3VuZCc7XG4gICAgY2FudmFzX2NvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgY2FudmFzX2NvbnRleHQubW92ZVRvKG9sZFBvc2l0aW9uLngsIG9sZFBvc2l0aW9uLnkpO1xuICAgIGNhbnZhc19jb250ZXh0LmxpbmVUbyhwb3MueCwgcG9zLnkpO1xuICAgIGNhbnZhc19jb250ZXh0LnN0cm9rZSgpO1xuICAgIGNhbnZhc19jb250ZXh0LmNsb3NlUGF0aCgpO1xuICB9XG59XG5cbi8qKlxuICog5riF56m655S75biDXG4gKi9cbmZ1bmN0aW9uIGNsZWFuKCkge1xuICBjYW52YXNfY29udGV4dC5maWxsU3R5bGUgPSAnI2ZmZic7XG4gIGNhbnZhc19jb250ZXh0LmJlZ2luUGF0aCgpO1xuICBjYW52YXNfY29udGV4dC5maWxsUmVjdCgwLCAwLCBjYW52YXNfd2lkdGgsIGNhbnZhc19oZWlnaHQpO1xuICBjYW52YXNfY29udGV4dC5jbG9zZVBhdGgoKTtcbn1cblxuZnVuY3Rpb24gbW91c2VQb3NpdGlvbihlKSB7XG4gIGNvbnN0IGV2ZW50ID0gZSB8fCB3aW5kb3cuZXZlbnQ7XG4gIGxldCB4LCB5O1xuICB4ID0gZXZlbnQuY2xpZW50WCArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0O1xuICB5ID0gZXZlbnQuY2xpZW50WSArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XG4gIHJldHVybiB7IHgsIHkgfTtcbn1cblxuLy8g6K6+572u5b2T5YmN6byg5qCH55qE5Z2Q5qCH5L2N572uXG5mdW5jdGlvbiBzZXRQb3NpdGlvbihlKSB7XG4gIGNvbnN0IGV2ZW50ID0gZSB8fCB3aW5kb3cuZXZlbnQ7XG4gIGNvbnN0IHBvc2l0aW9uID0gbW91c2VQb3NpdGlvbihlKTtcbiAgbW91c2VYID0gcG9zaXRpb24ueDtcbiAgbW91c2VZID0gcG9zaXRpb24ueTtcbiAgLy8g55S756yUXG4gIGlmIChtb2RlID09PSAnUEVOQ0lMJykge1xuICAgIGRyYXdfY2FudmFzKHBvc2l0aW9uKTtcbiAgfSBlbHNlIGlmIChtb2RlID09PSAnRVJBU0VSJykge1xuICAgIGVyYXNlcihwb3NpdGlvbik7XG4gIH1cblxuICBvbGRQb3NpdGlvbiA9IHBvc2l0aW9uO1xufVxuXG4vLyDkv53lrZjlvZPliY3nlLvluIPliLDlv6vnhadcbmZ1bmN0aW9uIHNhdmVDdXJyZW50VG9TbmFwc2hvb3QoKSB7XG4gIHN0ZXArKztcbiAgaWYgKHN0ZXAgPCBzbmFwc2hvb3QubGVuZ3RoKSB7XG4gICAgc25hcHNob290Lmxlbmd0aCA9IHN0ZXA7XG4gIH1cbiAgc25hcHNob290LnB1c2goY2FudmFzX2VsZW1lbnQudG9EYXRhVVJMKCkpO1xufVxuXG4vKipcbiAqIOaSpOmUgOWSjOWPjeaSpOmUgFxuICogdHlwZSDkuLogdW5kbywgcmVkb1xuICovXG5mdW5jdGlvbiBjYW52YXNVbmRvT3JSZWRvKHR5cGUpIHtcbiAgaWYgKHN0ZXAgPj0gMCAmJiB0eXBlID09PSAndW5kbycpIHtcbiAgICBzdGVwLS07XG4gICAgb3BlcmF0ZSgpO1xuICB9XG4gIGlmIChzdGVwIDw9IHNuYXBzaG9vdC5sZW5ndGggJiYgdHlwZSA9PT0gJ3JlZG8nKSB7XG4gICAgc3RlcCsrO1xuICAgIG9wZXJhdGUoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9wZXJhdGUoKSB7XG4gICAgbGV0IGltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgaW1hZ2Uuc3JjID0gc25hcHNob290W3N0ZXBdO1xuICAgIGltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgY2FjaGVDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgIGxldCBjYWNoZUN0eCA9IGNhY2hlQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICBjYWNoZUNhbnZhcy53aWR0aCA9IGNhbnZhc193aWR0aDtcbiAgICAgIGNhY2hlQ2FudmFzLmhlaWdodCA9IGNhbnZhc19oZWlnaHQ7XG4gICAgICBjYWNoZUN0eC5kcmF3SW1hZ2UoaW1hZ2UsIDAsIDApO1xuICAgICAgY2FudmFzX2NvbnRleHQuY2xlYXJSZWN0KDAsIDAsIGNhbnZhc193aWR0aCwgY2FudmFzX2hlaWdodCk7XG4gICAgICBjYW52YXNfY29udGV4dC5kcmF3SW1hZ2UoY2FjaGVDYW52YXMsIDAsIDApO1xuICAgICAgY2FjaGVDYW52YXMgPSBudWxsOyAgLy8g5Zue5pS25Y+Y6YePXG4gICAgICBjYWNoZUN0eCA9IG51bGw7XG4gICAgfSlcbiAgfVxuXG59XG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2hpdGVCb2FyZCcpO1xuICBjYW52YXNfZWxlbWVudCA9IGVsZW1lbnQ7XG4gIGNhbnZhc19jb250ZXh0ID0gZWxlbWVudC5nZXRDb250ZXh0KCcyZCcpO1xuICBjYW52YXNfd2lkdGggPSBjYW52YXNfZWxlbWVudC53aWR0aDtcbiAgY2FudmFzX2hlaWdodCA9IGNhbnZhc19lbGVtZW50LmhlaWdodDtcblxuICBjb25zdCAkcGVuY2lsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBlbmNpbCcpO1xuICBjb25zdCAkZXJhc2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVyYXNlcicpO1xuICBjb25zdCAkY2xlYW4gPSB0aGlzLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jbGVhbicpO1xuICAkcGVuY2lsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIG1vZGUgPSAnUEVOQ0lMJztcbiAgfSk7XG5cbiAgJGVyYXNlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBtb2RlID0gJ0VSQVNFUic7XG4gIH0pO1xuXG4gICRjbGVhbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBjbGVhbigpO1xuICB9KVxuXG4gIGVsZW1lbnQub25tb3VzZWRvd24gPSBmdW5jdGlvbiAoZSkge1xuICAgIGRyYXdpbmcgPSB0cnVlO1xuICB9XG5cbiAgZWxlbWVudC5vbm1vdXNlbW92ZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKGRyYXdpbmcpIHNldFBvc2l0aW9uKGUpO1xuICB9XG5cbiAgZWxlbWVudC5vbm1vdXNldXAgPSBmdW5jdGlvbiAoZSkge1xuICAgIGRyYXdpbmcgPSBmYWxzZTtcbiAgICBvbGRQb3NpdGlvbiA9IHt9O1xuICAgIHNhdmVDdXJyZW50VG9TbmFwc2hvb3QoKTtcbiAgfVxufSJdLCJzb3VyY2VSb290IjoiIn0=