import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DecisionButton from './decisionButton';
import ArrowButton from './arrowButton';
import { bassInterventionAvailability, satInterventionAvailability } from '../voiceLeadingFunctions/interventionOpportunities';
import '../componentsStyling/computeScreen.css';
import { satInterventionCalculations } from '../voiceLeadingFunctions/satInterventionCalculations';
import { convertToXML } from '../xml/xmlComputation';
import { forkingChange } from '../voiceLeadingFunctions/forkingChange.js';

function ComputeScreen() {
  const osmdContainerRef = useRef(null);
  const osmdInstanceRef = useRef(null);
  const location = useLocation();
  const { openSpacingXml, closedSpacingXml, table, xmlInput } = location.state || {};

  const [currentXml, setCurrentXml] = useState(openSpacingXml);
  const [isClosedSpacingAvailable, setIsClosedSpacingAvailable] = useState(!!closedSpacingXml);
  const [currentDegrees, setCurrentDegrees] = useState(xmlInput.openDegrees);

  const doublingOpportunities = table.doublingOpportunities;
  const methodOpportunities = table.methodOpportunities || Array(table.chords.length - 1).fill(false);
  const forkingOpportunities = table.forkingOpportunities || Array(table.chords.length - 1).fill(false);

  const [satInterventionOpportunities, setSatInterventionOpportunities] = useState(
    satInterventionAvailability(table.chords, currentDegrees)
  );
  const [bassInterventionOpportunities, setBassInterventionOpportunities] = useState(
    bassInterventionAvailability(table.chords, currentDegrees)
  );

  const [activeDoublingDecisions, setActiveDoublingDecisions] = useState(table.doublingDecisions || {});
  const [activeMethodButtons, setActiveMethodButtons] = useState({});
  const [activeForkingButtons, setActiveForkingButtons] = useState({});

  const updateCurrentDegrees = (row, index, type, opportunity = null) => {
    setCurrentDegrees(prevDegrees => {
      let newDegrees = JSON.parse(JSON.stringify(prevDegrees)); // Create a deep copy
      if (row === 'SAT Intervention') {
        newDegrees = satInterventionCalculations(newDegrees, type, index);
      } else if (row === 'Bass Intervention') {
        for (let i = index + 1; i < newDegrees.length; i++) {
          if (type === 'up') {
            newDegrees[i][3] += 7;
          } else {
            newDegrees[i][3] -= 7;
          }
        }
      } else if (row === 'Doubling') {
        setActiveDoublingDecisions(prevState => ({
          ...prevState,
          [index]: opportunity
        }));
      } else if (row === 'Method') {
        setActiveMethodButtons(prevState => ({
          ...prevState,
          [index]: opportunity
        }));
      } else if (row === 'Forking') {
        newDegrees = forkingChange(currentDegrees, index);
        console.log(newDegrees);

        setActiveForkingButtons(prevState => ({
          ...prevState,
          [index]: prevState[index] === opportunity ? null : opportunity // Toggle the active state
        }));
      }

      // Update intervention opportunities
      setSatInterventionOpportunities(satInterventionAvailability(table.chords, newDegrees));
      setBassInterventionOpportunities(bassInterventionAvailability(table.chords, newDegrees));

      let newXml = convertToXML(newDegrees, table.chords, xmlInput.key, xmlInput.durations);
      setCurrentXml(newXml);
      return newDegrees;
    });
  };

  const handleArrowClick = (row, index, type) => {
    console.log(`Arrow clicked in row: ${row}, index: ${index}, type: ${type}`);
    updateCurrentDegrees(row, index, type);
  };

  const handleOpportunityClick = (index, type, opportunity) => {
    console.log(`Opportunity clicked: type: ${type}, index: ${index}, opportunity: ${opportunity}`);
    updateCurrentDegrees(type, index, type, opportunity);
  };

  useEffect(() => {
    const loadAndRenderOSMD = async () => {
      if (!window.OpenSheetMusicDisplay) {
        const script = document.createElement('script');
        script.src = "https://unpkg.com/opensheetmusicdisplay@0.8.3/build/opensheetmusicdisplay.min.js";
        document.body.appendChild(script);

        script.onload = () => {
          renderOSMD();
        };
        script.onerror = () => console.error("Script failed to load");
      } else {
        renderOSMD();
      }
    };

    const renderOSMD = () => {
      if (osmdContainerRef.current && !osmdInstanceRef.current) {
        osmdInstanceRef.current = new window.opensheetmusicdisplay.OpenSheetMusicDisplay(osmdContainerRef.current, {
          autoResize: true,
          backend: "svg",
          drawTitle: true,
        });
      }

      if (osmdInstanceRef.current) {
        osmdInstanceRef.current.load(currentXml)
          .then(() => {
            osmdInstanceRef.current.render();
          })
          .catch(error => console.error("Error loading or rendering the score", error));
      }
    };

    loadAndRenderOSMD();

    return () => {
      const scripts = document.querySelectorAll('script[src="https://unpkg.com/opensheetmusicdisplay@0.8.3/build/opensheetmusicdisplay.min.js"]');
      scripts.forEach(script => document.body.removeChild(script));
    };
  }, [currentXml]);

  useEffect(() => {
    setIsClosedSpacingAvailable(!!closedSpacingXml);
  }, [closedSpacingXml]);

  const toggleSpacing = () => {
    if (isClosedSpacingAvailable) {
      setCurrentXml(prevXml => (prevXml === openSpacingXml ? closedSpacingXml : openSpacingXml));
    }
  };

  return (
    <div className="compute-screen">
      <div ref={osmdContainerRef} className="osmd-container" />
      <button
        onClick={toggleSpacing}
        disabled={!isClosedSpacingAvailable}
        className={`toggle-spacing-button ${!isClosedSpacingAvailable ? 'disabled' : ''}`}
      >
        {currentXml === openSpacingXml ? "Closed Spacing" : "Open Spacing"}
      </button>
      {table && table.chords.length > 1 && (
        <div className="info-container">
          {/* First Table: Doubling Decisions */}
          <table className="decision-table">
            <thead>
              <tr>
                <th></th>
                {table.chords.map((chord, index) => (
                  <th key={`chord-${index}`}>{chord}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Doubling</td>
                {doublingOpportunities.map((opportunity, index) => (
                  <td key={`doubling-${index}`}>
                    {opportunity && typeof opportunity === 'object' ? (
                      Object.keys(opportunity).map((key, keyIndex) => (
                        <DecisionButton
                          key={`doubling-${index}-${keyIndex}`}
                          text={key} // Pass text to be displayed
                          opportunity={key} // Opportunity for click handling
                          type="Doubling"
                          isActive={activeDoublingDecisions[index] === key}
                          index={index}
                          onClick={handleOpportunityClick}
                        />
                      ))
                    ) : (
                      <span></span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>

          {/* Second Table: Other Decisions with Arrows */}
          <table className="decision-table">
            <thead>
              <tr>
                <th></th>
                {table.chords.slice(0, -1).map((chord, index) => (
                  <th key={`chord-move-${index}`}>
                    {`${chord} ➔ ${table.chords[index + 1]}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Method</td>
                {methodOpportunities.map((opportunity, index) => (
                  <td key={`method-${index}`}>
                    {opportunity !== false && (
                      <DecisionButton
                        text="Method"
                        opportunity={opportunity} // Opportunity for click handling
                        type="Method"
                        isActive={activeMethodButtons[index] === opportunity} // Check if the button is active
                        index={index}
                        onClick={handleOpportunityClick}
                      />
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Forking</td>
                {forkingOpportunities.map((opportunity, index) => (
                  <td key={`forking-${index}`}>
                    {opportunity !== false && (
                      <DecisionButton
                        text="Forking"
                        opportunity={opportunity} // Opportunity for click handling
                        type="Forking"
                        isActive={activeForkingButtons[index] === opportunity} // Check if the button is active
                        index={index}
                        onClick={handleOpportunityClick}
                      />
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td>SAT Intervention</td>
                {satInterventionOpportunities.map((opportunity, index) => (
                  <td key={`sat-${index}`} className="decision-cell">
                    {(opportunity[0] || opportunity[1]) && (
                      <>
                        <ArrowButton
                          type="up"
                          row="SAT Intervention"
                          index={index}
                          isEnabled={opportunity[0]}
                          onClick={handleArrowClick}
                        />
                        <ArrowButton
                          type="down"
                          row="SAT Intervention"
                          index={index}
                          isEnabled={opportunity[1]}
                          onClick={handleArrowClick}
                        />
                      </>
                    )}
                    {!opportunity[0] && !opportunity[1] && (
                      <div className="arrow-placeholder"></div>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Bass Intervention</td>
                {bassInterventionOpportunities.map((opportunity, index) => (
                  <td key={`bass-${index}`} className="decision-cell">
                    {(opportunity[0] || opportunity[1]) && (
                      <>
                        <ArrowButton
                          type="up"
                          row="Bass Intervention"
                          index={index}
                          isEnabled={opportunity[0]}
                          onClick={handleArrowClick}
                        />
                        <ArrowButton
                          type="down"
                          row="Bass Intervention"
                          index={index}
                          isEnabled={opportunity[1]}
                          onClick={handleArrowClick}
                        />
                      </>
                    )}
                    {!opportunity[0] && !opportunity[1] && (
                      <div className="arrow-placeholder"></div>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ComputeScreen;
