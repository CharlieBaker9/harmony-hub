const keyDict = require('../dictionaries/scales.json');

// Function to normalize the degree to fall within 1-7
const normalizeDegree = (degree) => {
  return ((degree - 1) % 7 + 7) % 7 + 1;
};

// Function to adjust the octave based on the register
const adjustOctave = (degree, scale) => {
  const normalizedDegree = normalizeDegree(degree);
  const baseOctave = scale[normalizedDegree.toString()].octave;
  const register = Math.floor((degree - 1) / 7);
  return baseOctave + register;
};

// Function to convert scale degrees to MusicXML format
function convertToXML(degrees, chordSequence, key, durations) {
  const measureDuration = 4; // Duration of a measure in quarter notes
  let currentDuration = 0; // Duration counter for the current measure
  let measureCount = 1; // Measure counter
  let scale = keyDict[key];
  // let scale = keyDict[key]; // Get the scale based on the key parameter

  const createNoteXML = (degree, index) => {
    const normalizedDegree = normalizeDegree(degree);
    const note = scale[normalizedDegree.toString()];
    const octave = adjustOctave(degree, scale);
    const duration = 0.5;
    let isEighthNote = (duration === 0.25);
    
    // const duration = durations[index]; // Use the duration passed as argument

    let noteXML = `
      <note>
        ${index > 0 ? '<chord/>' : ''}
        <pitch>
          <step>${note.step}</step>
          ${note.alter !== 0 ? `<alter>${note.alter}</alter>` : ''}
          <octave>${octave}</octave>
        </pitch>
        <duration>${duration}</duration>
        <type>${
          duration === 2 ? 'whole' :
          duration === 1 ? 'half' :
          duration === 0.5 ? 'quarter' :
          duration === 0.25 ? 'eighth' : 'unknown'
        }</type>
        ${isEighthNote ? '<beam number="1">begin</beam>' : ''}
      </note>`;

    currentDuration += duration;

    // Add measure closing and opening tags if measure is full
    if (currentDuration >= measureDuration) {
      noteXML += `
        </measure>
        <measure number="${++measureCount}">`;
      currentDuration = 0;
    }

    return noteXML;
  };

  const trebleClefNotes = degrees.map(degreeList => {
    return degreeList.slice(0, 2).map(createNoteXML).join('\n');
  }).join('\n');

  const bassClefNotes = degrees.map(degreeList => {
    return degreeList.slice(2, 4).map(createNoteXML).join('\n');
  }).join('\n');

  const fullXML = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
  <!DOCTYPE score-partwise PUBLIC
      "-//Recordare//DTD MusicXML 4.0 Partwise//EN"
      "http://www.musicxml.org/dtds/partwise.dtd">
  <score-partwise version="4.0">
    <work>
      <work-title>${chordSequence + " in " + key + " Major"}</work-title>
    </work>
    <defaults>
      <scaling>
        <millimeters>10.0</millimeters>
        <tenths>80</tenths>
      </scaling>
      <system-layout>
        <system-margins>
          <left-margin>0</left-margin>
          <right-margin>0</right-margin>
        </system-margins>
        <top-system-distance>40</top-system-distance>
      </system-layout>
      <page-layout>
        <page-margins type="both">
          <left-margin>20</left-margin>
          <right-margin>20</right-margin>
          <top-margin>50</top-margin>
          <bottom-margin>20</bottom-margin>
        </page-margins>
      </page-layout>
    </defaults>
    <part-list>
      <score-part id="P1">
        <part-name>Treble</part-name>
      </score-part>
      <score-part id="P2">
        <part-name>Bass</part-name>
      </score-part>
    </part-list>
    <part id="P1">
      <measure number="1">
        <attributes>
          <divisions>1</divisions>
          <key>
            <fifths>0</fifths>
          </key>
          <time>
            <beats>4</beats>
            <beat-type>4</beat-type>
          </time>
          <clef>
            <sign>G</sign>
            <line>2</line>
          </clef>
        </attributes>
        ${trebleClefNotes}
      </measure>
    </part>
    <part id="P2">
      <measure number="1">
        <attributes>
          <divisions>1</divisions>
          <key>
            <fifths>0</fifths>
          </key>
          <time>
            <beats>4</beats>
            <beat-type>4</beat-type>
          </time>
          <clef>
            <sign>F</sign>
            <line>4</line>
          </clef>
        </attributes>
        ${bassClefNotes}
      </measure>
    </part>
  </score-partwise>`;

  return fullXML;
}

// Example usage
// const degrees = [
//   [1, 3, 5, -2],
//   [4, 6, 1, -3],
//   [5, 7, 2, -4]
// ];

// const chordSequence = "I IV V";
// const notesXML = convertToXML(degrees, chordSequence, "C", [4, 4, 4, 4]);

module.exports = { convertToXML };
