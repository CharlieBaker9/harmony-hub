import React, { useState } from 'react';
import './App.css';
import Dropdown from './Dropdown';

const initialOptions = ["I", "I6", "V", "V6", "V65", "V42", "V73", "V7", "vii°6"];

const nextChordOptions = {
  "I": ["I6", "V", "V6", "vii°6", "V43"],
  "I6": ["I", "V", "vii°6", "V43"],
  "V": ["I", "I6"],
  "V6": ["I"],
  "V65": ["I"],
  "V42": ["I6"],
  "V73": ["I"],
  "V7": ["I", "I83"],
  "vii°6": ["I", "I6"]
};

function App() {
  const [firstChord, setFirstChord] = useState('');
  const [secondChord, setSecondChord] = useState('');
  const [thirdChord, setThirdChord] = useState('');
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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Harmony Hub</h1>
        <Dropdown
          label="Chord 1: "
          options={initialOptions}
          onChange={handleFirstDropdownChange}
        />
        <Dropdown
          label="Chord 2: "
          options={secondChordOptions}
          onChange={handleSecondDropdownChange}
          disabled={isSecondDropdownDisabled}
        />
        <Dropdown
          label="Chord 3: "
          options={thirdChordOptions}
          onChange={handleThirdDropdownChange}
          disabled={isThirdDropdownDisabled}
        />
        <Dropdown
          label="Chord 4: "
          options={fourthChordOptions}
          onChange={(event) => console.log(event.target.value)}
          disabled={isFourthDropdownDisabled}
        />
      </header>
    </div>
  );
}

export default App;
