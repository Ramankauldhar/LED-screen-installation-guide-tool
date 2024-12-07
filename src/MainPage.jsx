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

    useEffect(() => {
        // Function to load and parse the Excel file
        const loadExcelFile = async () => {
          try {
            const response = await fetch("PDF Builder.xlsx"); // Path to the file
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: "array" });
    
            // Parse the specific sheets
            const screenMfrSheet = XLSX.utils.sheet_to_json(workbook.Sheets["Screen MFR"]);
            const mediaPlayerSheet = XLSX.utils.sheet_to_json(workbook.Sheets["Media Player MFR"]);
            const mountsSheet = XLSX.utils.sheet_to_json(workbook.Sheets["Mounts"]);
            const receptacleBoxSheet = XLSX.utils.sheet_to_json(workbook.Sheets["Receptacle Box"]);
    
            const screenModels = screenMfrSheet.map((row) => row["Screen MFR"]);
    
            // Update dropdown data and set default screen and dimensions
            setDropdownData({
              screenModel: screenModels,
              mediaPlayer: mediaPlayerSheet.map((row) => row["MFG. PART"]),
              mount: mountsSheet.map((row) => row["MFG. PART"]),
              receptacleBox: receptacleBoxSheet.map((row) => row["MFG. PART"]),
            });
    
          } catch (error) {
            console.error("Error loading Excel file:", error);
          }
        };
      
        loadExcelFile();
    }, []);
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

        </div>
        <div className="rightContainer">
             <div className="configFirstSection">
                <div className="items">
                    <h2>Configuration</h2>
                    <div className="item">
                        <label>Screen</label>
                        <br />
                        <select>
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