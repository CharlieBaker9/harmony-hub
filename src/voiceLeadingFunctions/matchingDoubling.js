function generateKeyList(dict) {
  const keyList = [];
  const keys = Object.keys(dict);

  keys.forEach(key => {
    const values = dict[parseInt(key)];

    if (!Array.isArray(values)){
      keyList.push(parseInt(key));
    } else {
      let numValues = values.length;
      for (let i = 0; i < numValues; i++) {
        keyList.push(parseInt(key));
      }
    }
  });

  return keyList.slice().sort();;
}

function generateOriginList(notes) {
  const modifiedNotes = notes.map(value => {
    if (value > 7) {
      return value - 7;
    } else if (value < 1) {
      return value + 7;
    } else {
      return value;
    }
  });

  const sortedList = modifiedNotes.slice().sort((a, b) => a - b);
  return sortedList;
}

function matchingDoubling(path, s, a, t){
  // determing method opportunity -- checking to see if the doubling is the same
  let tempPaths = []
  const sortedOriginChord = generateOriginList([s, a, t]);

  for (let j=0; j < path.length; j++){
    let sortedTargetChord = generateKeyList(path[j]);

    if (sortedTargetChord.length === sortedOriginChord.length) {
      if (sortedTargetChord.every((value, index) => value === sortedOriginChord[index])){
        tempPaths.push(path[j]);
      }
    }
  }
  return tempPaths;
}

export { matchingDoubling };