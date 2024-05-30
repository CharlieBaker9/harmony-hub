// Define the scale and corresponding notes in octave 4
const scale = {
  1: { step: 'C', octave: 4 },
  2: { step: 'D', octave: 4 },
  3: { step: 'E', octave: 4 },
  4: { step: 'F', octave: 4 },
  5: { step: 'G', octave: 4 },
  6: { step: 'A', octave: 4 },
  7: { step: 'B', octave: 4 }
};

// Function to normalize the degree to fall within 1-7
const normalizeDegree = (degree) => {
  return ((degree - 1) % 7 + 7) % 7 + 1;
};

// Function to adjust the octave based on the register
const adjustOctave = (degree) => {
  const normalizedDegree = normalizeDegree(degree);
  const baseOctave = scale[normalizedDegree].octave;
  const register = Math.floor((degree - 1) / 7);
  return baseOctave + register;
};

// Function to convert scale degrees to MusicXML format
function convertToXML(degrees) {
  const trebleClefNotes = degrees.map(degreeList => {
    return degreeList.slice(0, 2).map((degree, index) => {
      const normalizedDegree = normalizeDegree(degree);
      const note = scale[normalizedDegree];
      const octave = adjustOctave(degree);

      return `
        <note>
          ${index > 0 ? '<chord/>' : ''}
          <pitch>
            <step>${note.step}</step>
            <octave>${octave}</octave>
          </pitch>
          <duration>4</duration>
          <type>whole</type>
        </note>`;
    }).join('\n');
  }).join('\n');

  const bassClefNotes = degrees.map(degreeList => {
    return degreeList.slice(2, 4).map((degree, index) => {
      const normalizedDegree = normalizeDegree(degree);
      const note = scale[normalizedDegree];
      const octave = adjustOctave(degree);

      return `
        <note>
          ${index > 0 ? '<chord/>' : ''}
          <pitch>
            <step>${note.step}</step>
            <octave>${octave}</octave>
          </pitch>
          <duration>4</duration>
          <type>whole</type>
        </note>`;
    }).join('\n');
  }).join('\n');

  const fullXML = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
  <!DOCTYPE score-partwise PUBLIC
      "-//Recordare//DTD MusicXML 4.0 Partwise//EN"
      "http://www.musicxml.org/dtds/partwise.dtd">
  <score-partwise version="4.0">
  <work>
    <work-title>Your Progression</work-title>
  </work>
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

// // Example usage
// const degrees = [
//   [1, 3, 5, -2],
//   [4, 6, 1, -3],
//   [5, 7, 2, -4]
// ];

// const notesXML = convertToXML(degrees);

module.exports = { convertToXML };
