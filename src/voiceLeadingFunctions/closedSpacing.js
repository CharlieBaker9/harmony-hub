function closedSpacingConversion(formattedNotes){
  let closedSpacing = JSON.parse(JSON.stringify(formattedNotes));

  for ( let i=0; i < formattedNotes.length; i++ ){
    const newSoprano = formattedNotes[i][2] + 7;
    const newTenor = formattedNotes[i][0] - 7;
    const alto = formattedNotes[i][1];

    if ((newSoprano <= alto) || (newTenor >= alto)){
      return NaN;
    }

    closedSpacing[i][0] = newSoprano;
    closedSpacing[i][2] = newTenor;
  }

  let goodBass = false;

  // Check the goodBass condition
  for (let i = 0; i < closedSpacing.length; i++) {
    if (closedSpacing[i][2] < closedSpacing[i][3] + 7) {
      goodBass = true;
      break; 
    }
  }

  // Add 7 to every fourth element of each sublist if goodBass is false
  if (!goodBass) {
    for (let i = 0; i < closedSpacing.length; i++) {
      closedSpacing[i][3] += 7;
    }
  }

  return closedSpacing;
}

export { closedSpacingConversion };