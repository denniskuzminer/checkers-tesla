// https://material-ui.com/components/data-grid/columns/
import "./App.css";
import { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import withStyles from "@material-ui/core/styles/withStyles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import AddIcon from "@material-ui/icons/Add";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Button, Grid, TextField, Divider } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import SaveIcon from "@material-ui/icons/Save";
import FormLabel from "@material-ui/core/FormLabel";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";
import logo from "./harristree.png";
import watermark from "./harris.png";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const secAdjcolumns = [
  {
    field: "delete",
    headerName: "Delete",
    sortable: false,
    width: 25,
    headerAlign: "center",
    align: "center",
    disableClickEventBubbling: true,
    renderCell: () => {
      return <DeleteIcon />;
    },
  },
  {
    field: "basePosition",
    headerName: "Base Position",
    width: 180,
    headerAlign: "center",
    align: "center",
    flex: 0.2,
    editable: true,
  },
  {
    field: "modelPosition",
    headerName: "Model Position",
    width: 180,
    align: "center",
    headerAlign: "center",
    flex: 0.2,
    editable: true,
  },
  {
    field: "exclFromMV",
    headerName: "Exclude From Market Value",
    type: "boolean",
    width: 280,
    align: "center",
    headerAlign: "center",
    flex: 0.2,
    editable: true,
  },
  {
    field: "shareAdj",
    headerName: "Share Adjustment",
    type: "number",
    width: 220,
    align: "center",
    flex: 0.2,
    headerAlign: "center",
    editable: true,
  },
  {
    field: "comment",
    headerName: "Comment",
    width: 220,
    headerAlign: "center",
    align: "center",
    flex: 0.2,
    editable: true,
  },
];

const secAdjRows = [
  {
    id: 1,
    basePosition: "CBRE",
    modelPosition: null,
    exclFromMV: true,
    shareAdj: null,
    comment: null,
  },
  {
    id: 2,
    basePosition: "ALLY",
    modelPosition: "ADP",
    exclFromMV: false,
    shareAdj: null,
    comment: null,
  },
  {
    id: 3,
    basePosition: "C",
    modelPosition: null,
    exclFromMV: false,
    shareAdj: -400000,
    comment: "This is a comment",
  },
];

const secRollColumns = [
  {
    field: "delete",
    headerName: "Delete",
    sortable: false,
    align: "center",
    headerAlign: "center",
    width: 25,
    disableClickEventBubbling: true,
    renderCell: () => {
      return <DeleteIcon />;
    },
  },
  {
    field: "rollPosition",
    headerName: "Roll Position",
    align: "center",
    headerAlign: "center",
    width: 180,
    flex: 0.5,
    editable: true,
  },
  {
    field: "intoPosition",
    align: "center",
    headerName: "Into Position",
    width: 180,
    flex: 0.5,
    headerAlign: "center",
    editable: true,
  },
];

const secRollRows = [
  {
    id: 1,
    rollPosition: "MO",
    intoPosition: "STZ",
  },
  {
    id: 2,
    rollPosition: "AAPL",
    intoPosition: "AMD",
  },
  {
    id: 3,
    rollPosition: "GOOGL",
    intoPosition: "GOOG",
  },
];

const fundColumns = [
  {
    field: "ticker",
    headerName: "Ticker",
    align: "center",
    headerAlign: "center",
    flex: 0.2,
    editable: false,
  },
  {
    field: "securityName",
    headerName: "Security Name",
    align: "center",
    headerAlign: "center",
    flex: 0.2,
    editable: false,
  },
  {
    field: "CUSIP",
    headerName: "CUSIP",
    align: "center",
    headerAlign: "center",
    flex: 0.2,
    editable: false,
  },
  {
    field: "actualPercentOfTNA",
    headerName: "Actual Percent Of TNA",
    align: "center",
    headerAlign: "center",
    valueFormatter: (params) => {
      const valueFormatted = Number(params.value).toLocaleString();
      return `${valueFormatted} %`;
    },

    flex: 0.2,
    editable: false,
  },
  {
    field: "anticipatedPercentOfTNA",
    headerName: "Anticipated Percent Of TNA",
    align: "center",
    valueFormatter: (params) => {
      const valueFormatted = Number(params.value).toLocaleString();
      return `${valueFormatted} %`;
    },

    headerAlign: "center",
    flex: 0.2,
    editable: false,
  },
];

const calculationColumns = [
  {
    field: "ticker",
    headerName: "Ticker",
    align: "center",
    headerAlign: "center",
    flex: 0.5,
    editable: false,
  },

  {
    field: "anticipatedPercentOfTNA",
    headerName: "Weight",
    align: "center",
    headerAlign: "center",
    valueFormatter: (params) => {
      const valueFormatted = Number(params.value).toLocaleString();
      return `${valueFormatted} %`;
    },

    flex: 0.5,
    editable: false,
  },
];

const fundRows = [
  {
    id: 1,
    ticker: "ADP",
    securityName: "Automatic Data Processing",
    CUSIP: "123456789",
    actualPercentOfTNA: "1.40",
    anticipatedPercentOfTNA: "1.40",
  },
  {
    id: 2,
    ticker: "AIG",
    securityName: "American Intl Group",
    CUSIP: "123456789",
    actualPercentOfTNA: "2.22",
    anticipatedPercentOfTNA: "2.22",
  },
  {
    id: 3,
    ticker: "ALLY",
    securityName: "Ally Financial",
    CUSIP: "123456789",
    actualPercentOfTNA: "3.94",
    anticipatedPercentOfTNA: "3.94",
  },
  {
    id: 4,
    ticker: "APA",
    securityName: "APA Corp",
    CUSIP: "123456789",
    actualPercentOfTNA: "1.48",
    anticipatedPercentOfTNA: "1.48",
  },
  {
    id: 5,
    ticker: "AXP",
    securityName: "American Express",
    CUSIP: "123456789",
    actualPercentOfTNA: "1.92",
    anticipatedPercentOfTNA: "1.92",
  },
  {
    id: 6,
    ticker: "BAC",
    securityName: "Bank of America",
    CUSIP: "123456789",
    actualPercentOfTNA: "2.96",
    anticipatedPercentOfTNA: "2.96",
  },
  {
    id: 7,
    ticker: "BK",
    securityName: "Bank of New York Mellon",
    CUSIP: "123456789",
    actualPercentOfTNA: "1.49",
    anticipatedPercentOfTNA: "1.49",
  },
  {
    id: 8,
    ticker: "BKNG",
    securityName: "Booking Holdings",
    CUSIP: "123456789",
    actualPercentOfTNA: "2.01",
    anticipatedPercentOfTNA: "2.01",
  },
  {
    id: 9,
    ticker: "C",
    securityName: "Citigroup",
    CUSIP: "123456789",
    actualPercentOfTNA: "2.91",
    anticipatedPercentOfTNA: "2.91",
  },
  {
    id: 10,
    ticker: "CBRE",
    securityName: "CBRE Group CI A",
    CUSIP: "123456789",
    actualPercentOfTNA: "1.09",
    anticipatedPercentOfTNA: "1.09",
  },
];

const styles = (theme) => ({
  root: {
    display: "flex",
    borderRadius: "8px",
  },
  heading: {
    fontWeight: "bolder",
    fontSize: "19px",
    fontFamily: "Work Sans, sans-serif",
  },
  caption: {
    fontWeight: "100px",
    fontSize: "14px",
    fontFamily: "Work Sans, sans-serif",
  },
  label: {
    fontWeight: "500",
    textAlign: "left",
    marginLeft: "15px",
    fontFamily: "Work Sans, sans-serif",
  },
  title: {
    fontWeight: "900",
    fontSize: "24px",
    fontFamily: "Work Sans, sans-serif",
  },
});

const App = (props) => {
  const [showModel, setShowModel] = useState(false);
  const [basePortfolio, setBasePortfolio] = useState(114);
  const [targetCash, setTargetCash] = useState(3.0);
  const { classes } = props;

  const onGenerateModelClick = () => {
    setShowModel(!showModel);
  };

  useEffect(() => {
    setShowModel(false);
    setBasePortfolio(114);
    setTargetCash(3.0);
  }, []);

  return (
    <div className="App">
      <header>
        <div class="container">
          <h1 class="logo"></h1>
          <nav>
            <table style={{ marginTop: "-15px" }}>
              <tr>
                <td>
                  <img
                    alt="Oakmark Tree"
                    style={{
                      width: "40px",
                      paddingLeft: "640px",
                      marginRight: "20px",
                      paddingTop: "30px",
                    }}
                    src={logo}
                  />
                </td>
                <td>
                  <ul>
                    <li style={{ marginLeft: "-13px" }}>
                      <a href="#">Home</a>
                    </li>
                    <li>
                      <a href="#">Admin</a>
                    </li>
                    <li>
                      <a href="#">Triggers</a>
                    </li>
                    <li>
                      <a href="#">Cash Monitoring</a>
                    </li>
                    <li>
                      <div className="dropdown">
                        <a href="#">Calculators</a>
                        <div className="dropdown-content">
                          <a className="noTransition">See</a>
                          <a className="noTransition">How</a>
                          <a className="noTransition">Nice</a>
                          <a className="noTransition">In</a>
                          <a className="noTransition">React</a>
                        </div>
                      </div>
                    </li>

                    <li>
                      <a href="#">Portfolio Management</a>
                    </li>
                  </ul>
                </td>
              </tr>
            </table>
          </nav>
        </div>
      </header>

      <div id="root" style={{ margin: "30px" }}>
        <table>
          <tr>
            <Typography className={classes.title}>Portfolio Model</Typography>
          </tr>
          <tr>
            <td>
              <Typography className={classes.label}>Model: </Typography>
            </td>
            <td>
              <FormControl style={{ marginLeft: "-95px" }}>
                <Select style={{ width: "230px" }}>
                  <MenuItem value={0}>Hanson Small Cap Advisory</MenuItem>
                  <MenuItem value={1}>Fidelity Strategic Advisors</MenuItem>
                </Select>
              </FormControl>
            </td>
            <td>
              <Button
                style={{ marginLeft: "25px" }}
                variant="outlined"
                startIcon={<AddIcon />}
              >
                New Model
              </Button>
            </td>
          </tr>
          <br />
          <tr>
            <td>
              <Typography className={classes.label}>Base PF:</Typography>
            </td>
            <td>
              <TextField
                style={{ marginLeft: "-100px" }}
                size="small"
                variant="outlined"
                value={basePortfolio}
                label="Base Portfolio"
              />
            </td>
            <td>
              <Typography className={classes.label}>Target Cash %:</Typography>
            </td>
            <td>
              <TextField
                style={{ marginLeft: "-35px" }}
                size="small"
                variant="outlined"
                label="Target Cash"
                value={targetCash}
              />
            </td>
            <td>
              <Button
                style={{ marginLeft: "20px" }}
                variant="outlined"
                startIcon={<SaveIcon />}
              >
                Save Changes
              </Button>
            </td>
          </tr>
        </table>
        <div style={{ paddingTop: "30px", width: "1050px" }}>
          <Accordion style={{ backgroundColor: "transparent" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              Adjustments
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
              <table style={{ width: "1050px" }}>
                <tr>
                  <div style={{ textAlign: "left" }}>
                    <Typography className={classes.heading}>
                      Security Adjustments
                    </Typography>
                    <Typography className={classes.caption}>
                      (For replacing one security with another; or treat as cash
                      for equal distribution across other securities; or for
                      adjusting shares associated to account for option
                      adjustments)
                    </Typography>

                    <DataGrid
                      components={{
                        Toolbar: GridToolbar,
                      }}
                      hideFooter
                      density="compact"
                      autoHeight
                      rows={secAdjRows}
                      columns={secAdjcolumns}
                    />
                  </div>
                </tr>
                <tr>
                  <div style={{ paddingTop: "10px", textAlign: "left" }}>
                    <Typography className={classes.heading}>
                      Security Roll-ups
                    </Typography>
                    <Typography className={classes.caption}>
                      (For merging 2 positions into 1)
                    </Typography>

                    <DataGrid
                      components={{
                        Toolbar: GridToolbar,
                      }}
                      density="compact"
                      hideFooter
                      autoHeight
                      rows={secRollRows}
                      columns={secRollColumns}
                    />
                  </div>
                </tr>
              </table>
            </AccordionDetails>
          </Accordion>
        </div>
        <br />
        <div>
          <Button variant="outlined" onClick={onGenerateModelClick}>
            Generate Model
          </Button>
        </div>
        <br />
        <div style={{ display: "flex" }}>
          <Typography style={{ flex: 0.5 }} className={classes.heading}>
            Fund - 0114
          </Typography>
          <Typography
            style={
              showModel
                ? { display: "block", marginLeft: "-60px", flex: 0.5 }
                : { display: "none" }
            }
            className={classes.heading}
          >
            Generated Model
          </Typography>
        </div>
        <table>
          <tr>
            <td style={{ width: "850px" }}>
              <div style={{ width: "100%" }}>
                <DataGrid
                  density="compact"
                  autoHeight
                  disableColumnMenu={true}
                  rows={fundRows}
                  columns={fundColumns}
                />
              </div>
            </td>
            <td style={{ width: "450px" }}>
              <div
                style={
                  showModel
                    ? { display: "block", marginLeft: "100px", width: "100%" }
                    : { display: "none" }
                }
              >
                <DataGrid
                  components={{
                    Toolbar: GridToolbar,
                  }}
                  density="compact"
                  autoHeight
                  disableColumnMenu={true}
                  rows={fundRows}
                  columns={calculationColumns}
                />
              </div>
            </td>
          </tr>
        </table>
        <div>
          <img
            alt="harrislogo"
            src={watermark}
            style={{
              zIndex: 999,
              opacity: 0.1,
              width: "500px",
              filter: "grayscale(100%)",
              position: "absolute",
              right: "0px",
              bottom: "0px",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles)(App);
