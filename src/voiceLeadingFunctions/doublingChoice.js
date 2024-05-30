import { adjustNote } from "./generateSAT";

function doublingChoice(s, a, t, registerS, registerA, registerT) {
  const currS = s[0], currA = a[0], currT = t[0];

  let tempS, tempA, tempT;

  if (s[1] === a[1]){
    tempS = a[0];
    tempA = s[0];
    tempT = t[0];
  } else if (s[1] === t[1]){
    tempS = t[0];
    tempA = a[0];
    tempT = s[0];
  } else if (a[1] === t[1]){
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

    //what do I do in this case
    correctVoicing = [currS, currA, currT];
  }

  return { correctVoicing, change };
}

function checkSpacing(sPrev, aPrev, tPrev, sNext, aNext, tNext){
  const s = adjustNote(sPrev, sNext);
  const a = adjustNote(aPrev, aNext);
  const t = adjustNote(tPrev, tNext);

  if (((s - a) < 7) && ((a - t) < 7) && ((s - t) > 7)){
    return true;
  }
  return false;
}

export default doublingChoice;
