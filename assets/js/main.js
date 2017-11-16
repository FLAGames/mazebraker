'use strict';

window.onload = function() {
  document.body.className = '';
};

window.ontouchmove = function() {
  return false;
};

window.onorientationchange = function() {
  document.body.scrollTop = 0;
};

//function setNavLinks() {
//   var nav = document.getElementById('nav');
//   var ulEl = document.createElement('ul');
//   ulEl.setAttribute("id","list");// gives created row an ID.
//
//
//     //liEl.textContent = (<a href="index.html">Home</a>);
//     // liEl.textContent = ('<a href="#">Link 1</a>');
//     // liEl.textContent = ('<a href="#">Link 2</a>');
//     // liEl.textContent = ('<a href="#">Link 3</a>');
//     // liEl.textContent = ('<a href="#">Link 4</a>');
//   list.appendChild(liEl);
//
// };

//setNavLinks();
