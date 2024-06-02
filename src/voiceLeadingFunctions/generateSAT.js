import doublingChoice from './doublingChoice.js';
import { findDoublings } from './findDoublings.js';
const spacingDict = require('../dictionaries/openSpacing.json');
const progressionDict = require('../dictionaries/combinedProgression.json');
const doublingDictionary = require('../dictionaries/doublingDictionary.json');
const chordRootNoteDictionary = require('../dictionaries/chordRootNote.json');

function addingNote(method, satArray, forkingOpportunities, idx) {
  let addedNotes = [];

  for (let i = 0; i < 3; i++){
    let currNote = satArray[i][0];

    while (currNote > 7) { currNote -= 7; }
    while (currNote < 0) { currNote += 7; }

    let nextNote = method[currNote];

    // this is a fork
    if (Array.isArray(nextNote)){
      if (addedNotes.includes(nextNote[0])){
        nextNote = nextNote[1];
      } else {
        nextNote = nextNote[0];
        addedNotes.push(nextNote);
      }
    }
    satArray[i].unshift(nextNote);
  }
  if (addedNotes.length === 2){
    const newSatArray = satArray.map(subArray => [...subArray]);
    const regisSat = assigningToRegister(newSatArray[0], newSatArray[1], newSatArray[2]);

    let { correctVoicing } = doublingChoice(satArray[0].slice(0,2), satArray[1].slice(0,2), satArray[2].slice(0,2), regisSat[0][1], regisSat[1][1], regisSat[2][1]);
    for (let i = 0; i < 3; i++){
      satArray[i][0] = correctVoicing[i];
    }

    forkingOpportunities[idx] = method;
  }
}

// origin: linear scale degree
// targetDegree: modular scale degree
// returns: adjustment to linear scale degree (between -3 and 3)
function adjustNote(origin, targetDegree) {
  return (((targetDegree - origin + 10) % 7) - 3);
}

function assigningToRegister(s, a, t) {
  // shifting soprano
  let soprano = [s[s.length-1]];
  for (let i = s.length - 2; i >= 0; i--){
    let temp = soprano[0] + adjustNote(s[i+1], s[i]);
    soprano.unshift(temp);
  }

  // shifting alto
  let alto = [a[a.length-1]];
  for (let i = a.length - 2; i >= 0; i--){
    let temp = alto[0] + adjustNote(a[i+1], a[i]);
    alto.unshift(temp);
  }

  // shifting tenor
  let tenor = [t[t.length-1]];
  for (let i = t.length - 2; i >= 0; i--){
    let temp = tenor[0] + adjustNote(t[i+1], t[i]);
    tenor.unshift(temp);
  }

  return [soprano, alto, tenor];
}

function generateSAT(progression, methodDecisions, methodOpportunities, doublingDecisions, doublingOpportunities, forkingOpportunities) {
  let s = [];
  let a = [];
  let t = [];

  let last = spacingDict[progression[progression.length-1]];

  // this is a doubling opportunity for the last chord
  if (Array.isArray(last[0])) {   
    
    let doublingChoices = {};

    doublingChoices[doublingDictionary[JSON.stringify(last[0])]] = last[0];
    doublingChoices[doublingDictionary[JSON.stringify(last[1])]] = last[1];

    let lastChord = progression[progression.length-1]
    let root = chordRootNoteDictionary[lastChord];
    let doubledRoot = doublingChoices[root];

    doublingDecisions[doublingDecisions.length-1] = root;
    doublingOpportunities[doublingOpportunities.length-1] = doublingChoices;
    last = doubledRoot;
  }

  s.push(last[0]);
  a.push(last[1]);
  t.push(last[2]);

  for (let i = progression.length - 1; i >= 1; i--){
    let progressionKey = progression[i] + " " + progression[i - 1];
    let path = progressionDict[progressionKey];
    
    if (path.length > 1){
      let doublingDict = findDoublings(path);
      if (!(Object.keys(doublingDict).length === 0)){
        let root = chordRootNoteDictionary[progression[i - 1]];
        doublingDecisions[i-1] = root;
        path = [doublingDict[root]];
        doublingOpportunities[i-1] = doublingDict;
      } else {
        methodOpportunities[i-1] = path;
      }
    } 
    let method = path[methodDecisions[i-1]]; 

    addingNote(method, [s, a, t], forkingOpportunities, i-1);
  }
  let parts = assigningToRegister(s, a, t);
  parts.push(methodDecisions, methodOpportunities, doublingDecisions, doublingOpportunities, forkingOpportunities);

  return parts;
}

export { generateSAT, adjustNote };