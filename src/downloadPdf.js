import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const downloadPDF = () => {
    const content = document.querySelector(".mainContainer"); 

    html2canvas(content).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        // Initialize jsPDF
        const doc = new jsPDF();

        // Add image to the PDF
        doc.addImage(imgData, "PNG", 10, 10);
        
        // Save the PDF
        doc.save("downloaded-page.pdf");
    });
};
