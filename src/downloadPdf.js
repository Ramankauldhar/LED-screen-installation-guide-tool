import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const downloadPDF = () => {
    const content = document.querySelector(".body");

    html2canvas(content, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const screenName = "SignCast LED Screen Drawing";
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];

        const fileName = `${screenName}-${formattedDate}.pdf`;

        // Initialize jsPDF
        const doc = new jsPDF();

        // Get the dimensions of the page
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = doc.internal.pageSize.getHeight();

        // Calculation of image's aspect ratio to fit it into the PDF
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        
        // Scaling the image to fit within the PDF page dimensions
        let newWidth = pdfWidth;
        let newHeight = pdfWidth / ratio;

        // If the height exceeds the page, scale down the height
        if (newHeight > pdfHeight) {
            newHeight = pdfHeight;
            newWidth = pdfHeight * ratio;
        }

        // Adding image to the PDF
        doc.addImage(imgData, "PNG", 0, 0, newWidth, newHeight);

        // Save the file
        doc.save(fileName);
    });
};
