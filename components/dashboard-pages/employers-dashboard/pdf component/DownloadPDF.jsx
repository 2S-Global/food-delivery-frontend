import React, { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import PDFContent from "./PDFContent";

const DownloadPDF = () => {
  const pdfRef = useRef();

  const generatePDF = async () => {
    const input = pdfRef.current;

    // Convert component to an image
    const canvas = await html2canvas(input, { scale: 2 });

    // Get image data
    const imgData = canvas.toDataURL("image/png");

    // Define A4 size (210mm x 297mm)
    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Scale height proportionally

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    // Save the PDF
    pdf.save("User_Report.pdf");
  };

  return (
    <div>
      {/* Hidden Component for PDF Capture */}
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          width: "210mm",
          height: "297mm",
        }}
      >
        <div
          ref={pdfRef}
          style={{
            width: "210mm",
            minHeight: "297mm",
            background: "#fff",
            padding: "20px",
          }}
        >
          <PDFContent />
        </div>
      </div>

      {/* Button to Download PDF */}
      <button className="btn btn-primary" onClick={generatePDF}>
        Download PDF
      </button>
    </div>
  );
};

export default DownloadPDF;
