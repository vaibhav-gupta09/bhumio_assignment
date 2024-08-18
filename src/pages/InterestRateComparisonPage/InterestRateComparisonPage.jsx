import React, {useEffect, useState} from "react";
import InterestRateChart from "../../components/InterestRateChart/InterestRateChart";
import ParameterInputs from "../../components/ParameterInput/ParameterInputs";
import CircularProgress from "@mui/material/CircularProgress";

import "./InterestRateComparisonPage.css";

const InterestRateComparisonPage = () => {

  const [interestRateDataJson, setInterestRateDataJson] = useState({});
  const hasData =
    interestRateDataJson && Object.keys(interestRateDataJson).length > 0;
  return (
    <div className="root-container">
      <h2>Explore Interest Rates</h2>
      <div className="page-container">
        <div className="parameter-inputs-container">
          <ParameterInputs
            setInterestRateDataJson={setInterestRateDataJson}
            interestRateData={interestRateDataJson}
          />
        </div>
        <div className="interest-rate-chart-container">
          {hasData ? (
            <InterestRateChart interestRateDataJson={interestRateDataJson} />
          ) : (
            <div className="loader-container">
              <CircularProgress sx={{ color: "#27ca9d" }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterestRateComparisonPage;
