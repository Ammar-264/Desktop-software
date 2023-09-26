// ** React Imports
import { Fragment, useEffect, useState } from "react";

// ** MUI Imports
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { DialogTitle, IconButton, Grid, TextField , Box , Typography ,Autocomplete , Button } from "@mui/material";

import { api } from "../../utils/api";
import { BtnLoader, Loader } from "../../Components/loader/loader";
import toast from "react-hot-toast";
import { Close } from "mdi-material-ui";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const AddLedgerParty = ({ setRefresh , onHide  , show_modal , refresh}) => {
  const [party, setParty] = useState(null);
  const [formLoader, setFormLoader] = useState(false);
  const [notFilled, setNotFilled] = useState(false);
  const [loader, setLoader] = useState(false);
  const [partyNameList , setPartyNameList] = useState([])
  const navigate = useNavigate()
  const token = localStorage.getItem('token');


   //   fetching party names
   useEffect(() => {
    setLoader(true);

    axios
      .get(`${api}GetPartyNameListing`, {
        headers: {
          Authorization: token,
          // Other headers as needed
        },
      } )
      .then((res) => {
        const filteredParties = res.data.data.map((item) => ({
          id: item._id,
          name: item.Name,
        }));

        setPartyNameList(filteredParties);
        setLoader(false);
      })
      .catch((err) =>{
        if(err.response.status === 401){
          toast.error('Login first')
          return navigate('/login')
      }
      });
  }, [refresh]);

  //   creating wage table
  const sendFormData = async () => {
    if (!party) {
      setNotFilled(true);
      return toast.error("fill all the fields correctly!");
    }

    setFormLoader(true);

    try {
      let data = {
        PartyId: party.id,
      };

      let res = await axios.post(`${api}CreateLedger`, data, {
        headers: {
          Authorization: token,
          // Other headers as needed
        },
      } );

      toast.success(res.statusText);

      setParty(null);
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
       {loader ? <Loader/> : <>
        <DialogContent>
        <Box sx={{ mb: 1, textAlign: "center" }}>
                  <Typography variant="h4" sx={{ mb: 3 }}>
                    Create Party Ledger
                  </Typography>
                </Box>
          <Grid container spacing={6}>
            <Grid item xs={12}>
            <Autocomplete
        id="free-solo-demo"
        options={partyNameList}
        getOptionLabel={(option) => option.name}
        value={party}
        onChange={(event, newValue) => setParty(newValue)}
        renderInput={(params) => (
          <div>
            <TextField
              error={notFilled && !party ? true : false}
              helperText={notFilled && !party ? 'required *' : null}
              {...params}
              label="Party Name"
            />
            
          </div>
        )}
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
        </>}
      </Dialog>
    </Fragment>
  );
};

export default AddLedgerParty;
