const dict = require('../dictionaries/chordBassNote.json');

function obtainBassNotes(progression) {
  // Separate the progression string into an array by spaces
  const progArr = progression.split(' ');
  let noteArr = [];

  for (let i = 0; i < progArr.length; i++){
    noteArr.push(dict[progArr[i]]);
  }

  const endingNote = {"1": 1, "7": 0, "6": -1, "5": -2, "4": -3, "3": -4, "2": -5}
  let pitchedBassNotes = [];
  let state = 0;

  pitchedBassNotes.push(endingNote[noteArr.slice(-1)])
  for (let i = noteArr.length-2; i >= 0; i--){
    let diff = noteArr[i] - noteArr[i+1];

    if (diff <= 2 && diff >= -2){            // shifting by 2nd's, 3rd's, or repeating note
      let newNote = pitchedBassNotes[0] + diff;
      pitchedBassNotes.unshift(newNote);
      state += diff;
    } else if ([6, -6].includes(diff)){      // dealing with 7ths and shifting to movements by 2nd's
      let newNote = pitchedBassNotes[0] - diff/6;
      pitchedBassNotes.unshift(newNote);
      state -= diff/6;
    } else if ([5, -5].includes(diff)){      // dealing with 6ths and shifting to movements by 3rd's
      let newNote = pitchedBassNotes[0] - diff*(2/5);
      pitchedBassNotes.unshift(newNote);
      state -= diff*(2/5);
    } else if ([-4, -3, 3, 4].includes(diff)){
      if ((state > 0 && diff < 0) || (state < 0 && diff > 0)){ // simple condition where not is self correcting back to optimal state
        let newNote = pitchedBassNotes[0] + diff;
        pitchedBassNotes.unshift(newNote);
        state += diff;
      } else if ([-3, 3].includes(diff)){ // flip fourths to movement by fifths to get back to optimal state
        let newNote = pitchedBassNotes[0] + (diff)*(-4/3);
        pitchedBassNotes.unshift(newNote);
        state += (diff)*(-4/3);
      }  else { // flip fifths to movement by fourths to get back to optimal state
        let newNote = pitchedBassNotes[0] + (diff)*(-3/4);
        pitchedBassNotes.unshift(newNote);
        state += (diff)*(-3/4);
      }
    } else {
      console.log("my difference math was wrong");
    }
  }
  return pitchedBassNotes;
}

function shiftBassNotes(tenor, bass) {
  let noCrosses = false;

  while (!noCrosses) {  
    for (let i = 0; i < tenor.length; i ++){
      if (tenor[i] < bass[i] || (i > 0 && tenor[i] < bass[i - 1]) || (i < tenor.length - 1 && tenor[i] < bass[i + 1])){
        bass = bass.map(value => value - 7);
        break;
      }
      if (i === tenor.length - 1){
        noCrosses = true;
      }
    }
  }

  return bass;
}

// const progression = 'I I6 V I';
// const notesArr = obtainBassNotes(progression);

// const tenor1 = [-1, 2, 2, 5];
// const tenor2 = [-14, -21, -20, -18];
// const fixedBass = shiftBassNotes(tenor1, notesArr);
// const fixedBass2 = shiftBassNotes(tenor2, notesArr);
// console.log(fixedBass)
// console.log(fixedBass2)

module.exports = { obtainBassNotes, shiftBassNotes };