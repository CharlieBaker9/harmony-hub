import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DecisionButton from './decisionButton';
import '../componentsStyling/computeScreen.css';

function ComputeScreen() {
  const osmdContainerRef = useRef(null);
  const osmdInstanceRef = useRef(null);
  const location = useLocation();
  const { openSpacingXml, closedSpacingXml, table } = location.state || {};

  const [currentXml, setCurrentXml] = useState(openSpacingXml);
  const [isClosedSpacingAvailable, setIsClosedSpacingAvailable] = useState(!!closedSpacingXml);

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
      {table && (
        <div className="info-container">
          <div className="decision-buttons">
            {table.methodOpportunities.map((opportunity, index) => (
              <DecisionButton key={`method-${index}`} opportunity={opportunity} type="Method" />
            ))}
          </div>
          <div className="decision-buttons">
            {table.doublingOpportunities.map((opportunity, index) => (
              <DecisionButton key={`doubling-${index}`} opportunity={opportunity} type="Doubling" />
            ))}
          </div>
        </div>
      )}
      <button
        onClick={toggleSpacing}
        disabled={!isClosedSpacingAvailable}
        className={`toggle-spacing-button ${!isClosedSpacingAvailable ? 'disabled' : ''}`}
      >
        {currentXml === openSpacingXml ? "Closed Spacing" : "Open Spacing"}
      </button>
    </div>
  );
}

export default ComputeScreen;
