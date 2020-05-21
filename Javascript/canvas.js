let canvasButton = document.getElementById('submit-canvas-button');
let canvasContainer = document.getElementById('canvasContainer');
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let clearButton = document.getElementById('clear-button');
let painting = false;
let blankCanvas = canvas.toDataURL();
let canvasError = document.getElementById('canvasErrorMsg'); 

  // canvas
  window.addEventListener('load', function triggerCanvas() {
    canvas.width = 300;
    canvas.height = 150;

    function startDraw(e) {
      painting = true;
      drawing(e);
    }
    function stopDraw() {
      painting = false;
      ctx.beginPath();
    }
    function drawing(e) {
      if(!painting) return; 
      ctx.lineWidth = 2;
      ctx.lineCap = 'butt';
      ctx.lineTo(e.layerX, e.layerY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.layerX, e.layerY);
    }
    function clearDraw() {  
      clearButton = ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    // returns true if all color channels in each pixel are 0 (or "blank")
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mouseup', stopDraw);
    //canvas.addEventListener('mouseout', stopDraw);
    canvas.addEventListener('mouseleave', stopDraw);
    canvas.addEventListener('mousemove', drawing);
    clearButton.addEventListener('click', clearDraw);
  });

