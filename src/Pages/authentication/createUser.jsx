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
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';


const CreateUser = ({ setRefresh , onHide  , show_modal}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pass, setPass] = useState("");
  const [passShow , setPassShow] = useState(false)
  const [confirmPassShow , setConfirmPassShow] = useState(false)
  const [confirmPass, setconfirmPass] = useState("");
  const [formLoader, setFormLoader] = useState(false);
  const [notFilled, setNotFilled] = useState(false);
  const token = localStorage.getItem('token');
    const navigate = useNavigate()


  //   creating wage table
  const sendFormData = async () => {
    if (!firstName || !lastName || !pass || !confirmPass) {
      setNotFilled(true);
      return toast.error("fill all the fields correctly!");
    }
    if (pass != confirmPass) {
        setNotFilled(true);
      return toast.error("Passwords Do Not Matched");
    }

    setFormLoader(true);

    try {
      let data = {
        FirstName: firstName,
        LastName: lastName,
        password:pass
      };

      let res = await axios.post(`${api}CreateUser`, data  , {
        headers: {
          Authorization: token,
          // Other headers as needed
        },});

      toast.success(res.statusText);

      setFirstName('');
      setLastName('');
      setPass('');
      setconfirmPass('');
      
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
                    Create User
                  </Typography>
                </Box>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                error={notFilled && !firstName ? true : false}
                helperText={notFilled && !firstName ? "required *" : null}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                label='First Name'
                fullWidth
                />
            </Grid>
            <Grid item xs={6}>
              <TextField
                error={notFilled && !lastName ? true : false}
                helperText={notFilled && !lastName ? "required *" : null}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                label='Last Name'
                fullWidth
                />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={notFilled && !pass ? true : false}
                helperText={notFilled && !pass ? "required *" : null}
                value={pass}
                type={passShow ? 'text' : 'password'}
                onChange={(e) => setPass(e.target.value)}
                label='Password'
                fullWidth
                InputProps={{
                    endAdornment: (
                      <IconButton onClick={()=>setPassShow(passShow ? false : true)}>
                       {passShow ? <VisibilityOffIcon/> :  <VisibilityIcon />}
                      </IconButton>
                    ),
                  }}
                />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={notFilled && !confirmPass ? true : false}
                helperText={notFilled && !confirmPass ? "required *" : null}
                type={confirmPassShow ? 'text' : 'password'}
                value={confirmPass}
                onChange={(e) => setconfirmPass(e.target.value)}
                label='Confirm Password'
                fullWidth
                InputProps={{
                    endAdornment: (
                      <IconButton onClick={()=>setConfirmPassShow(confirmPassShow ? false : true)}>
                       {confirmPassShow ? <VisibilityOffIcon/> :  <VisibilityIcon />}
                      </IconButton>
                    ),
                  }}
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

export default CreateUser;
