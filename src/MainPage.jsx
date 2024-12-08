import React, {useState, useEffect} from "react";
import * as XLSX from "xlsx";
import Drawing from "./Drawing";
import './MainPage.css';
import signcastLogoImg from './imgs/signcast-email-logo.png';
import revisionImg from './imgs/revisionImg.png';

function MainPage() {
    const brand = "SignCast";
    const department = "Installation";
    const [date, setDate] = useState('');

    const [dropdownData, setDropdownData] = useState({
        screenModel: [],
        mediaPlayer: [],
        mount: [],
        receptacleBox: [],
    });
    const [orientation, setOrientation] = useState("Horizontal"); // Horizontal or Vertical
    const [installationType, setInstallationType] = useState("Niche"); // Niche or Flat Wall
    const [floorDistance, setFloorDistance] = useState(50); // Default floor distance in inches
    const [nicheDepth, setNicheDepth] = useState(0.5); // Default niche depth in inches
    const [selectedScreen, setSelectedScreen] = useState(""); // Current screen model
    const [screenDimensions, setScreenDimensions] = useState({
        height: "",
        width: "",
        floorLine: floorDistance, // Initialize with default floor distance
    });
    const [nicheDimensions, setNicheDimensions] = useState({
        height: 0,
        width: 0,
        depth: 0,
    });
    const [mediaPlayerDepth, setMediaPlayerDepth] = useState(0);
    const [mountDepth, setMountDepth] = useState(0);

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
                });
            }
          } catch (error) {
            console.error("Error loading Excel file:", error);
          }
        };
      
        loadExcelFile();
    }, [floorDistance]);

    useEffect(() => {
        // Calculate niche value dynamically
        const calculateNicheDimensions = () => {
            const { height, width, screenDepth } = screenDimensions;
            const depthVariance = width <= 55 ? 1.5 : 2;
            const calculatedNicheDimensions = {
                height: height + 2 * depthVariance,
                width: width + 2 * depthVariance,
                depth: screenDepth + Math.max(mediaPlayerDepth, mountDepth) + depthVariance,
            };
            setNicheDimensions(calculatedNicheDimensions);
        };

        calculateNicheDimensions();
    }, [screenDimensions, mediaPlayerDepth, mountDepth]);

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
                         height: screenData["Height"] || "",
                         width: screenData["Width"] || "",
                         floorLine: floorDistance,
                         screenDepth: screenData["Depth"]
                    });
                }
            } catch (error) {
            console.error("Error loading screen dimensions:", error);
             }
        };
        loadScreenDimensions(); 
    };

    // Handlers for updating state
    const handleOrientationToggle = () => {
          setOrientation((prev) => (prev === "Horizontal" ? "Vertical" : "Horizontal"));
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

return (
<>
    <div className="header"><img src={signcastLogoImg} alt="signcast-logo"></img></div>
    <div className="mainContainer">
        <div className="leftContainer">
             <div className="drawingSection">
                <Drawing
                     screenWidth={screenDimensions.width}
                     screenHeight={screenDimensions.height}
                     floorDistance={screenDimensions.floorLine}
                     nicheWidth={nicheDimensions.width}
                     nicheHeight={nicheDimensions.height}
                />
             </div>
             <div className="centerSection">
                <div className="dimensions-table">
                     {/* Screen Dimensions Table */}
                    <table>
                        <thead>
                             <h3>Screen Dimensions</h3>
                        </thead>
                        <tbody>
                            <tr>
                                 <th>Height</th>
                                 <td>{screenDimensions.height || "N/A"}"</td>
                            </tr>
                            <tr>
                                 <th>Width</th>
                                 <td>{screenDimensions.width  || "N/A"}"</td>
                            </tr>
                            <tr>
                                 <th>Floor Line</th>
                                 <td>{floorDistance}"</td>
                            </tr>
                        </tbody>
                    </table>
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
                             <p>{`${orientation} + PC In ${installationType}`}</p>
                         </div>
                    </div>
                    <div className="orderTable">
                        <table>
                            <thead>
                                <tr>
                                     <td className="heading">Drawn</td>
                                     <td rowSpan="2" className="heading">Dimensions In Inches</td>
                                     <td rowSpan="2"><img src={revisionImg} alt="revision-img"></img></td>
                                     <td className="heading">{brand}</td>
                                </tr>
                                <tr>
                                    <td>SignCast</td>
                                    <td>LG 55" Touch Display</td>
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
                                    <td>00</td>
                                    <td>{department}</td>
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
                                   onChange={handleNicheDepthChange}
                             />
                        </div>
                    </div>
                </div>
            </div>
            <div className="descriptionSection">
                <div className="items">
                    <h2>Description</h2>
                    <div className="item">
                        <label>Title</label><br />
                        <input type="text" value={`${orientation} + PC In ${installationType}`}/>
                    </div>
                    <div className="item">
                        <label>Drawer</label><br />
                        <input type="text" value={brand}/>
                    </div>
                    <div className="item">
                        <label>Department</label><br />
                        <input type="text" value={department}/>
                    </div>
                    <div className="item">
                        <label>Screen Size</label><br />
                        <input type="text" value={`LG 55" Touch Display`}/>
                    </div>
                    <div className="item">
                        <label>Date</label><br />
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="downloadButtonSection">
                 <button>Download</button>
            </div>
        </div>
    </div>
</>
);
}
export default MainPage;