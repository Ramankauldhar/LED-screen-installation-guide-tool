import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const downloadPDF = () => {
    // Select the section you want to export as PDF
    const content = document.querySelector(".mainContainer"); // You can adjust the selector to target a specific section if needed

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
