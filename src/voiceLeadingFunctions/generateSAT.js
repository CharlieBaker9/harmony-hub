const spacingDict = require('../dictionaries/openSpacing.json');
const progressionDict = require('../dictionaries/progressionDict.json');

function addingNote(nextDict, array, idx) {
  let nextNote = nextDict[array[0]];
  if (Array.isArray(nextNote)){
    nextNote = nextNote[idx];
    idx += 1;
  }
  array.unshift(nextNote);
}

function assigningToRegister(s, a, t) {
  let soprano = s.map(function(number) { return number + 7;});
  let tenor = t.map(function(number) { return number - 7;});
  
  let alto = [a[a.length-1]];
  for (let i = a.length - 2; i >= 0; i--){
    let temp = a[i];
    if (a[i] - alto[0] > 3){
      temp -= 7;
    }
    alto.unshift(temp);
  }

  for (let i = 0; i < alto.length; i++){
    if (soprano[i] >= alto[i] + 8){ //do we want this to be + 7 allow for unisons?
      soprano[i] -= 7;
    }
    if (tenor[i] <= a[i] - 8){ //do we want this to be - 7 allow for unisons?
      tenor[i] += 7;
    }
  }

  return [soprano, alto, tenor];
}

function generateSAT(progression) {
  let s = [];
  let a = [];
  let t = [];

  const progArr = progression.split(' ');

  let last = spacingDict[progArr[progArr.length-1]];

  if (Array.isArray(last[0])) { 
    last = last[0];
  }

  s.push(last[0]);
  a.push(last[1]);
  t.push(last[2]);

  for (let i = progArr.length - 1; i >= 1; i--){
    let key = progArr[i-1] + " " + progArr[i];
    let nextDict = progressionDict[key];

    if (Array.isArray(nextDict)){
      //decision point
      nextDict = nextDict[0];
    }

    let idx = 0;
    addingNote(nextDict, s, idx);
    addingNote(nextDict, a, idx);
    addingNote(nextDict, t, idx);
  }
  
  let parts = assigningToRegister(s, a, t);

  return parts;
}
// const progression = 'I I6 V I';
// const notesArr = generateSAT(progression);
// console.log(notesArr)

module.exports = { generateSAT };