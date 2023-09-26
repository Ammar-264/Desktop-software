// ** React Imports
import {useState } from "react";
// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { BtnLoader } from "../../Components/loader/loader";
import axios from "axios";
import { api } from "../../utils/api";
import toast from "react-hot-toast";
import IconButton from '@mui/material/IconButton'
import Close from 'mdi-material-ui/Close'
import DialogTitle from '@mui/material/DialogTitle'
import Button from "@mui/material/Button";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useNavigate } from "react-router-dom";

// creating challann
const AddWage = ({show_modal ,onHide ,setRefresh , wageTableId}) => {
  // ** States
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const [type , setType] = useState('')
  const [formLoader, setFormLoader] = useState(false);
  const [notFilled, setNotFilled] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate()

  //   creating challan
  const sendFormData = async () => {
    
    if (!description ||!amount || amount <1 || !type) {
      setNotFilled(true);
      return toast.error("fill all the fields correctly!");
    }

    setFormLoader(true);

    try {
      let data = {
        Amount: amount,
        Description: description,
        Type:type
      };

      let res = await axios.post(`${api}CreateDailyWagesLogs/${wageTableId}`, data  , {
        headers: {
          Authorization: token,
          // Other headers as needed
        },});

      toast.success(res.statusText);

      // making fields empty
      setDescription('');
      setAmount(0);
      setType('')
      setNotFilled(false)
      setRefresh(true)
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
    <Dialog
      fullWidth
      open={show_modal}
      maxWidth="md"
      scroll="body"
      // TransitionComponent={Transition}
    >
       <DialogTitle  id='customized-dialog-title' sx={{ p: 4 }}>
          
          <IconButton
            aria-label='close'
            onClick={()=>onHide(false)}
            sx={{ top: 10, right: 10, position: 'absolute', color: theme => theme.palette.grey[500] }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
          
            <>
              <DialogContent sx={{ pb: 2, px: 4, pt: 3, position: "relative" }}>
                <Box sx={{ mb: 1, textAlign: "center" }}>
                  <Typography variant="h4" sx={{ mb: 3 }}>
                    Add New Wage
                  </Typography>
                </Box>

                <Grid container spacing={6}>
                  <Grid item sm={6} xs={12}>
                  <TextField
                      error={notFilled && !description ? true : false}
                      helperText={
                        notFilled && !description ? "required *" : null
                      }
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      fullWidth
                      label="Description"
                    />
                  </Grid>

                  <Grid item sm={6} xs={12}>
                    <TextField
                      error={notFilled && (!amount || amount < 1) ? true : false}
                      helperText={notFilled && (!amount || amount < 1) ? "required *" : null}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      fullWidth
                      label='Amount'
                    />
                  </Grid>

                  <Grid item xs={12}>
                  <FormControl   error={notFilled && !type ? true : false} fullWidth>
      <FormLabel id="demo-radio-buttons-group-label">Select Amount Type (Credit or Debit) *</FormLabel>
      <RadioGroup
      row
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="female"
        name="radio-buttons-group"
        value={type}
        onChange={(e)=>setType(e.target.value)}
      >
        <FormControlLabel value="Credit" control={<Radio />} label="Credit" />
        <FormControlLabel value="Debit" control={<Radio />} label="Debit" />
      </RadioGroup>
    </FormControl>
                  </Grid>
                  
                </Grid>
              </DialogContent>
              <DialogActions sx={{ px: 4, pb: 2, justifyContent: "center" }}>
                {formLoader ? (
                  <BtnLoader />
                ) : (
                  <Button
                  variant='contained'
                  fullWidth
                    disabled={
                      notFilled &&
                      (!description ||!amount || amount < 1 || !type)
                        ? true
                        : false
                    }
                    onClick={sendFormData}
                    className="form_btn"
                  >
                    Next
                  </Button>
                )}
              </DialogActions>
            </>
     
    </Dialog>
  );
};


export default AddWage;
