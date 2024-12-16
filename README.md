# LED Screen Installation Guide Tool

This React application provides a user-friendly interface for creating, customizing, and downloading PDF drawings for LED screen installations. 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Features: 

1. Dropdown Selection: Choose equipment from a pre-defined list populated via a xlsx file.
2. Real-Time Diagram Updates: Visual updates for layouts during user interaction.
3. Measurement Displays: Automatic measurement calculations are displayed on the diagram.
4. Configuration Options: Toggle settings such as screen orientation and installation type.
5. Download as PDF: Export your design as a PDF for easy sharing and reference.

## File Structure

src/  
│  
├── imgs/                     # Directory for image assets  
│  
├── App.css                   # Global application styles  
├── App.js                    # Root component for the React application  
├── App.test.js               # Unit tests for the App component  
│  
├── downloadPdf.js            # Utility for exporting diagrams to PDF  
│  
├── Drawing.jsx               # Canvas component for interactive design  
│  
├── index.css                 # Global CSS for index.html  
├── index.js                  # Application entry point  
│  
├── MainPage.css              # Styles for the MainPage component  
├── MainPage.jsx              # Main page logic and structure  
│  
├── setupTests.js             # Test setup for Jest  
│  
└── README.md                 # Project documentation  

## Installation
### Prerequisites
Ensure you have the following installed:
1. Node.js (v16 or later)
2. npm or yarn

## Steps
1. Clone this repository:
`git clone https://github.com/your-repo/led-screen-guide-tool.git` 
`cd led-screen-guide-tool`

2. Install dependencies:
`npm install`

3. Start the application:
`npm start`

The app will run on http://localhost:3000.

## Usage

1. Navigate to the Main Page: Start designing your layout.
2. Add Components: Use drag-and-drop to position screen elements.
3. View Measurements: Measurements update in real time as you adjust the design.
4. Export PDF: Click "Download" to save the drawing as a PDF.

## Code Overview

### App.js
The root component that wraps the main content.

### MainPage.jsx
Handles the application layout and connects user inputs to the design canvas.

### Drawing.jsx
Provides an interactive drawing canvas using tools like:
1. React Konva or Fabric.js for drag-and-drop.
2. Real-time measurement rendering.

### downloadPdf.js
Utility for exporting the current design as a PDF using libraries such as jsPDF or html2canvas.

## Dependencies

1. React: UI framework.
2. React Konva: For interactive and dynamic canvas elements.
3. jsPDF: For generating PDFs.
4. HTML2Canvas: For canvas to image conversion.

## Testing
Run unit tests using Jest:
### `npm test`  

## Contact
For inquiries or suggestions, please contact:
Name: Ramandeep
Email: Rmnkaul979697@gmail.com
