import { shiftBassNotes } from "./bassNotes";

function forkingChange(degrees, index){

  const changeChord = degrees[index+1];
  const remainderMap = {};
  const indices = [];

  for (let i = 0; i < 3; i++) {
    const remainder = (changeChord[i] + 70) % 7;

    if (remainderMap[remainder] !== undefined) {
      indices.push(remainderMap[remainder]);
      indices.push(i);
      break;
    } else {
      remainderMap[remainder] = i;
    }
  }

  let changes = [[],[]];
  for (let i = index+1; i > 0; i--){
    changes[0].unshift(degrees[i-1][indices[0]] - degrees[i][indices[0]]);
    changes[1].unshift(degrees[i-1][indices[1]] - degrees[i][indices[1]]);
  }

  for (let i = index+1; i > 0; i--){
    degrees[i-1][indices[1]] = degrees[i][indices[1]] + changes[0][i-1];
    degrees[i-1][indices[0]] = degrees[i][indices[0]] + changes[1][i-1];
  }

  const tenor = degrees.map(list => list[2]);
  const bass = degrees.map(list => list[3]);
 
  // shifting bass if necessary
  const shiftedBass = shiftBassNotes(tenor, bass);

  for (let i = 0; i < degrees.length; i++) {
    degrees[i][3] = shiftedBass[i];
  }
  console.log(degrees);
  console.log("tenor, then bass, then shiftedBass, : ", tenor, bass)
  console.log(shiftedBass);

  return degrees
}

export { forkingChange };