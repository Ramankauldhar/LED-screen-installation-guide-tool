import React, {useState, useEffect} from "react";
import * as XLSX from "xlsx";
import './MainPage.css';

function MainPage() {
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
    <div className="mainContainer">
        <div className="leftContainer">
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
        </div>
        <div className="rightContainer">
             <div className="configFirstSection">
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
        </div>
    </div>
</>
);
}
export default MainPage;