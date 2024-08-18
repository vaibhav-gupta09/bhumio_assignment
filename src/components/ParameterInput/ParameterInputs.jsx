import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import MuiToggleButton  from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Slider from "@mui/material/Slider";
import { states } from "../../constants/states";
import axios from "axios";
import "./ParameterInputs.css";
import { LabelTypography } from "../../elements/LabelTypography";
import { ToggleButton } from "../../elements/ToggleButton";

const ParameterInputs = ({ setInterestRateDataJson, interestRateDataJson }) => {
  const [state, setState] = useState("AL");
  const [loanType, setLoanType] = useState("CONF");
  const [housePrice, setHousePrice] = useState(200000);
  const [loanDuration, setLoanDuration] = useState("30");
  const [downPaymentPercent, setDownPaymentPercent] = useState(10);
  const [downPaymentAmount, setDownPaymentAmount] = useState(
    (housePrice * downPaymentPercent) / 100
  );
  const [rateStructure, setRateStructure] = useState("FIXED");
  const [value, setValue] = useState([700, 719]);

  useEffect(() => {
    const fetchData = async () => {
      const loanAmount = housePrice - downPaymentAmount;
      const minfico = value[0];
      const maxfico = value[1];

      try {
        const response = await axios.get("/oah-api/rates/rate-checker", {
          params: {
            price: housePrice,
            loan_amount: loanAmount,
            minfico: minfico,
            maxfico: maxfico,
            state: state,
            rate_structure: rateStructure.toLowerCase(),
            loan_term: loanDuration,
            loan_type: loanType.toLowerCase(),
            arm_type: "5-1",
          },
        });
        setInterestRateDataJson(response["data"]["data"]);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [
    state,
    loanType,
    housePrice,
    loanDuration,
    downPaymentAmount,
    rateStructure,
    value,
  ]);

  const handleSliderChange = (event, newValue) => {
    let newStartValue = 0,
      newEndValue = 0;
    if (newValue[0] != value[0]) {
      newStartValue = newValue[0];
      newEndValue = newStartValue + 19;
    } else {
      newEndValue = newValue[1];
      newStartValue = newEndValue - 19;
    }
    if (newEndValue <= 850) {
      setValue([newStartValue, newEndValue]);
    }
    console.log(value);
  };

  const handleStateChange = (event) => {
    setState(event.target.value);
  };

  const handleLoanTypeChange = (event) => {
    setLoanType(event.target.value);
  };

  const handleHousePriceChange = (event) => {
    setHousePrice(event.target.value);
  };

  const handleLoanDurationChange = (event) => {
    setLoanDuration(event.target.value);
  };

  const handleDownPaymentPercentChange = (event) => {
    const percent = event.target.value;
    if (percent < 0 || percent > 100) {
      alert("Percent must be between 0 and 100.");
      return;
    }
    const calculatedDownPayment = (percent / 100) * housePrice;
    setDownPaymentPercent(percent);
    setDownPaymentAmount(calculatedDownPayment.toFixed(2));
  };

  const handleDownPaymentChange = (event) => {
    const amount = event.target.value;
    if (amount < 0) {
      alert("Down payment cannot be negative.");
      return;
    }

    if (amount > housePrice) {
      alert("Down payment cannot be more than the price of the house.");
      return;
    }
    const calculatedPercent = (amount / housePrice) * 100;
    setDownPaymentAmount(amount);
    setDownPaymentPercent(calculatedPercent.toFixed(2));
  };

  const handleRateStructureChange = (event) => {
    setRateStructure(event.target.value);
  };



  return (
    <div>
      <div className="input-container">
        <Box>
          <FormControl fullWidth>
            <InputLabel id="select-state-label">State</InputLabel>
            <Select
              labelId="select-state-label"
              id="select-state-id"
              value={state}
              label="State"
              onChange={handleStateChange}
            >
              {states.map((state) => (
                <MenuItem key={state.abbreviation} value={state.abbreviation}>
                  {state.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </div>
      <div className="input-container">
        <TextField
          fullWidth
          id="house-price"
          label="$ House Price"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          value={housePrice}
          onChange={handleHousePriceChange}
        />
      </div>
      <div className="input-container down-payment-container">
        <div className="input-item-70">
          <TextField
            fullWidth
            id="down-payment-amount"
            label="$ Down Payment"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            value={downPaymentAmount}
            onChange={handleDownPaymentChange}
          />
        </div>
        <div className="input-item-30">
          <TextField
            fullWidth
            id="down-payment-percent"
            label="% Percent"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            value={downPaymentPercent}
            onChange={handleDownPaymentPercentChange}
          />
        </div>
      </div>

      <div className="input-container">
        <LabelTypography>Loan Type</LabelTypography>
        <ToggleButtonGroup
          fullWidth
          color="primary"
          value={loanType}
          exclusive
          onChange={handleLoanTypeChange}
          aria-label="Platform"
        >
          <ToggleButton value="CONF">Conventional</ToggleButton>
          <ToggleButton value="FHA">FHA</ToggleButton>
          <ToggleButton value="VA">VA</ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div className="input-container">
        <LabelTypography>Loan Term</LabelTypography>
        <ToggleButtonGroup
          fullWidth
          color="primary"
          value={loanDuration}
          exclusive
          onChange={handleLoanDurationChange}
          aria-label="Platform"
        >
          <ToggleButton value="15">15</ToggleButton>
          <ToggleButton value="30">30</ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div className="input-container">
        <LabelTypography>Rate Type</LabelTypography>
        <ToggleButtonGroup
          fullWidth
          color="primary"
          value={rateStructure}
          exclusive
          onChange={handleRateStructureChange}
          aria-label="Platform"
        >
          <ToggleButton value="FIXED">Fixed</ToggleButton>
          <ToggleButton value="ARM">Adjustable</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className="input-container">
        <Box fullWidth>
          <LabelTypography>Credit Score Range</LabelTypography>
          <Slider
            sx={{
              "& .MuiSlider-thumb": {
                backgroundColor: "#27ca9d",
              },
              "& .MuiSlider-track": {
                backgroundColor: "#27ca9d",
              },
              "& .MuiSlider-rail": {
                backgroundColor: "#c6c7ca",
              },
            }}
            value={value}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            min={600}
            max={850}
            step={1}
            marks={[
              { value: 600, label: "600" },
              { value: 650, label: "650" },
              { value: 700, label: "700" },
              { value: 750, label: "750" },
              { value: 800, label: "800" },
              { value: 850, label: "850" },
            ]}
            disableSwap
          />
        </Box>
      </div>
    </div>
  );
};

export default ParameterInputs;
