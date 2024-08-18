import { styled } from "@mui/material/styles";
import MuiToggleButton from "@mui/material/ToggleButton";

export const ToggleButton = styled(MuiToggleButton)({
  height: "40px",
  "&.Mui-selected, &.Mui-selected:hover": {
    color: "black",
    backgroundColor: "#27ca9d",
  },
});
