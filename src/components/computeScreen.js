// src/components/computeScreen.js
import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DecisionButton from './decisionButton';

function ComputeScreen() {
  const osmdContainerRef = useRef(null);
  const osmdInstanceRef = useRef(null);
  const location = useLocation();
  const { notesXml, table } = location.state || {};

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

        if (notesXml) {
          osmdInstanceRef.current.load(notesXml)
            .then(() => {
              osmdInstanceRef.current.render();
            })
            .catch(error => console.error("Error loading or rendering the score", error));
        }
      }
    };

    loadAndRenderOSMD();

    return () => {
      const scripts = document.querySelectorAll('script[src="https://unpkg.com/opensheetmusicdisplay@0.8.3/build/opensheetmusicdisplay.min.js"]');
      scripts.forEach(script => document.body.removeChild(script));
    };
  }, [notesXml]);

  return (
    <div>
      <div ref={osmdContainerRef} style={{ width: '100%', height: '100%' }} />
      {table && (
        <div>
          <DecisionButton label="Method Decisions" text={JSON.stringify(table.methodDecisions, null, 2)} />
          <DecisionButton label="Doubling Decisions" text={JSON.stringify(table.doublingDecisions, null, 2)} />
        </div>
      )}
    </div>
  );
}

export default ComputeScreen;
