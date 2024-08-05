import React, { useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function DrawingCanvas({ onClose }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState([]);
  const [lastPoint, setLastPoint] = useState(null);
  const lineWidth = 5; // Uniform line thickness

  const startDrawing = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    setIsDrawing(true);
    setLastPoint({ offsetX, offsetY });
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

  const stopDrawing = (event) => {
    if (isDrawing) {
      const { offsetX, offsetY } = event.nativeEvent;
      if (lastPoint && (offsetX === lastPoint.offsetX && offsetY === lastPoint.offsetY)) {
        // Draw a dot if there's no movement
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.arc(lastPoint.offsetX, lastPoint.offsetY, lineWidth / 2, 0, 2 * Math.PI);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.closePath();
      }
      setIsDrawing(false);
      setLastPoint(null);
    }
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
    const ctx = canvas.getContext('2d');
    // Redraw the canvas with white background before generating the image
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    redraw(strokes); // Redraw the strokes on top of the white background
    const imageUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'drawing.png';
    link.click();
  };

  return (
    <div className="drawing-widget">
      <div className="widget-header">
        <h4>Please input your signature</h4>
        <button className="btn btn-close" onClick={onClose}>X</button>
      </div>
      <div>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseLeave={stopDrawing}
          style={{ border: '1px solid black', display: 'block', margin: '0 auto' }}
        />
      </div>
      <div className="mt-2 text-center">
        <button className="btn btn-danger mr-2" onClick={resetCanvas}>Reset</button>
        <button className="btn btn-success" onClick={downloadImage}>Download</button>
      </div>
    </div>
  );
}

export default DrawingCanvas;
