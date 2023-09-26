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

const AddParty = ({ setRefresh , onHide  , show_modal}) => {
  const [party, setParty] = useState("");
  const [formLoader, setFormLoader] = useState(false);
  const [notFilled, setNotFilled] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate()


  //   creating wage table
  const sendFormData = async () => {
    if (!party) {
      setNotFilled(true);
      return toast.error("fill all the fields correctly!");
    }

    setFormLoader(true);

    try {
      let data = {
        Name: party,
      };

      let res = await axios.post(`${api}CreatePartyName`, data  , {
        headers: {
          Authorization: token,
          // Other headers as needed
        },});

      toast.success(res.statusText);

      setParty('');
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
                    Add Party
                  </Typography>
                </Box>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <TextField
              label='Party Name'
                error={notFilled && !party ? true : false}
                helperText={notFilled && !party ? "required *" : null}
                value={party}
                onChange={(e) => setParty(e.target.value)}
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
              Add
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default AddParty;
