import React, { useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * A component for drawing a signature on a canvas.
 * Users can draw their signature, reset the canvas, and save the drawing.
 *
 * @param {Object} props - Component properties.
 * @param {Function} [props.onClose] - Function to call when the close button is clicked.
 * @param {Function} [props.onSave] - Function to call when the save button is clicked, with the signature image as an argument.
 * @returns {JSX.Element} The rendered DrawingCanvas component.
 */
function DrawingCanvas({ onClose, onSave }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState([]);
  const [lastPoint, setLastPoint] = useState(null);
  const lineWidth = 5; // Width of the drawing lines

  /**
   * Starts drawing on the canvas.
   * Sets the initial point for the stroke and updates the strokes state.
   *
   * @param {React.MouseEvent} event - The mouse event.
   */
  const startDrawing = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    setIsDrawing(true);
    setLastPoint({ offsetX, offsetY });
    setStrokes([...strokes, [{ offsetX, offsetY }]]);
  };

  /**
   * Draws on the canvas while the mouse is moving.
   * Updates the strokes state and redraws the current stroke.
   *
   * @param {React.MouseEvent} event - The mouse event.
   */
  const draw = (event) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = event.nativeEvent;
    const newStrokes = [...strokes];
    newStrokes[newStrokes.length - 1].push({ offsetX, offsetY });
    setStrokes(newStrokes);

    const ctx = canvasRef.current.getContext('2d');
    ctx.lineWidth = lineWidth; 
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

  /**
   * Stops drawing on the canvas.
   * Draws a dot if the mouse has not moved.
   *
   * @param {React.MouseEvent} event - The mouse event.
   */
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

  /**
   * Resets the canvas, clearing all drawings.
   */
  const resetCanvas = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillStyle = 'white'; 
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setStrokes([]);
  };

  /**
   * Redraws all strokes on the canvas.
   *
   * @param {Array} strokes - Array of strokes to redraw.
   */
  const redraw = (strokes) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillStyle = 'white'; 
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height); 
    ctx.lineWidth = lineWidth; 
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

  /**
   * Saves the current drawing as a PNG image and calls the onSave callback.
   * Also calls the onClose callback.
   */
  const saveImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    redraw(strokes); 
    const imageUrl = canvas.toDataURL('image/png');
    if (onSave) onSave(imageUrl); // Check if onSave is defined
    if (onClose) onClose(); // Check if onClose is defined
  };

  return (
    <div className="drawing-widget">
      <div className="widget-header">
        <h4>Please input your signature</h4>
        <button className="btn btn-danger" onClick={onClose}>X</button>
      </div>
      <div>
        <canvas
          ref={canvasRef}
          width={window.innerWidth - 1100} // Adjust width to fit the screen with some margin
          height={300} // Set a fixed height for the canvas
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseLeave={stopDrawing}
          style={{ border: '1px solid black', display: 'block', margin: '0 auto' }}
        />
      </div>
      <div className="mt-2 text-center">
        <button className="btn btn-danger mr-2" onClick={resetCanvas}>Reset</button>
        <button className="btn btn-success" onClick={saveImage}>Save</button>
      </div>
    </div>
  );
}

export default DrawingCanvas;
