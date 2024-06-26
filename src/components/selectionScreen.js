import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtainBassNotes, shiftBassNotes } from '../voiceLeadingFunctions/bassNotes.js';
import { generateSAT } from '../voiceLeadingFunctions/generateSAT.js';
import { convertToXML } from '../xml/xmlComputation.js';
import { closedSpacingConversion } from '../voiceLeadingFunctions/closedSpacing.js';
import Dropdown from './Dropdown.js';
import '../componentsStyling/selectionScreen.css';

const initialOptions = ["I", "I6", "V", "V6", "V65", "V42", "V73", "V7", "vii°6"];

const nextChordOptions = {
  "I": ["I6", "V", "V6", "vii°6", "V43", "V65", "V73", "V7"],
  "I6": ["I", "V", "vii°6", "V43", "V42"],
  "I83": ["V7"],
  "V": ["I", "I6"],
  "V6": ["I"],
  "V43": ["I6", "I"],
  "vii°6": ["I", "I6"],
  "V65": ["I"],
  "V42": ["I"],
  "V73": ["I"],
  "V7": ["I"],
};

const keyOptions = ["C", "G", "D", "A", "E", "F", "B♭", "E♭", "A♭", "B", "C♭", "F#", "G♭", "C#", "D♭"];

const durationOptions = ['Whole', 'Half', 'Quarter', 'Eighth'];
const durationDict = {
  'Whole': 2,
  'Half': 1,
  'Quarter': 0.5,
  'Eighth': 0.25
};

function SelectionScreen() {
  const navigate = useNavigate();
  const [chords, setChords] = useState(['']);
  const [durations, setDurations] = useState(['']);
  const [options, setOptions] = useState([initialOptions]);
  const [isAddChordDisabled, setIsAddChordDisabled] = useState(true);
  const [selectedKey, setSelectedKey] = useState('');

  const handleDropdownChange = (event, index) => {
    const newChords = [...chords];
    newChords[index] = event.target.value;
    setChords(newChords);

    const newOptions = options.slice(0, index + 1);
    if (newChords[index]) {
      const updatedOptions = nextChordOptions[newChords[index]] || [];
      newOptions[index + 1] = updatedOptions;
    }
    setOptions(newOptions);

    // Enable the "Add Chord" button if the current chord is selected
    setIsAddChordDisabled(!newChords[index]);
  };

  const handleDurationChange = (event, index) => {
    const newDurations = [...durations];
    newDurations[index] = event.target.value;
    setDurations(newDurations);
  };

  const handleKeyChange = (event) => {
    setSelectedKey(event.target.value);
  };

  const addDropdown = () => {
    setChords([...chords, '']);
    setDurations([...durations, '']);
    setIsAddChordDisabled(true); // Disable the "Add Chord" button after adding a new dropdown
  };

  const isComputeDisabled = !selectedKey || chords.some(chord => !chord) || durations.some(duration => !duration);

  const compute = () => {
    const chordSequence = chords.join(' ').trim();
    if (!isComputeDisabled) {
      const bassNotes = obtainBassNotes(chordSequence);
      const chordProgression = chordSequence.split(' ');
      let soprano, alto, tenor;
      let methodDecisions = Array(chordProgression.length - 1).fill(0);
      let methodOpportunities = Array(chordProgression.length - 1).fill(false);
      let doublingDecisions = Array(chordProgression.length).fill(false);
      let doublingOpportunities = Array(chordProgression.length).fill(false);
      let forkingOpportunities = Array(chordProgression.length - 1).fill(false);


      [soprano, alto, tenor, methodDecisions, methodOpportunities, doublingDecisions, doublingOpportunities, forkingOpportunities] = generateSAT(chordProgression, methodDecisions, methodOpportunities, doublingDecisions, doublingOpportunities, forkingOpportunities);
      
      const bass = shiftBassNotes(tenor, bassNotes);

      let formattedNotes = [];
      for (let i = 0; i < soprano.length; i++) {
        formattedNotes.push([soprano[i], alto[i], tenor[i], bass[i]]);
      }

      const closedSpacingNotes = closedSpacingConversion(formattedNotes);

      // Convert duration labels to values
      const durationValues = durations.map(duration => durationDict[duration]);

      const openSpacingXml = convertToXML(formattedNotes, chordSequence, selectedKey, durationValues); // Pass the selected key and durations
      let closedSpacingXml;

      if (Array.isArray(closedSpacingNotes)) {
        closedSpacingXml = convertToXML(closedSpacingNotes, chordSequence, selectedKey, durationValues); // Pass the selected key and durations
      } else {
        closedSpacingXml = NaN;
      }

      let table = {
        chords: chords,
        soprano: soprano,
        alto: alto,
        tenor: tenor,
        bass: bass,
        methodDecisions: methodDecisions,
        methodOpportunities: methodOpportunities,
        doublingDecisions: doublingDecisions,
        doublingOpportunities: doublingOpportunities,
        forkingOpportunities: forkingOpportunities
      };

      let xmlInput = {
        openDegrees: formattedNotes, 
        closedDegrees: closedSpacingNotes,
        chordSequence: chordSequence, 
        key: selectedKey, 
        durations: durationValues
      }

      navigate('/compute', { state: { openSpacingXml, closedSpacingXml, table, xmlInput} });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Forking Decisions</h1>
        <div className="controls-container">
          <label htmlFor="keyDropdown">Select Key</label>
          <Dropdown
            id="keyDropdown"
            options={keyOptions}
            onChange={handleKeyChange}
            value={selectedKey}
            className="control"
          />
          <label>Select Chords</label>
          {chords.map((chord, index) => (
            <div key={index} className="chord-duration-container">
              <Dropdown
                id={`chordDropdown${index}`}
                options={options[index]}
                onChange={(event) => handleDropdownChange(event, index)}
                value={chord}
                className="control"
              />
              <Dropdown
                id={`durationDropdown${index}`}
                options={durationOptions}
                onChange={(event) => handleDurationChange(event, index)}
                value={durations[index]}
                className="control"
              />
            </div>
          ))}
          <div className="button-container">
            {chords.length < 8 && (
              <button onClick={addDropdown} className="control" disabled={isAddChordDisabled}>Add Chord</button>
            )}
            <button onClick={compute} disabled={isComputeDisabled} className="control">Compute</button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default SelectionScreen;
