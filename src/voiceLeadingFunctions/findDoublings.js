const findDoublings = (paths) => {
  // Dictionary to store doubling occurrences
  const doublingDict = {};

  // Function to check and record doubling in a single path
  const checkDoublingInPath = (path) => {
    const valueCounts = {};

    for (const [, value] of Object.entries(path)) {
      if (valueCounts[value]) {
        valueCounts[value].count += 1;
      } else {
        valueCounts[value] = { count: 1, value: value };
      }
    }

    // Add to doublingDict if any value is doubled
    for (const [value, count] of Object.entries(valueCounts)) {
      if (count.count > 1) {
        doublingDict[value] = path;
      }
    }
  };

  // Iterate over all paths and check for doublings
  paths.forEach(checkDoublingInPath);

  return doublingDict;
};

export { findDoublings };