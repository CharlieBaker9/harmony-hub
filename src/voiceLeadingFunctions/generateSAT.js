import doublingChoice from './doublingChoice.js';
const spacingDict = require('../dictionaries/openSpacing.json');
const progressionDict = require('../dictionaries/progressionDict.json');

function addingNote(method, satArray, doublingDecisions, doublingOpportunities, idx) {
  let returningToSameScaleDegree = false;
  for (let i = 0; i < 3; i++){
    let currNote = satArray[i][0];

    while (currNote > 7) { currNote -= 7; }
    while (currNote < 0) { currNote += 7; }

    let nextNote = method[currNote];

    //this is doubling fork 
    if (Array.isArray(nextNote)){
      const doublingPolarityBool = doublingDecisions[doublingDecisions.length - satArray[i].length];
      if (!returningToSameScaleDegree){
        nextNote = nextNote[doublingPolarityBool ? 0 : 1]
        returningToSameScaleDegree = true;
      } else {
        nextNote = nextNote[doublingPolarityBool ? 1 : 0]
      }
    }
    satArray[i].unshift(nextNote);
  }
  if (returningToSameScaleDegree){
    doublingOpportunities[idx] = true;
    const newSatArray = satArray.map(subArray => [...subArray]);
    const regisSat = assigningToRegister(newSatArray[0], newSatArray[1], newSatArray[2]);

    const { correctVoicing, changed } = doublingChoice(satArray[0].slice(0,2), satArray[1].slice(0,2), satArray[2].slice(0,2), regisSat[0][1], regisSat[1][1], regisSat[2][1]);
    for (let i = 0; i < 3; i++){
      satArray[i][0] = correctVoicing[i];
    }
    if (changed) {
      let index = doublingDecisions.length - satArray[0].length;
      doublingDecisions[index] = doublingDecisions[index] === 1 ? 0 : 1;
    }
  }
}

function adjustNote(noteIn, noteOut) {
  return (((noteIn - noteOut + 10) % 7) - 3);
}

function assigningToRegister(s, a, t) {
  // shifting soprano
  let soprano = [s[s.length-1]];
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
  let tenor = [t[t.length-1]];
  for (let i = t.length - 2; i >= 0; i--){
    let temp = tenor[0] + adjustNote(t[i], t[i+1]);
    tenor.unshift(temp);
  }

  return [soprano, alto, tenor];
}

function generateSAT(progression, methodDecisions, methodOpportunities, doublingDecisions, doublingOpportunities) {
  let s = [];
  let a = [];
  let t = [];

  let last = spacingDict[progression[progression.length-1]];

  if (Array.isArray(last[0])) {
    last = last[0];
    methodOpportunities[methodOpportunities.length-1] = true;
  }

  s.push(last[0]);
  a.push(last[1]);
  t.push(last[2]);

  for (let i = progression.length - 1; i >= 1; i--){
    let progressionKey = progression[i] + " " + progression[i - 1];
    let path = progressionDict[progressionKey];

    methodOpportunities[i-1] = path.length > 1;
    let method = path[methodDecisions[i-1]]; 

    addingNote(method, [s, a, t], doublingDecisions, doublingOpportunities, i-1);
  }
  let parts = assigningToRegister(s, a, t);
  parts.push(methodDecisions, methodOpportunities, doublingDecisions, doublingOpportunities);

  return parts;
}

export { generateSAT, adjustNote };