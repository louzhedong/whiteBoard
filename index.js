import './style.css';
import Board from './board';

window.onload = function () {
  const element = document.getElementById('whiteBoard');
  const board = new Board(element);
}