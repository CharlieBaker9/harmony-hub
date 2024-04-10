var dict = {
  "V I": {5: 5, 7: 1, 2: 3},
  "I I6": {5: 5, 3: 1, 1: 1},
  "I6 V": {5: 5, 1: [2,7]}
};

function printParts(progression, dict) {
  let P1 = []
  let P2 = []
  let P3 = []

  let curr = progression[0];
  for (let i = 1; i < progression.length; i++) {
    let next = progression[i];
    let prog = curr + " " + next;

    if (dict[prog] === 'undefined') {
      console.log("we've made a horrible mistake")
    } else {
      if (P1.length === 0){
        const keys = Object.keys(dict[prog])
        P1.push(parseInt(keys[0]))
        P2.push(parseInt(keys[1]))
        P3.push(parseInt(keys[2]))
      } 

      let tuple = false;

      if (dict[prog][P1.slice(-1)].constructor.name === "Array"){
        P1.push(dict[prog][P1.slice(-1)][0])
        tuple = true;
      } else {
        P1.push(dict[prog][P1.slice(-1)])
      }
      if (dict[prog][P2.slice(-1)].constructor.name === "Array"){
        if (tuple){
          P2.push(dict[prog][P2.slice(-1)][1])
        } else {
          P2.push(dict[prog][P2.slice(-1)][0])
          tuple = true;
        }
      } else {
        P2.push(dict[prog][P2.slice(-1)])
      }
      if (dict[prog][P3.slice(-1)].constructor.name === "Array"){
        if (tuple){
          P3.push(dict[prog][P3.slice(-1)][1])
        } else {
          P3.push(dict[prog][P3.slice(-1)][0])
          tuple = true;
        }
      } else {
        P3.push(dict[prog][P3.slice(-1)])
      }
    }
    curr = progression[i];
  }

  console.log(P1)
  console.log(P2)
  console.log(P3)
}

var progression = ["V", "I", "I6", "V", "I", "I6", "V", "I", "I6", "V"];

printParts(progression, dict);
