'use strict';

var generateBlocks = function() {
  var count = 0;
  for (var i = 100; i < 600; i += 30){
    for (var j = 100; j < 600; j += 30){
      if ((Math.floor(Math.random() * 10) < 5)){
        block [count] = new Blocks(i, j, 20, 20);
        count++;
      } // end if
    } // next j
  } // next i
};

generateBlocks();
