const spacingDict = require('../dictionaries/openSpacing.json');
const progressionDict = require('../dictionaries/progressionDict.json');

//get rid of idx and add all three SAT 
function addingNote(method, satArray, doublingDecisions) {
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
}

// //get rid of idx and add all three SAT 
// function addingNote(method, array, idx) {
//   let currNote = array[0];

//   while (currNote > 7) {
//     currNote -= 7;
//   }

//   while (currNote < 0) {
//     currNote += 7;
//   }

//   let nextNote = method[currNote];
//   // console.log(method, array, idx);

//   //this is doubling fork 
//   if (Array.isArray(nextNote)){
//     let tempIdx = idx;
//     if (idx === 3){
//       tempIdx = 0;
//     }
//     if (idx === 2){
//       tempIdx = 1;
//     }
//     nextNote = nextNote[tempIdx];
//     idx += 1;   //dumb -- need specific arrangement as it unfolds -- registral scale degrees
//   }
//   array.unshift(nextNote);

//   return idx
// }

// function containsListOfNumbers(obj) {
//   for (let key in obj) {
//       if (Array.isArray(obj[key]) && obj[key].every(item => typeof item === 'number')) {
//           return true;
//       }
//   }
//   return false;
// }

function adjustNote(noteIn, noteOut) {
  return (((noteIn - noteOut + 10) % 7) - 3)
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
  let methodsDecisions = Array(progression.length-1).fill(0);
  let doublingDecisions = [false, true, true]
  // let doublingDecisions = Array(progression.length-1).fill(true);

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
    let path = progressionDict[progressionKey];

    let methodForkBool = false; //make this a one liner
    if (path.length > 1){
      methodForkBool = true;
    }

    // use a method selection so that users can change between the different voice leadings 
    let method = path[methodsDecisions[i-1]]; 

    // // means there are two ways to do spacing
    // if (!(containsListOfNumbers(method))){
      
    // }
    

    // let idx = 0;
  
    addingNote(method, [s, a, t], doublingDecisions);
    // idx = addingNote(method, s, idx);
    // idx = addingNote(method, a, idx);
    // idx = addingNote(method, t, idx);
    decisionBools.unshift(methodForkBool);
    decisionVoices.unshift(path);
  }

  let parts = assigningToRegister(s, a, t);
  parts.push(decisionBools, decisionVoices, methodsDecisions, doublingDecisions);

  return parts;
}

// const progression = 'IV V I I6 V I';
const progression2 = "I I6 I I6";
const notesArr = generateSAT(progression2);

console.log(notesArr[0]);
console.log(notesArr[1]);
console.log(notesArr[2]);

module.exports = { generateSAT };