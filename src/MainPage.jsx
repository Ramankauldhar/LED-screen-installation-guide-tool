import React, {useState, useEffect} from "react";
import * as XLSX from "xlsx";
import Drawing from "./Drawing";
import './MainPage.css';
import signcastLogoImg from './imgs/signcast-email-logo.png';
import revisionImg from './imgs/revisionImg.png';
import {downloadPDF} from './downloadPdf';

function MainPage() {
    const brand = "SignCast";
    const department = "Installation";

    const [dropdownData, setDropdownData] = useState({
        screenModel: [],
        mediaPlayer: [],
        mount: [],
        receptacleBox: [],
    });
    const [orientation, setOrientation] = useState("Horizontal"); // Horizontal or Vertical
    const [installationType, setInstallationType] = useState("Niche"); // Niche or Flat Wall
    const [floorDistance, setFloorDistance] = useState(80); // Default floor distance in inches
    const [nicheDepth, setNicheDepth] = useState(1.5); // Default niche depth in inches
    const [selectedScreen, setSelectedScreen] = useState(""); // Current screen model
    const [screenDimensions, setScreenDimensions] = useState({
        height: "",
        width: "",
        floorLine: floorDistance, // Initialize with default floor distance
        screenDepth: 0,
    });
    const [nicheDimensions, setNicheDimensions] = useState({
        height: 0,
        width: 0,
        depth: 0,
    });
    const [mediaPlayerDepth, setMediaPlayerDepth] = useState(0);
    const [mountDepth, setMountDepth] = useState(0);

    //form state management
    const [title, setTitle] = useState(`${orientation} + PC In ${installationType}`);
    const [drawer, setDrawer] = useState(brand);
    const [dept, setDept] = useState(department);
    const [screenSize, setScreenSize] = useState(`{screenDimentions.width}" Touch Display`);
    const [date, setDate] = useState("");

    useEffect(() => {
        // Function to load and parse the Excel file
        const loadExcelFile = async () => {
          try {
            const response = await fetch("PDF Builder.xlsx"); 
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: "array" });
    
            // Parse the specific sheets
            const screenMfrSheet = XLSX.utils.sheet_to_json(workbook.Sheets["Screen MFR"]);
            const mediaPlayerSheet = XLSX.utils.sheet_to_json(workbook.Sheets["Media Player MFR"]);
            const mountsSheet = XLSX.utils.sheet_to_json(workbook.Sheets["Mounts"]);
            const receptacleBoxSheet = XLSX.utils.sheet_to_json(workbook.Sheets["Receptacle Box"]);
    
            const screenModels = screenMfrSheet.map((row) => row["Screen MFR"]);
            // Select the first screen by default
            const firstScreen = screenMfrSheet[0]; 
    
            // Update dropdown data and set default screen and dimensions
            setDropdownData({
              screenModel: screenModels,
              mediaPlayer: mediaPlayerSheet.map((row) => row["MFG. PART"]),
              mount: mountsSheet.map((row) => row["MFG. PART"]),
              receptacleBox: receptacleBoxSheet.map((row) => row["MFG. PART"]),
            });

            if (firstScreen) {
                setSelectedScreen(firstScreen["Screen MFR"]);
                setScreenDimensions({
                  height: firstScreen["Height"] || "",
                  width: firstScreen["Width"] || "",
                  floorLine: floorDistance,
                  screenDepth: firstScreen["Depth"] || 0,
                });
            }
          } catch (error) {
            console.error("Error loading Excel file:", error);
          }
        };
      
        loadExcelFile();
    }, []);

    // Calculate niche value dynamically
    useEffect(() => {
        const calculateNicheDimensions = () => {
            const { height=0, width=0, screenDepth=0 } = screenDimensions;
            const depthVariance = width <= 55 ? 1.5 : 2;

            if (installationType === "Niche") {
                const calculatedNicheDimensions = {
                     height: orientation === "Horizontal" ? parseFloat(height + 2 * depthVariance).toFixed(2) : parseFloat(width + 2 * depthVariance).toFixed(2),
                     width: orientation === "Horizontal" ? parseFloat(width + 2 * depthVariance).toFixed(2) : parseFloat(height + 2 * depthVariance).toFixed(2),
                     depth: parseFloat(screenDepth + Math.max(mediaPlayerDepth, mountDepth) + depthVariance + parseFloat(nicheDepth)).toFixed(2),
                };
                setNicheDimensions(calculatedNicheDimensions);
            } else {
                setNicheDimensions({ height: 0, width: 0, depth: 0 });
            }
        };
        calculateNicheDimensions();
    }, [screenDimensions, mediaPlayerDepth, mountDepth, installationType ,orientation, nicheDepth]);

    // Effect to update screenDimensions.floorLine when floorDistance changes
    useEffect(() => {
        setScreenDimensions(prevDimensions => ({
            ...prevDimensions,
            floorLine: floorDistance,
        }));
    }, [floorDistance]);

    // Update screenSize whenever screenDimensions changes
    useEffect(() => {
        setScreenSize(`${screenDimensions.width}" Touch Display`);
    }, [screenDimensions]);

    // Update title whenever orientation and installationType updates
    useEffect(() => {
        setTitle(`${orientation} + PC In ${installationType}`);
    }, [orientation, installationType]);

    //date
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setDate(today);
      }, []);
      

    // Update screen dimensions based on the selected screen
    const handleScreenChange = (event) => {
        const selected = event.target.value;
        setSelectedScreen(selected);

        // Load the Excel data again to fetch dimensions for the selected screen
        const loadScreenDimensions = async () => {
            try {
                 const response = await fetch("PDF Builder.xlsx");
                 const arrayBuffer = await response.arrayBuffer();
                 const workbook = XLSX.read(arrayBuffer, { type: "array" });
                 const screenMfrSheet = XLSX.utils.sheet_to_json(workbook.Sheets["Screen MFR"]);

                // Find the row with the matching screen model
                 const screenData = screenMfrSheet.find((row) => row["Screen MFR"] === selected);
                 if (screenData) {
                    setScreenDimensions({
                         height: screenData["Height"] || 0,
                         width: screenData["Width"] || 0,
                         floorLine: floorDistance,
                         screenDepth: screenData["Depth"] || 0,
                    });
                }
            } catch (error) {
            console.error("Error loading screen dimensions:", error);
             }
        };
        loadScreenDimensions(); 
    };

    // Handlers for updating state
    const handleOrientationToggle = (newOrientation) => {
        setOrientation(newOrientation);
    };
    const handleInstallationChange = (event) => {
          setInstallationType(event.target.value);
    };
    const handleFloorDistanceChange = (event) => {
          const value = event.target.value;
          setFloorDistance(value);
    };
    const handleNicheDepthChange = (event) => {
        setNicheDepth(event.target.value);
    };

    // Computing display dimensions based on orientation
    const displayHeight = orientation === "Horizontal" ? screenDimensions.height : screenDimensions.width;
    const displayWidth = orientation === "Horizontal" ? screenDimensions.width : screenDimensions.height;

return (
<div className="body">
    <div className="header"><img src={signcastLogoImg} alt="signcast-logo"></img></div>
    <div className="mainContainer">
        <div className="leftContainer">
             <div className="drawingSection">
                <Drawing className="drawing"
                     screenWidth={displayWidth}
                     screenHeight={displayHeight}
                     floorDistance={screenDimensions.floorLine}
                     nicheWidth={installationType === "Niche" ? nicheDimensions.width : null}
                     nicheHeight={installationType === "Niche" ? nicheDimensions.height : null}
                />
             </div>
             <div className="centerSection">
                <div className="dimensions-table">
                    {/* Niche Dimensions Table */}
                    <table>
                        <thead>
                             <h3>Niche Dimensions</h3>
                        </thead>
                        <tbody>
                             <tr>
                                 <th>Height</th>
                                 <td>{nicheDimensions.height}"</td>
                             </tr>
                             <tr>
                                 <th>Width</th>
                                 <td>{nicheDimensions.width}"</td>
                             </tr>
                             <tr>
                                 <th>Depth</th>
                                 <td>{nicheDimensions.depth}"</td>
                             </tr>
                        </tbody>
                    </table>
                    {/* Screen Dimensions Table */}
                    <table>
                        <thead>
                             <h3>Screen Dimensions</h3>
                        </thead>
                        <tbody>
                            <tr>
                                 <th>Height</th>
                                 <td>{displayHeight || "N/A"}"</td>
                            </tr>
                            <tr>
                                 <th>Width</th>
                                 <td>{displayWidth || "N/A"}"</td>
                            </tr>
                            <tr>
                                 <th>Floor Line</th>
                                 <td>{floorDistance}"</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="NoteSection">
                    <div className="leftNote">
                        <h2>Notes</h2>
                        <p>Install recessed receptacle box with:</p>
                        <p>2x Terminated Power Oulets</p>
                        <p>1x Terminated Data CAT5 Ethernet Outlet</p>
                    </div>
                    <div className="rightNote">
                        <table>
                            <tr>
                                  <th>Height</th>
                                  <td>6.6"</td>
                            </tr>
                            <tr>
                                  <th>Width</th>
                                  <td>6.012"</td>
                            </tr>
                            <tr>
                                  <th>Depth</th>
                                  <td>3.75"</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div className="orderSection">
                    <div className="headerScript">
                         <img src={signcastLogoImg} alt="signcast-logo"></img>
                         <address>361 Steelcase RD. W. #1. MARKHAM, ONTARIO PHONE: (416) 900-2233</address>
                         <div className="despText">
                             <label>Description</label>
                             <p>{title}</p>
                         </div>
                    </div>
                    <div className="orderTable">
                        <table>
                            <thead>
                                <tr>
                                     <td className="heading">Drawn</td>
                                     <td rowSpan="2" className="heading">Dimensions In Inches</td>
                                     <td rowSpan="2"><img src={revisionImg} alt="revision-img"></img></td>
                                     <td className="heading">Screen Size</td>
                                </tr>
                                <tr>
                                    <td>{drawer}</td>
                                    <td>{screenSize}</td>
                                </tr>
                                <tr>
                                    <td className="heading">Date</td>
                                    <td className="heading">Sheet</td>
                                    <td className="heading">Revision</td>
                                    <td className="heading">Department</td>
                                </tr>
                                <tr>
                                    <td>{date}</td>
                                    <td>1 of 1</td>
                                    <td>∞</td>
                                    <td>{dept}</td>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
             </div>
        </div>
        <div className="rightContainer">
             <div className="configSection">
                <div className="items">
                    <h2>Configuration</h2>
                    <div className="item">
                        <label>Screen</label>
                        <br />
                        <select onChange={handleScreenChange}>
                             {dropdownData.screenModel.map((item, index) => (
                             <option key={index} value={item}>
                                  {item}
                            </option>
                            ))}
                       </select>
                    </div>
                    <div className="item">
                         <label>Media Player</label>
                         <br />
                         <select>
                            {dropdownData.mediaPlayer.map((item, index) => (
                             <option key={index} value={item}>
                                  {item}
                             </option>
                            ))}
                         </select>
                    </div>
                    <div className="item">
                        <label>Mount</label>
                        <br />
                        <select>
                           {dropdownData.mount.map((item, index) => (
                             <option key={index} value={item}>
                                  {item}
                             </option>
                            ))}
                        </select>
                    </div>
                    <div className="item">
                         <label>Receptacle Box</label>
                         <br />
                         <select>
                             {dropdownData.receptacleBox.map((item, index) => (
                             <option key={index} value={item}>
                                 {item}
                             </option>
                             ))}
                        </select>
                    </div>
    
                    <div className="configSecondSection">
                        <div className="config-option">
                            <div className="toggle-group">
                              <button
                                  className={`toggle-button ${orientation === "Vertical" ? "active" : ""}`}
                                  onClick={() => setOrientation("Vertical")}>Vertical</button>
                              <button
                                  className={`toggle-button ${orientation === "Horizontal" ? "active" : ""}`}
                                  onClick={() => setOrientation("Horizontal")}>Horizontal</button>
                            </div>
                        </div>

                        <div className="config-option">
                             <div className="toggle-group">
                                <button
                                    className={`toggle-button ${installationType === "Niche" ? "active" : ""}`}
                                    onClick={() => setInstallationType("Niche")}>Niche</button>
                                <button
                                    className={`toggle-button ${installationType === "Flat Wall" ? "active" : ""}`}
                                    onClick={() => setInstallationType("Flat Wall")}>Flat Wall</button>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Floor Distance</label>
                            <input
                                   type="number"
                                   value={floorDistance}
                                   onChange={handleFloorDistanceChange}
                            />
                        </div>

                        <div className="input-group">
                             <label>Niche Depth</label>
                             <input
                                   type="number" 
                                   value={nicheDepth} 
                                   onChange={(e) => handleNicheDepthChange(e)} 
                                   min="0"
                                   step="0.1"
                             />
                        </div>
                    </div>
                </div>
            </div>
            <form className="descriptionSection">
                <div className="items">
                    <h2>Description</h2>
                    {/* Title */}
                    <div className="item">
                         <label htmlFor="title">Title</label><br />
                         <input 
                             type="text" 
                             id="title" 
                             value={title} 
                             onChange={(e) => setTitle(e.target.value)} 
                         />
                    </div>
                    {/* Drawer */}
                    <div className="item">
                         <label htmlFor="drawer">Drawer</label><br />
                         <input 
                             type="text" 
                             id="drawer" 
                             value={drawer} 
                             onChange={(e) => setDrawer(e.target.value)} 
                         />
                    </div>
                    {/* Department */}
                    <div className="item">
                         <label htmlFor="department">Department</label><br />
                         <input 
                             type="text" 
                             id="department" 
                             value={dept} 
                             onChange={(e) => setDept(e.target.value)} 
                         />
                    </div>
                    {/* Screen Size */}
                    <div className="item">
                         <label htmlFor="screenSize">Screen Size</label><br />
                         <input 
                             type="text" 
                             id="screenSize" 
                             value={screenSize} 
                             onChange={(e) => setScreenSize(e.target.value)} 
                         />
                    </div>
                    {/* Date */}
                    <div className="item">
                         <label htmlFor="date">Date</label><br />
                         <input 
                             type="date" 
                             id="date" 
                             value={date} 
                             onChange={(e) => setDate(e.target.value)} 
                         />
                    </div>
                </div>
            </form>
            <div className="downloadButtonSection">
                 <button onClick={downloadPDF}>
                     <span className="download-text">Download</span>
                     <span className="download-icon">
                         <i className="fas fa-download"></i>
                     </span>
                 </button>
            </div>
        </div>
    </div>
</div>
);
}
export default MainPage;