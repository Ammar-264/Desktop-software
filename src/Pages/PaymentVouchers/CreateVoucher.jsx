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
import { BiEditAlt } from "react-icons/bi";
import { BtnLoader } from "../../Components/loader/loader";
import { Autocomplete , Button} from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import { api } from "../../utils/api";
import toast from "react-hot-toast";
import IconButton from '@mui/material/IconButton'
import Close from 'mdi-material-ui/Close'
import DialogTitle from '@mui/material/DialogTitle'
import { BanksList } from "../../utils/data";
import { useNavigate } from "react-router-dom";


// creating challann
const CreateVoucher = ({show_modal ,onHide ,setRefresh}) => {
  // ** States
  const [step, setStep] = useState(1);
  const [payTo, setPayTo] = useState('');
  const [date, setDate] = useState("");
  const [formLoader, setFormLoader] = useState(false);
  const [voucherId, setVoucherId] = useState("");
  const [notFilled, setNotFilled] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate()

  //   creating challan
  const sendFormData = async () => {
    
    if (!payTo ||!date ) {
      setNotFilled(true);
      return toast.error("fill all the fields correctly!");
    }

    setFormLoader(true);

    try {
      let data = {
        PayTo: payTo,
        PaymentDate: date,
      };

      let res = await axios.post(`${api}CreateVoucher`, data, {
        headers: {
          Authorization: token,
          // Other headers as needed
        },});

      toast.success(res.statusText);

      setVoucherId(res.data.data._id);
      // making fields empty
      setPayTo('');
      setDate('');
      setStep(2);
      setNotFilled(false)
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
          disabled={step == 2?true :false}
            aria-label='close'
            onClick={()=>onHide(false)}
            sx={{ top: 10, right: 10, position: 'absolute', color: theme => theme.palette.grey[500] }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
      {step == 1 ? (
       
          
            <>
              <DialogContent sx={{ pb: 2, px: 4, pt: 3, position: "relative" }}>
                <Box sx={{ mb: 1, textAlign: "center" }}>
                  <Typography variant="h4" sx={{ mb: 3 }}>
                    Create Payment Voucher
                  </Typography>
                </Box>

                <Grid container spacing={6}>
                  <Grid item sm={6} xs={12}>
                  <TextField
                      error={notFilled && !payTo ? true : false}
                      helperText={
                        notFilled && !payTo ? "required *" : null
                      }
                      value={payTo}
                      onChange={(e) => setPayTo(e.target.value)}
                      fullWidth
                      label="Pay To"
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      error={notFilled && !date ? true : false}
                      helperText={notFilled && !date ? "required *" : null}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      fullWidth
                      type="date"
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
                      (!payTo ||!date)
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
      ) : (
        <AddItems setRefresh={setRefresh} onHide={onHide} setStep={setStep}  id={voucherId} />
      )}
    </Dialog>
  );
};

// creating items in challan
const AddItems = ({ id , onHide , setStep , setRefresh}) => {
  const [items, setItems] = useState([]);
  const [amount, setAmount] = useState(0);
  const [bankName, setBankName] = useState("");
  const [chequeNo, setChequeNo] = useState("");
  const [editIndex, setEditIndex] = useState(false);
  const [edit, setEdit] = useState(false);
  const [formLoader, setFormLoader] = useState(false);
  const [notFilled, setNotFilled] = useState(false);
  const token = localStorage.getItem('token');

  // adding new item
  const addNewItem = () => {
    if (amount < 1 || !bankName|| !chequeNo) {
      setNotFilled(true);
      return toast.error("fill all the fields correctly!");
    }
    let item = {
      ChequeNumber: chequeNo,
      Amount: amount,
      BankName:bankName
    };
    console.log(item);

    setItems([...items, item]);

    setAmount(0);
    setBankName("");
    setChequeNo("");
    setNotFilled(false)
  };

  // deleting item from list
  const deleteItem = (i) => {
    items.splice(i, 1);
    setItems([...items]);
  };

  //getting edit item data ininputs
  const editItem = (e, i) => {
    setAmount(e.Amount);
    setChequeNo(e.ChequeNumber);
    setBankName(e.BankName);
    setEdit(true);
    setEditIndex(i);
  };

  // updating new data in edit item

  const updateEdit = (e) => {
    e.preventDefault();

    // updating new values for edit data
    const updatedItem = {
      Amount: Number(amount),
      ChequeNumber: chequeNo,
      BankName: bankName,
    };

    // updating new data to the item selected for edit

    items[editIndex] = updatedItem;
    setItems([...items]);

    // setting fields to empty after update
    setAmount(0);
    setChequeNo("");
    setBankName("");
    setEdit(false);
    setEditIndex("");
  };

  //   adding items in challan
  const addItemsInVoucher = async () => {
    setFormLoader(true);

    try {
      let data = {
        VoucherItem: items,
      };

      let res = await axios.post(
        `${api}CreateVoucherItem/${id}`,
        data, {
          headers: {
            Authorization: token,
            // Other headers as needed
          },}
      );
      console.log(res);
      toast.success(res.data.message);
      onHide(false)
      // making fields empty
      setItems([]);
      setStep(1)
      setRefresh(true)
    } catch (err) {
      toast.error(err.response.statusText);
      console.log(err);
    }

    setFormLoader(false);
  };

  return (
    <>
      <DialogContent sx={{ pb: 2, px: 4, pt: 3, position: "relative" }}>
        <Box sx={{ mb: 1, textAlign: "center" }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Add Payments In Voucher
          </Typography>
        </Box>
        <Grid container spacing={6}>
          <Grid item sm={5} xs={12}>
          <Autocomplete
                      id="free-solo-demo"
                      options={BanksList}
                      getOptionLabel={(option) => option}
                      value={bankName}
                      onChange={(event, newValue) => setBankName(newValue)}
                      renderInput={(params) => (
                        <TextField
                          error={notFilled && !bankName ? true : false}
                          helperText={
                            notFilled && !bankName ? "required *" : null
                          }
                          {...params}
                          label="Bank Name"
                        />
                      )}
                    />
          </Grid>
          <Grid item sm={4} xs={12}>
            <TextField
              error={notFilled && !chequeNo ? true : false}
              helperText={notFilled && !chequeNo  ? "required *" : null}
              value={chequeNo}
              onChange={(e) => setChequeNo(e.target.value)}
              fullWidth
              label="Cheque No"
            />
          </Grid>
          <Grid item sm={3} xs={12}>
            <TextField
              error={notFilled && amount < 1 ? true : false}
              helperText={notFilled && amount < 1 ? "required *" : null}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              type="number"
              label="Amount"
            />
          </Grid>
          <Grid sx={{ pt: 0 }} item xs={12}>
            {edit ? (
              <button className="form_btn_2" onClick={updateEdit}>
                Edit Item
              </button>
            ) : (
              <button className="form_btn_2" onClick={addNewItem}>
                Add Item
              </button>
            )}
          </Grid>
          <Grid sx={{ pt: 0 }} item xs={12}>
            {items.length > 0 && (
              <table className="Voucher_items_table">
                <thead>
                  <tr>
                    <th>Cheque No</th>
                    <th>Bank Name</th>
                    <th>Amount</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((e, i) => {
                    return (
                      <tr key={i}>
                        <td>{e.ChequeNumber}</td>
                        <td>{e.BankName}</td>
                        <td>{Number(e.Amount).toLocaleString()}</td>
                        <td onClick={() => editItem(e, i)}>
                          <span className="table_btn_edit">
                            <BiEditAlt />
                          </span>
                        </td>
                        <td onClick={() => deleteItem(i)}>
                          <span className="table_btn_dlt">
                            <AiOutlineDelete />
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      {items.length > 0 && (
        <DialogActions sx={{ px: 4, pb: 2, justifyContent: "center" }}>
          {formLoader ? (
            <BtnLoader />
          ) : (
            <Button variant='contained'
            fullWidth onClick={addItemsInVoucher} className="form_btn">
              Create Voucher
            </Button>
          )}
        </DialogActions>
      )}
    </>
  );
};

export default CreateVoucher;
