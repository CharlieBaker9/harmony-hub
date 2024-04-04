// src/App.js
import React, { useState } from 'react';
import './App.css';
import Dropdown from './Dropdown';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useRef,
} from 'react-router-dom';

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

function ComputeScreen() {
  return <div>Computed</div>;
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

  const isComputeDisabled = !firstChord || !secondChord || !thirdChord || !fourthChord;

  const compute = () => {
    if (!isComputeDisabled) {
      navigate('/compute');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Harmony Hub</h1>
        {/* Your Dropdown components here */}
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