function satInterventionCalculations(degrees, direction, index) {
  const newDegrees = JSON.parse(JSON.stringify(degrees)); // Create a deep copy

  // Function to get the maximum ST difference from the given index to the end of the list
  const getMaxSTDifference = (arr, startIndex) => {
    return Math.max(...arr.slice(startIndex).map(degree => degree[0] - degree[2]));
  };

  if (direction === "up") {
    const maxSTDifference = getMaxSTDifference(newDegrees, index);

    // Find the first multiple of 7 greater than or equal to maxSTDifference
    const tenorAdjustment = Math.ceil(maxSTDifference / 7) * 7;

    for (let i = index+1; i < newDegrees.length; i++) {
      const oldDegree0 = newDegrees[i][0];
      const oldDegree1 = newDegrees[i][1];

      newDegrees[i][0] = newDegrees[i][2] + tenorAdjustment;
      newDegrees[i][1] = oldDegree0;
      newDegrees[i][2] = oldDegree1;
    }
  } else {
    const maxSTDifference = getMaxSTDifference(newDegrees, index);

    // Find the first multiple of 7 greater than or equal to maxSTDifference
    const sopranoAdjustment = -Math.ceil(maxSTDifference / 7) * 7;

    for (let i = index+1; i < newDegrees.length; i++) {
      const oldDegree1 = newDegrees[i][1];
      const oldDegree2 = newDegrees[i][2];

      newDegrees[i][2] = newDegrees[i][0] + sopranoAdjustment;
      newDegrees[i][1] = oldDegree2;
      newDegrees[i][0] = oldDegree1;
    }

    // Checking if tenor has dropped below bass - can't let that happen
    for (let i = 0; i < newDegrees.length; i++) {
      if (newDegrees[i][2] < newDegrees[i][3]) {
        return NaN;
      }
    }
  }

  return newDegrees;
}

export { satInterventionCalculations };
