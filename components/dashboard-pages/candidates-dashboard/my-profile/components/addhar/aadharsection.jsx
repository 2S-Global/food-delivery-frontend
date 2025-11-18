import React, { useState, useEffect } from "react";
import AadharOtp from "./aadharotp";

const AadharSection = () => {
  const [havedetails, setHavedetails] = useState(false);

  return (
    <>
      <div className="ls-widget">
        <div className="tabs-box">
          <div className="widget-title">
            <h4>Aadhar Card</h4>
          </div>
          <div className="widget-content">
            {havedetails ? (
              <>will Show Details </>
            ) : (
              <>
                <AadharOtp />{" "}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AadharSection;
