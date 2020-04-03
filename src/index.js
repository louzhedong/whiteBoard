import './css/style.css';
import Board from './js/board';
import myVue from './js/vue/_vue';

window.onload = function () {
  const element = document.getElementById('whiteBoard');
  const board = new Board(element);

  new myVue({
    el: '#app',
    data: {
      number: 1,
      mode: 'PENCIL'
    },
    methods: {
      increment: function () {
        this.number++;
      },

      choose: function(item) {
        this.mode = item;
      }
    }
  })
}