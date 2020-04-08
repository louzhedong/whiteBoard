import './css/style.css';
import Board from './js/board';
import myVue from './js/vue/_vue';

new myVue({
  el: '#app',
  data: {
    number: 1,
    mode: 'PENCIL',
    board: null
  },
  mounted() {
    const element = document.getElementById('whiteBoard');
    this.data.board = new Board(element);
    this.methods.increment.call(this.data);
  },
  methods: {
    increment: function () {
      this.number++;
    },

    choose: function (item) {
      this.mode = item;
      this.board.setMode(item);

      if (item === 'TEXT') {
        document.body.style.cursor = 'text';
      } else {
        document.body.style.cursor = 'default';
      }
    },

    undoOperate: function() {
      this.board.canvasUndoOrRedo('undo');
    },

    redoOperate: function() {
      this.board.canvasUndoOrRedo('redo');
    },

    cleanBoard: function() {
      this.board.clean();
    }
  }
})