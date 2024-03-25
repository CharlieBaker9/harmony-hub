# HarmonyHub: Real-Time Voice Leading Lab

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Independent study description

This independent study focuses on creating an interactive website aimed at teaching chordal progressions and voice leading in classical music theory. Guided by Dr. Moseley, the project will enable users to input chord progressions and a key, after which the site will automatically generate the voice leading for Soprano, Alto, Tenor, and Bass parts, adhering to a set of simple classical music theory rules. The innovation lies in its interactive design, where users not only receive automated voice leading but also encounter decision and intervention points. These points allow user to make choices on chordal voicings when a number of good options exist that express different emotions. A change of voicing at these points will significantly affect the musical outcome of the rest of the piece and will update in real time. The project will blend music theory with technology, providing an accessible platform for learners to hear and understand complex musical concepts practically. The website will incorporate different inversions of diatonic and chromatic chords allowing for such input as applied and pre-dominant chords. The website will also outline the wish lists and voice leading paths that occur within the music in a easily readable format below the score. By allowing for direct manipulation of music theory principles, the website aims to foster a deeper understanding and appreciation of classical music composition. The ultimate goal is to create a tool that acts as both an educational resource and a playground for music enthusiasts, students, and educators alike, promoting exploration and experimentation within the structured environment of classical music theory.

## Schedule by week

| Week | Tasks and Events                                                                                                    | Assignments Due                                   |
|------|----------------------------------------------------------------------------------------------------------------------|---------------------------------------------------|
| 1    | - Input chord progression for major keys                                                                           | Basic JavaScript                                  |
|      | - Generate transpositions based on scale degrees – using defaults of open spacing and root in soprano at the final  | function which takes                              |
|      | - Develop representation of register                                                                               | chord progression as                              |
|      | - Translate scale degrees into the notes of the key                                                                 | input and outputs                                 |
|      | - Create decision points based on a set of rules                                                                    | chordal voices                                    |
| 2    | - Build crude React website frontend in order to input                                                              | Create React App w/                               |
|      |   chord progressions and see them on a screen                                                                       | limited representation                            |
|      | - Create intervention points                                                                                        | of chords and decision                            |
|      | - Only allow after a tonic chord and the credential 6-4                                                             | points                                            |
|      |   between I6⁴ and V                                                                                                 | React App +                                       |
| 3    | - Incorporate OSMD and vexflow into frontend                                                                        | intervention points                               |
|      | - Link chord progressions to OSMD in order to see                                                                   | React App + frontend                              |
|      |   musical notation on a screen for the first time                                                                   | improvements in order                             |
|      |                                                                                                                      | to visualize chords on a                          |
|      |                                                                                                                      | music stave                                       |
| 4    | - Create the ability to input chord progressions in minor keys, with applied chords, and chromatic pre-dominants     | React App + ability for                           |
|      | - Build midi playback design in order to hear the chords on the screen                                              | larger range of inputs                            |
| 5    | - Enable the user to change temp, play from different places as well as select parts on their own to hear in         | React App + ability to                            |
|      |   isolation from the chords                                                                                        | hear notes on the                                 |
|      | - Code wish lists and pathway diagrams to appear below stave in a specific format                                   | screen                                            |
| 6    | - Allow for rhythmic changes                                                                                       | React App + wish lists /                          |
|      | - Allow for users to input suspensions and                                                                         | pathways below                                    |
|      |   passing/neighbor tones in order to bring to life the chord progressions and provide more color into the           | React App +                                       |
|      |   creative process of chord progressions                                                                           | suspensions and                                   |
| 7    | - Contingency and Refinement: overcome unforeseen challenges and refine the application                             | passing/neighbor tones                            |
| 8    | - Contingency and Refinement: overcome unforeseen                                                                   | React App that is fully                           |
|      |   challenges and refine the application                                                                            | functional and well-                              |
| 9    |                                                                                                                      | designed                                          |
| 10   |                                                                                                                      | React App that is fully                           |
|      |                                                                                                                      | functional and well-                              |
|      |                                                                                                                      | designed                                          |

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.