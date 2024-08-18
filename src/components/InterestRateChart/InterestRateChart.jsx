import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
  LabelList,
} from "recharts";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import MenuItem from "@mui/material/MenuItem";
import { Menu } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import "./InterestRateChart.css"
import { DownloadTypography } from "../../elements/DownloadTypography";



const InterestRateChart = ({ interestRateDataJson }) => {
  const [openDownloadDialog, setOpenDownloadDialog] = useState(null);
  const handleClick = (event) => {
    setOpenDownloadDialog(event.currentTarget);
  };

  const handleClose = () => {
    setOpenDownloadDialog(null);
  };

  const handleDownload = (format) => {
    downloadChart(format);
    handleClose();
  };

  const downloadChart = (format) => {
    const chartElement = document.getElementById("chart"); 

    html2canvas(chartElement).then((canvas) => {
      canvas.toBlob((blob) => {
        saveAs(blob, `chart.${format}`);
      }, `image/${format}`);
    });
  };




  const interestRateData = Object.keys(interestRateDataJson)
    .map((rate) => ({
      rate: rate,
      lenders: Math.min(interestRateDataJson[rate], 10),
    }))
    .sort((a, b) => a.rate - b.rate);

  return (
    <div className="chart-root-container">
      <div>
        <DownloadTypography variant="h6" onClick={handleClick}>
          Download Chart
          <FileDownloadIcon />
        </DownloadTypography>
        <Menu
          anchorEl={openDownloadDialog}
          open={Boolean(openDownloadDialog)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleDownload("png")}>
            Download as PNG
          </MenuItem>
          <MenuItem onClick={() => handleDownload("jpeg")}>
            Download as JPEG
          </MenuItem>
          <MenuItem onClick={() => handleDownload("svg")}>
            Download as SVG
          </MenuItem>
        </Menu>
      </div>
      <ResponsiveContainer id="chart" width="100%" height="90%">
        <BarChart
          width={500}
          height={300}
          data={interestRateData}
          margin={{
            top: 30,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barSize={20}
        >
          <XAxis
            dataKey="rate"
            scale="point"
            padding={{ left: 10, right: 10 }}
            tick={{ angle: -45, textAnchor: "end" }}
          ></XAxis>
          <YAxis
            ticks={[2, 4, 6, 8, 10]}
            domain={[0, "dataMax"]}
            tickFormatter={(tick) => {
              return tick >= 10 ? "10+" : tick;
            }}
            axisLine={false}
            tick={{ stroke: "none" }}
          >
            <Label
              value="Number of Lenders"
              angle={-90}
              offset={100}
              position="insideCenter"
            />
          </YAxis>
          <Tooltip />

          <CartesianGrid strokeDasharray="2 2" vertical={false} />
          <Bar dataKey="lenders" fill="#ADDB90"></Bar>
          <Legend />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InterestRateChart;
