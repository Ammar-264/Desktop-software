// ** React Imports
import { Fragment, useState } from "react";

// ** MUI Imports
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { DialogTitle, IconButton, Grid, TextField , Box , Typography } from "@mui/material";
import { api } from "../../utils/api";
import { BtnLoader } from "../../Components/loader/loader";
import toast from "react-hot-toast";
import { Close } from "mdi-material-ui";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateWageTable = ({ setRefresh , onHide  , show_modal}) => {
  const [date, setDate] = useState("");
  const [formLoader, setFormLoader] = useState(false);
  const [notFilled, setNotFilled] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate()


  //   creating wage table
  const sendFormData = async () => {
    if (!date) {
      setNotFilled(true);
      return toast.error("fill all the fields correctly!");
    }

    setFormLoader(true);

    try {
      let data = {
        Date: date,
      };

      let res = await axios.post(`${api}CreateDailyWages`, data  , {
        headers: {
          Authorization: token,
          // Other headers as needed
        },});

      toast.success(res.statusText);

      setDate(null);
      setNotFilled(false);
      setRefresh(true)
      onHide(false)
    } catch (err) {

      if(err.response.status === 401){
        toast.error('Login first')
        return navigate('/login')
    }
      toast.error(err.response.data.message);
    }

    setFormLoader(false);
  };

  return (
    <Fragment>
      <Dialog
        open={show_modal}
        disableEscapeKeyDown
        fullWidth
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="customized-dialog-title" sx={{ p: 4 }}>
          <IconButton
            aria-label="close"
            onClick={()=>onHide(false)}
            sx={{
              top: 10,
              right: 10,
              position: "absolute",
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
        <Box sx={{ mb: 1, textAlign: "center" }}>
                  <Typography variant="h4" sx={{ mb: 3 }}>
                    Create Wage Table
                  </Typography>
                </Box>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <TextField
                type="date"
                error={notFilled && !date ? true : false}
                helperText={notFilled && !date ? "required *" : null}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{ px: 3 , pb:4 }}
          style={{ display: "flex", justifyContent: "center" }}
          className="dialog-actions-dense"
        >
          {formLoader ? (
            <BtnLoader />
          ) : (
            <Button onClick={sendFormData} fullWidth variant="contained">
              Create
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default CreateWageTable;
