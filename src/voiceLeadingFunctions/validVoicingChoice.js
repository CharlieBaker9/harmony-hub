function adjustNumber(num) {
  while (num > 7) num -= 7;
  while (num < 0) num += 7;
  return num;
}

// Generate changes based on progression dictionary
function generateChanges(initialVoicing, progression) {
  return initialVoicing.map(voice => {
      const key = adjustNumber(voice); // Key adjusted to fit within 0 to 7 range
      const changes = progression[key.toString()];
      if (Array.isArray(changes)) {
          // Calculate the relative changes
          return [
              changes[0] - voice,
              changes[1] - voice
          ].map(change => adjustNumber(change));
      }
      return [adjustNumber(changes - voice)];
  });
}

// Check if voicing is valid based on the rules
function isValidVoicing(voicing) {
  const soprano = voicing[0];
  const alto = voicing[1];
  const tenor = voicing[2];

  // Check distances
  if (Math.abs(soprano - alto) > 7) return false;
  if (Math.abs(alto - tenor) > 7) return false;
  return true;
}

function createChordProgressions(initialVoicing, progression) {
  // Create the scenarios of changes
  const changes = generateChanges(initialVoicing, progression);
  const scenario1 = initialVoicing.map((voice, i) => voice + (changes[i][0]));
  const scenario2 = initialVoicing.map((voice, i) => voice + (changes[i][1]));

  // Compare and select valid voicing scenario
  const validScenario1 = isValidVoicing(scenario1);
  const validScenario2 = isValidVoicing(scenario2);

  // Determine the best scenario based on validity
  if (validScenario1 && !validScenario2) {
      return scenario1;
  } else if (!validScenario1 && validScenario2) {
      return scenario2;
  } else if (validScenario1 && validScenario2) {
      // If both scenarios are valid, further logic could be added to decide between them
      return scenario1; // Default to scenario1 for now
  } else {
      return 'No valid voicing found';
  }
}

// Define the initial voicing and the progression dictionary
// const initialVoicing = [8, 1, -2];
// const progression = {
//   "8": [8, 11], // '8' stays '8', or goes to '11'
//   "1": [3, 1], // '1' goes to '1', or '3'
//   "-2": [-2]      // '3' stays '3'
// };

// const bestProgression = createChordProgressions(initialVoicing, progression);
// console.log(bestProgression);
