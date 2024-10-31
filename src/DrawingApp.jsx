import React, { useRef, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import axios from "axios";
import "./DrawingApp.css";

const DrawingApp = () => {
  const canvasRef = useRef(null);
  const [responseData, setResponseData] = useState(null); // Estado para almacenar la respuesta

  const handleClear = () => {
    canvasRef.current.clearCanvas();
  };

  const handleSend = async () => {
    try {
      const imageData = await canvasRef.current.exportImage("png");
      const formData = new FormData();
      formData.append("image", dataURItoBlob(imageData), "drawing.png");

      // Envío de datos al backend
      const response = await axios.post(
        "https://back-modern-calculator-production.up.railway.app/operation",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Almacena la respuesta en el estado
      setResponseData(response.data);
      console.log("Respuesta del backend:", response.data);
    } catch (error) {
      console.error(
        "Error al enviar la imagen:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className="container">
      <h1>Dibuja operaciones matematicas en la pizarra</h1>
       {/* Mostrar la respuesta del backend */}
       {responseData && (
        <div>
          <h3>Resultado:</h3>
          <p>{responseData.Candidates[0].Content.Parts[0]}</p>
        </div>
      )}
      <ReactSketchCanvas
        ref={canvasRef}
        width="95%"
        height="500px"
        strokeWidth={4}
        strokeColor="white"
        canvasColor="#057007"
        style={{
          border: "10px solid #81640f", 
          borderRadius: "10px"
        }}
      />
      <div className="container-buttons">
        <button className="buttonClear" onClick={handleClear}>
          Limpiar pizzaron
        </button>
        <button className="buttonSend" onClick={handleSend}>
          Operar
        </button>
      </div>
    </div>
  );
};

export default DrawingApp;
