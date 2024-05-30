// src/components/selectionScreen.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtainBassNotes, shiftBassNotes } from '../voiceLeadingFunctions/bassNotes.js';
import { generateSAT } from '../voiceLeadingFunctions/generateSAT.js';
import { convertToXML } from '../xml/xmlComputation.js';
import Dropdown from '../Dropdown.js';

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

function SelectionScreen() {
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

      const progression = chordSequence.split(' ');
      let soprano, alto, tenor;
      let methodDecisions = Array(progression.length).fill(0);
      let methodOpportunities = Array(progression.length).fill(false);
      let doublingDecisions = Array(progression.length-1).fill(false);
      let doublingOpportunities = Array(progression.length-1).fill(false);


      [soprano, alto, tenor, methodDecisions, methodOpportunities, doublingDecisions, doublingOpportunities] = generateSAT(progression, methodDecisions, methodOpportunities, doublingDecisions, doublingOpportunities);

      const bass = shiftBassNotes(tenor, bassNotes);

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
        methodOpportunities: methodOpportunities,
        doublingDecisions: doublingDecisions,
        doublingOpportunities: doublingOpportunities
      };
      
      console.table(table);
  
      navigate('/compute', { state: { notesXml, table} });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Harmony Hub</h1>
        <Dropdown 
          options={initialOptions} 
          onChange={handleFirstDropdownChange} 
          disabled={false}
          value={firstChord}
        />
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

export default SelectionScreen;