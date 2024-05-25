import { useEffect, useState, useRef } from 'react'; 
import './App.css'; 
import html2canvas from 'html2canvas'; 
import jsPDF from 'jspdf'; 

function App() { 
  const [temp, setTemp] = useState(""); 
  const [word, setWord] = useState(""); 
  const [size, setSize] = useState(400); 
  const [bgColor, setBgColor] = useState("ffffff"); 
  const [qrCode, setQrCode] = useState(""); 
  const qrRef = useRef(null);

  useEffect(() => { 
    if (word) {
      setQrCode(`http://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(word)}&size=${size}x${size}&bgcolor=${bgColor}`); 
    }
  }, [word, size, bgColor]); 

  function handleClick() { 
    setWord(temp); 
  } 

  const downloadImage = async (format) => {
    if (qrRef.current) {
      const canvas = await html2canvas(qrRef.current, {
        useCORS: true, // Enable cross-origin resource sharing if needed
      });
      const dataUrl = canvas.toDataURL(`image/${format}`);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `QRCode.${format}`;
      link.click();
    }
  };

  const downloadPDF = async () => {
    if (qrRef.current) {
      const canvas = await html2canvas(qrRef.current, {
        useCORS: true, // Enable cross-origin resource sharing if needed
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 180, 180); // Adjusting size to fit PDF
      pdf.save('QRCode.pdf');
    }
  };

  return ( 
    <div className="App"> 
      <h1>QR Code Generator</h1> 
      <div className="input-box"> 
        <div className="gen"> 
          <input 
            type="text" 
            onChange={(e) => setTemp(e.target.value)} 
            placeholder="Enter text to encode" 
          /> 
          <button className="button" onClick={handleClick}> 
            Generate 
          </button> 
        </div> 
        <div className="extra"> 
          <h5>Background Color:</h5> 
          <input 
            type="color" 
            onChange={(e) => setBgColor(e.target.value.substring(1))} 
          /> 
          <h5>Dimension:</h5> 
          <input 
            type="range" 
            min="200" 
            max="600" 
            value={size} 
            onChange={(e) => setSize(parseInt(e.target.value))} 
          /> 
        </div> 
      </div> 
      <div className="output-box"> 
        {qrCode && (
          <>
            <div ref={qrRef} className="qr-code" style={{ display: 'inline-block' }}>
              <img src={qrCode} alt="Generated QR Code" onLoad={() => console.log('QR code loaded')} /> 
            </div>
            <div className="download-buttons">
              <div className="dropdown">
                <button className="dropbtn">Download</button>
                <div className="dropdown-content">
                  <a href="#" onClick={() => downloadImage('png')}>PNG</a>
                  <a href="#" onClick={() => downloadImage('jpeg')}>JPG</a>
                  <a href="#" onClick={downloadPDF}>PDF</a>
                </div>
              </div>
            </div>
          </>
        )}
      </div> 
    </div> 
  ); 
} 

export default App;
