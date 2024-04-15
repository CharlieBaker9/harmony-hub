const spacingDict = require('../dictionaries/openSpacing.json');
const progressionDict = require('../dictionaries/progressionDict.json');

function addingNote(possPathSets, array, idx) {
  let nextNote = possPathSets[array[0]];
  if (Array.isArray(nextNote)){
    nextNote = nextNote[idx];
    idx += 1;   //dumb -- need specific arrangement as it unfolds -- registral scale degrees
  }
  array.unshift(nextNote);

  return idx
}

function adjustNote(noteIn, noteOut) {
  return (((noteIn - noteOut + 3) % 7) - 3)
}

function assigningToRegister(s, a, t) {
  // shifting soprano
  let soprano = [s[s.length-1] + 7];
  for (let i = s.length - 2; i >= 0; i--){
    let temp = soprano[0] + adjustNote(s[i], s[i+1]);
    soprano.unshift(temp);
  }

  // shifting alto
  let alto = [a[a.length-1]];
  for (let i = a.length - 2; i >= 0; i--){
    let temp = alto[0] + adjustNote(a[i], a[i+1]);
    alto.unshift(temp);
  }

  // shifting tenor
  let tenor = [t[t.length-1] - 7];
  for (let i = t.length - 2; i >= 0; i--){
    let temp = tenor[0] + adjustNote(t[i], t[i+1]);
    tenor.unshift(temp);
  }


  return [soprano, alto, tenor];
}

function generateSAT(progression) {
  let s = [];
  let a = [];
  let t = [];
  let decisionBools = [];
  let decisionVoices = [];

  const romanNumArray = progression.split(' ');

  let last = spacingDict[romanNumArray[romanNumArray.length-1]];
  let decision = false;
  let dv = "";
  if (Array.isArray(last[0])) {
    dv = last;
    last = last[0];
    decision = true;
  }

  s.push(last[0]);
  a.push(last[1]);
  t.push(last[2]);
  decisionBools.push(decision);
  decisionVoices.push(dv);

  for (let i = romanNumArray.length - 1; i >= 1; i--){
    let progressionKey = romanNumArray[i] + " " + romanNumArray[i - 1];
    let possPathSets = progressionDict[progressionKey];

    let decisionPointBool = false; //make this a one liner
    if (possPathSets.length > 1){
      decisionPointBool = true;
    }

    let pathSet = possPathSets[0]; //hack for now

    let idx = 0;
    idx = addingNote(pathSet, s, idx);
    idx = addingNote(pathSet, a, idx);
    idx = addingNote(pathSet, t, idx);
    decisionBools.unshift(decisionPointBool);
    decisionVoices.unshift(possPathSets);
  }

  let parts = assigningToRegister(s, a, t);
  parts.push(decisionBools, decisionVoices);

  return parts;
}

// const progression = 'I I6 V I';
// const notesArr = generateSAT(progression);
// console.log(notesArr)

module.exports = { generateSAT };