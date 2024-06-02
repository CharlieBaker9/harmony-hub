import { satInterventionCalculations } from "./satInterventionCalculations"

function satInterventionAvailability (chords, degrees){
  let interventionOpportunities = [];
  for (let i = 0; i < chords.length - 1; i++) {
    let upBool, downBool = false;
    if (["I", "V"].includes(chords[i])){
      if (Array.isArray(satInterventionCalculations(degrees, "up", i+1))){
        upBool = true
      } 
      if (Array.isArray(satInterventionCalculations(degrees, "down", i+1))){
        downBool = true
      }
    }
    interventionOpportunities.push([upBool, downBool]);
  }
  return interventionOpportunities;
}

function bassInterventionAvailability (chords, degrees){
  let interventionOpportunities = [];
  for (let i = 0; i < chords.length - 1; i++) {
    if (["I", "V"].includes(chords[i])){

      // determining if bass can move up an octave
      let validChange = true;
      for (let j = i+1; j < degrees.length; j++){
        const tenor = degrees[j][2];
        const proposedBass = degrees[j][3] + 7;
        if (proposedBass > tenor){
          validChange = false
        }
      }
      interventionOpportunities.push([validChange, true]); //bass can always move down an octave
    } else {
      interventionOpportunities.push([false, false]);
    }
  }
  return interventionOpportunities;
}

export { satInterventionAvailability, bassInterventionAvailability };