import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DecisionButton from './decisionButton';
import ArrowButton from './arrowButton';
import '../componentsStyling/computeScreen.css';

function ComputeScreen() {
  const osmdContainerRef = useRef(null);
  const osmdInstanceRef = useRef(null);
  const location = useLocation();
  const { openSpacingXml, closedSpacingXml, table } = location.state || {};

  const [currentXml, setCurrentXml] = useState(openSpacingXml);
  const [isClosedSpacingAvailable, setIsClosedSpacingAvailable] = useState(!!closedSpacingXml);

  // Initialize additional opportunity arrays if not present
  const methodOpportunities = table.methodOpportunities || Array(table.chords.length - 1).fill(false);
  const forkingOpportunities = table.forkingOpportunities || Array(table.chords.length - 1).fill(false);
  const satInterventionOpportunities = table.satInterventionOpportunities || Array(table.chords.length - 1).fill([false, false]);
  const bassInterventionOpportunities = table.bassInterventionOpportunities || Array(table.chords.length - 1).fill([false, false]);

  satInterventionOpportunities[1] = [true, false];
  bassInterventionOpportunities[0] = [true, true];

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
      {table && (
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
                {table.doublingOpportunities.map((opportunity, index) => (
                  <td key={`doubling-${index}`}>
                    <DecisionButton opportunity={opportunity} type="Doubling" />
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
                    <DecisionButton opportunity={opportunity} type="Method" />
                  </td>
                ))}
              </tr>
              <tr>
                <td>Forking</td>
                {forkingOpportunities.map((opportunity, index) => (
                  <td key={`forking-${index}`}>
                    <DecisionButton opportunity={opportunity} type="Forking" />
                  </td>
                ))}
              </tr>
              <tr>
                <td>SAT Intervention</td>
                {satInterventionOpportunities.map((opportunity, index) => (
                  <td key={`sat-${index}`} className="decision-cell">
                    {opportunity[0] && (
                      <ArrowButton type="up" row="SAT Intervention" index={index} isEnabled={opportunity[0]} />
                    )}
                    {opportunity[1] && (
                      <ArrowButton type="down" row="SAT Intervention" index={index} isEnabled={opportunity[1]} />
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
                    {opportunity[0] && (
                      <ArrowButton type="up" row="Bass Intervention" index={index} isEnabled={opportunity[0]} />
                    )}
                    {opportunity[1] && (
                      <ArrowButton type="down" row="Bass Intervention" index={index} isEnabled={opportunity[1]} />
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
