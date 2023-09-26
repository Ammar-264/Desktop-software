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
import { useNavigate } from 'react-router-dom';


// creating challann
const AddLedgerLog = ({show_modal ,onHide ,setRefresh , ldegerId}) => {
  // ** States
  const [description, setDescription] = useState('');
  const [credit, setCredit] = useState(0);
  const [debit, setDebit] = useState(0);
  const [billNo, setBillNo] = useState();
  const [date , setDate] = useState('')
  const [formLoader, setFormLoader] = useState(false);
  const [notFilled, setNotFilled] = useState(false);
  const navigate = useNavigate()
  const token = localStorage.getItem('token');

  //   creating challan
  const sendFormData = async () => {
    
    if (!description || !date || billNo < 0 || credit < 0 || debit < 0) {
      setNotFilled(true);
      return toast.error("fill all the fields correctly!");
    }

    setFormLoader(true);

    try {
      let data = {
        Date: date,
        Description: description,
        Credit:credit,
        Debit:debit,
        BillNo:!billNo || billNo == 0 ? '' : billNo  ,
      };

      let res = await axios.post(`${api}CreateLedgerLogs/${ldegerId}`, data, {
        headers: {
          Authorization: token,
          // Other headers as needed
        },
      } );

      toast.success(res.statusText);

      // making fields empty
      setDescription('');
      setDate('');
      setCredit(0);
      setDebit(0);
      setBillNo(0)
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
                    Add New Ledger
                  </Typography>
                </Box>

                <Grid container spacing={6}>
                  <Grid item sm={6} xs={12}>
                  <TextField
                      error={notFilled && billNo < 0 ? true : false}
                      helperText={
                        notFilled && billNo < 0 ? "cannot be negative *" : null
                      }
                      value={billNo}
                      onChange={(e) => setBillNo(e.target.value)}
                      fullWidth
                      label="Bill No"
                    />
                  </Grid>

                  <Grid item sm={6} xs={12}>
                    <TextField
                      error={notFilled && !date ? true : false}
                      helperText={notFilled && !date  ? "required *" : null}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      fullWidth
                      type="date"
                      
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                  <TextField
                      error={notFilled &&  credit < 0 ? true : false}
                      helperText={
                        notFilled && credit < 0 ? "cannot be less than zero *" : null
                      }
                      value={credit}
                      onChange={(e) => setCredit(e.target.value)}
                      fullWidth
                      label="Credit"
                      type="number"
                    />
                  </Grid>

                  <Grid item sm={6} xs={12}>
                    <TextField
                      error={notFilled && debit < 0 ? true : false}
                      helperText={notFilled && debit < 0 ?  "cannot be less than zero *" : null}
                      value={debit}
                      onChange={(e) => setDebit(e.target.value)}
                      fullWidth
                      label='Debit'
                      type="number"
                    />
                  </Grid>

                  <Grid item xs={12}>
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
                      (!description ||!date || credit < 0 || debit < 0 || billNo < 0)
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


export default AddLedgerLog;
