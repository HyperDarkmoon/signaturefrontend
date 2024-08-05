import React, { useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function DrawingCanvas() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState([]);
  const lineWidth = 5; // Uniform line thickness

  const startDrawing = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    setIsDrawing(true);
    setStrokes([...strokes, [{ offsetX, offsetY }]]);
  };

  const draw = (event) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = event.nativeEvent;
    const newStrokes = [...strokes];
    newStrokes[newStrokes.length - 1].push({ offsetX, offsetY });
    setStrokes(newStrokes);

    const ctx = canvasRef.current.getContext('2d');
    ctx.lineWidth = lineWidth; // Ensure uniform thickness
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    const stroke = newStrokes[newStrokes.length - 1];
    ctx.beginPath();
    ctx.moveTo(stroke[0].offsetX, stroke[0].offsetY);
    stroke.forEach(point => {
      ctx.lineTo(point.offsetX, point.offsetY);
    });
    ctx.stroke();
    ctx.closePath();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const resetCanvas = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillStyle = 'white'; // Set background color
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Fill canvas with background color
    setStrokes([]);
  };

  const redraw = (strokes) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillStyle = 'white'; // Set background color
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Fill canvas with background color
    ctx.lineWidth = lineWidth; // Ensure uniform thickness
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    strokes.forEach(stroke => {
      ctx.beginPath();
      ctx.moveTo(stroke[0].offsetX, stroke[0].offsetY);
      stroke.forEach(point => {
        ctx.lineTo(point.offsetX, point.offsetY);
      });
      ctx.stroke();
      ctx.closePath();
    });
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const imageUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'drawing.png';
    link.click();
  };

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseMove={draw}
            onMouseLeave={stopDrawing} // Ensure drawing stops when the mouse leaves the canvas
            style={{ border: '1px solid black', display: 'block', margin: '0 auto' }}
          />
        </div>
      </div>
      <div className="row mt-2">
        <div className="col text-center">
          <button className="btn btn-danger mr-2" onClick={resetCanvas}>Reset</button>
          <button className="btn btn-success" onClick={downloadImage}>Download</button>
        </div>
      </div>
    </div>
  );
}

export default DrawingCanvas;
