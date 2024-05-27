// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';
import { obtainBassNotes, shiftBassNotes } from './voiceLeadingFunctions/bassNotes.js';
import { generateSAT } from './voiceLeadingFunctions/generateSAT.js';
import { convertToXML } from './xml/xmlComputation.js';
import Dropdown from './Dropdown';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';

const initialOptions = ["I", "I6", "V", "V6", "V65", "V42", "V73", "V7", "vii°6"];

const nextChordOptions = {
  "I": ["I6", "V", "V6", "vii°6", "V43", "V65", "V73", "V7"],
  "I6": ["I", "V", "vii°6", "V43", "V42"],
  "I83": ["V7"],
  "V": ["I", "I6"],
  "V6": ["I"],
  "V43": ["I6", "I"],
  "vii°6": ["I", "I6"],

  "V65": ["I"], //none 
  "V42": ["I"], //none
  "V73": ["I"], //none
  "V7": ["I"], //none
};

function ComputeScreen() {
  const osmdContainerRef = useRef(null);
  const osmdInstanceRef = useRef(null);
  const location = useLocation();
  const { notesXml } = location.state || {}; // Extract notesXml from state

  useEffect(() => {
    const loadAndRenderOSMD = async () => {
      if (!window.OpenSheetMusicDisplay) {
        const script = document.createElement('script');
        script.src = "https://unpkg.com/opensheetmusicdisplay@0.8.3/build/opensheetmusicdisplay.min.js";
        document.body.appendChild(script);

        script.onload = () => {
          renderOSMD();
        };
        script.onerror = () => console.error("Script failed to load");
      } else {
        renderOSMD();
      }
    };

    const renderOSMD = () => {
      if (osmdContainerRef.current && !osmdInstanceRef.current) {
        osmdInstanceRef.current = new window.opensheetmusicdisplay.OpenSheetMusicDisplay(osmdContainerRef.current, {
          autoResize: true,
          backend: "svg",
          drawTitle: true,
        });

        if (notesXml) {
          osmdInstanceRef.current.load(notesXml)
            .then(() => {
              osmdInstanceRef.current.render();
            })
            .catch(error => console.error("Error loading or rendering the score", error));
        }
      }
    };

    loadAndRenderOSMD();

    return () => {
      const scripts = document.querySelectorAll('script[src="https://unpkg.com/opensheetmusicdisplay@0.8.3/build/opensheetmusicdisplay.min.js"]');
      scripts.forEach(script => document.body.removeChild(script));
    };
  }, [notesXml]);

  return <div ref={osmdContainerRef} style={{ width: '100%', height: '100%' }} />;
}

function Home() {
  const navigate = useNavigate();

  const [firstChord, setFirstChord] = useState('');
  const [secondChord, setSecondChord] = useState('');
  const [thirdChord, setThirdChord] = useState('');
  const [fourthChord, setFourthChord] = useState('');
  const [secondChordOptions, setSecondChordOptions] = useState([]);
  const [thirdChordOptions, setThirdChordOptions] = useState([]);
  const [fourthChordOptions, setFourthChordOptions] = useState([]);
  const [isSecondDropdownDisabled, setIsSecondDropdownDisabled] = useState(true);
  const [isThirdDropdownDisabled, setIsThirdDropdownDisabled] = useState(true);
  const [isFourthDropdownDisabled, setIsFourthDropdownDisabled] = useState(true);

  const handleFirstDropdownChange = (event) => {
    const selectedChord = event.target.value;
    setFirstChord(selectedChord);

    if (selectedChord) {
      const updatedOptions = nextChordOptions[selectedChord] || [];
      setSecondChordOptions(updatedOptions);
      setIsSecondDropdownDisabled(false);
    } else {
      setSecondChordOptions([]);
      setIsSecondDropdownDisabled(true);
    }

    // Reset subsequent selections
    setThirdChordOptions([]);
    setIsThirdDropdownDisabled(true);
    setFourthChordOptions([]);
    setIsFourthDropdownDisabled(true);
  };

  const handleSecondDropdownChange = (event) => {
    const selectedChord = event.target.value;
    setSecondChord(selectedChord);

    if (selectedChord) {
      const updatedOptions = nextChordOptions[selectedChord] || [];
      setThirdChordOptions(updatedOptions);
      setIsThirdDropdownDisabled(false);
    } else {
      setThirdChordOptions([]);
      setIsThirdDropdownDisabled(true);
    }

    // Reset the fourth selection
    setFourthChordOptions([]);
    setIsFourthDropdownDisabled(true);
  };

  const handleThirdDropdownChange = (event) => {
    const selectedChord = event.target.value;
    setThirdChord(selectedChord);

    if (selectedChord) {
      const updatedOptions = nextChordOptions[selectedChord] || [];
      setFourthChordOptions(updatedOptions);
      setIsFourthDropdownDisabled(false);
    } else {
      setFourthChordOptions([]);
      setIsFourthDropdownDisabled(true);
    }
  };

  const handleFourthDropdownChange = (event) => {
    const selectedChord = event.target.value;
    setFourthChord(selectedChord);
  };

  const isComputeDisabled = !firstChord || !secondChord || !thirdChord || !fourthChord;

  const compute = () => {
    // Ensure that chord variables are strings. If they're not, this will cast them to strings.
    const chordSequence = [firstChord, secondChord, thirdChord, fourthChord].join(' ').trim();
  
    if (!isComputeDisabled) {
      const bassNotes = obtainBassNotes(chordSequence);
      const [soprano, alto, tenor, methodDecisions, doublingDecisions] = generateSAT(chordSequence);

      const bass = shiftBassNotes(tenor, bassNotes); 
      const stringDoublingDecisions = doublingDecisions.map(JSON.stringify);

      let formattedNotes = []
      for (let i = 0; i < soprano.length; i++) {
        formattedNotes.push([soprano[i], alto[i], tenor[i], bass[i]])
      }

      const notesXml = convertToXML(formattedNotes);

      let table = {
        chord: [firstChord, secondChord, thirdChord, fourthChord],
        soprano: soprano,
        alto: alto,
        tenor: tenor,
        bass: bass,
        methodDecisions: methodDecisions,
        doublingDecisions: stringDoublingDecisions
      };
      
      console.table(table);
  
      navigate('/compute', { state: { notesXml } });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Harmony Hub</h1>
        {/* Dropdown for selecting the first chord */}
        <Dropdown 
          options={initialOptions} 
          onChange={handleFirstDropdownChange} 
          disabled={false}
          value={firstChord}
        />
        {/* Conditional rendering for subsequent Dropdowns based on the previous selection */}
        {isSecondDropdownDisabled ? null : (
          <Dropdown 
            options={secondChordOptions} 
            onChange={handleSecondDropdownChange} 
            disabled={isSecondDropdownDisabled}
            value={secondChord}
          />
        )}
        {isThirdDropdownDisabled ? null : (
          <Dropdown 
            options={thirdChordOptions} 
            onChange={handleThirdDropdownChange} 
            disabled={isThirdDropdownDisabled}
            value={thirdChord}
          />
        )}
        {isFourthDropdownDisabled ? null : (
          <Dropdown 
            options={fourthChordOptions} 
            onChange={handleFourthDropdownChange} 
            disabled={isFourthDropdownDisabled}
            value={fourthChord}
          />
        )}
        <button onClick={compute} disabled={isComputeDisabled}>Compute</button>
      </header>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/compute" element={<ComputeScreen />} />
      </Routes>
    </Router>
  );
}

export default App;