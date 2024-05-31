import { adjustNote } from "./generateSAT";

function doublingChoice(s, a, t, registerS, registerA, registerT) {
  const currS = s[0], currA = a[0], currT = t[0];

  let tempS, tempA, tempT;

  if ((s[1]+70) % 7 === (a[1]+70) % 7 ){
    tempS = a[0];
    tempA = s[0];
    tempT = t[0];
  } else if ((s[1]+70) % 7  === (t[1]+70) % 7 ){
    tempS = t[0];
    tempA = a[0];
    tempT = s[0];
  } else if ((a[1]+70) % 7  === (t[1]+70) % 7 ){
    tempS = s[0];
    tempA = t[0];
    tempT = a[0];
  }

  const checkCurr = checkSpacing(currS, currA, currT, registerS, registerA, registerT);
  const checkTemp = checkSpacing(tempS, tempA, tempT, registerS, registerA, registerT);

  let correctVoicing;
  let change = false;
  if (checkCurr){
    correctVoicing = [currS, currA, currT];
  } else if (checkTemp){
    correctVoicing = [tempS, tempA, tempT];
    change = true;
  } else {
    // probably won't happen
    // Alert("Something went wrong -- spacing is most likely wrong");
    correctVoicing = [currS, currA, currT];
  }

  return { correctVoicing, change };
}

// the expected types of values are the S,A,T parts in registral parts
// the prev values should be integers 1 through 7
// the next values are integers without limitation (which represent registral notes that occur after the prev note)
function checkSpacing(sPrev, aPrev, tPrev, sNext, aNext, tNext){
  const s = sNext + adjustNote(sNext, sPrev);
  const a = aNext + adjustNote(aNext, aPrev);
  const t = tNext + adjustNote(tNext, tPrev);

  if (((s - a) < 7) && ((a - t) < 7) && ((s - t) > 7)){
    return true;
  }
  return false;
}

export default doublingChoice;
