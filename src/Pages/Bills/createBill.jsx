// ** React Imports
import {useEffect, useState } from "react";
// ** MUI Imports
import Box from "@mui/material/Box";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { BiEditAlt } from "react-icons/bi";
import { BtnLoader, Loader } from "../../Components/loader/loader";
import { Autocomplete , Button} from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { api } from "../../utils/api";
import toast from "react-hot-toast";
import IconButton from '@mui/material/IconButton'
import Close from 'mdi-material-ui/Close'
import DialogTitle from '@mui/material/DialogTitle'
import { useNavigate } from "react-router-dom";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';


// creating challann
const CreateBill= ({show_modal ,onHide ,setRefresh , refresh}) => {
  // ** States
  const [step, setStep] = useState(1);
  const [party, setParty] = useState(null);
  const [cartage, setCartage] = useState(0);
  const [loading, setLoading] = useState(0);
  const [billNo, setBillNo] = useState(0);
  const [loader, setLoader] = useState(false);
  const [date, setDate] = useState("");
  const [formLoader, setFormLoader] = useState(false);
  const [billId, setBillId] = useState("");
  const [notFilled, setNotFilled] = useState(false);
  const [deliverySite , setDeliverySite] = useState('')
  const [parties, setParties] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate()


  //   creating challan
  const sendFormData = async () => {
    
    if (!party ||!date || cartage < 0 || loading < 0 || billNo < 1 || !billNo || !deliverySite) {
      setNotFilled(true);
      return toast.error("fill all the fields correctly!");
    }

    setFormLoader(true);

    try {
      let data = {
        Party_Name: party.id,
        Cartage: cartage ? cartage : 0,
        Loading: loading ? loading : 0,
        BillNo : billNo,
        Date:date,
        DeliverySite:deliverySite
      };

      let res = await axios.post(`${api}CreateBill`, data , {
        headers: {
          Authorization: token,
          // Other headers as needed
        },});

      toast.success(res.statusText);

      setBillId(res.data.data._id);
      // making fields empty
      setParty('');
      setDate('');
      setDeliverySite('')
      setCartage(0);
      setLoading(0);
      setBillNo();
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

  //   fetching party names
  useEffect(() => {
    setLoader(true);

    axios
      .get(`${api}GetPartyNameListing`)
      .then((res) => {
        const filteredParties = res.data.data.map((item) => ({
          id: item._id,
          name: item.Name,
        }));

        setParties(filteredParties);
        setLoader(false);
      })
      .catch((err) =>{
        if(err.response.status === 401){
          toast.error('Login first')
          return navigate('/login')
      }
      });
  }, [refresh]);

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
          {loader ? (
            <Loader />
          ) : (
            <>
              <DialogContent sx={{ pb: 2, px: 4, pt: 3, position: "relative" }}>
                <Box sx={{ mb: 1, textAlign: "center" }}>
                  <Typography variant="h4" sx={{ mb: 3 }}>
                    Create Bill
                  </Typography>
                </Box>

                <Grid container spacing={6}>
                  <Grid item sm={12} >
                    <Autocomplete
                      id="free-solo-demo"
                      fullWidth
                      options={parties}
                      getOptionLabel={(option) => option.name}
                      value={party}
                      onChange={(event, newValue) => setParty(newValue)}
                      renderInput={(params) => (
                        <TextField
                          error={notFilled && !party ? true : false}
                          helperText={
                            notFilled && !party ? "required *" : null
                          }
                          {...params}
                          label="Party Name"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      error={notFilled && (!billNo || billNo < 1) ? true : false}
                      helperText={notFilled && (!billNo || billNo < 1) ? "required *" : null}
                      value={billNo}
                      onChange={(e) => setBillNo(e.target.value)}
                      fullWidth
                      type="number"
                      label='Bill No'
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

                  <Grid item sm={6} xs={12}>
                    <TextField
                      error={notFilled && cartage < 0 ? true : false}
                      helperText={
                        notFilled && cartage < 0 ? "cannot be negative" : null
                      }
                      value={cartage}
                      onChange={(e) => setCartage(e.target.value)}
                      fullWidth
                      label="Cartage"
                      type="number"
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                  <TextField
                      error={notFilled && loading < 0 ? true : false}
                      helperText={
                        notFilled && loading < 0 ? "cannot be negative" : null
                      }
                      value={loading}
                      onChange={(e) => setLoading(e.target.value)}
                      fullWidth
                      label="Loading"
                      type="number"
                    />
                  </Grid>
                  <Grid item sm={12} >
                  <TextField
                      error={notFilled && !deliverySite  ? true : false}
                      helperText={
                        notFilled && !deliverySite  ? "required *" : null
                      }
                      value={deliverySite}
                      onChange={(e) => setDeliverySite(e.target.value)}
                      fullWidth
                      label="Delivery Site"
                  
                    />
                  </Grid>

                </Grid>
              </DialogContent>
              <DialogActions sx={{ px: 4, pb: 2, justifyContent: "center" }}>
                {formLoader ? (
                  <BtnLoader />
                ) : (
                  <Button
                  variant="contained"
                  fullWidth
                    disabled={
                      notFilled &&
                      (!party ||
                        !date ||
                        cartage < 0 ||
                        loading < 0 ||
                        (!billNo || billNo < 1)  || !deliverySite)
                       
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
          )}
        </>
      ) : (
        <AddItems setRefresh={setRefresh} onHide={onHide} setStep={setStep}  id={billId} />
      )}
    </Dialog>
  );
};

// creating items in challan
const AddItems = ({ id , onHide , setStep , setRefresh}) => {
  const [items, setItems] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [ratePerPiece, setRatePerPiece] = useState(0);
  const [description, setDescription] = useState("");
  const [editIndex, setEditIndex] = useState(false);
  const [edit, setEdit] = useState(false);
  const [formLoader, setFormLoader] = useState(false);
  const [notFilled, setNotFilled] = useState(false);
  const [calculateOn , setCalculateOn] = useState('')
  const [cft , setCft] = useState(0)
  const token = localStorage.getItem('token');

  // adding new item
  const addNewItem = () => {
    if ((ratePerPiece < 1 || !ratePerPiece)  || !description || (cft <= 0 && quantity <= 0) || (cft < 0 || quantity <0) || !calculateOn ) {
      setNotFilled(true);
      return toast.error("fill all the fields correctly!");
    }
    let item = {
        Description: description,
        RatePerPiecce: Number(ratePerPiece),
        Quantity:quantity ? Number(quantity) : 0, 
        Cft :cft ? Number(cft) : 0,
        ByCft:calculateOn === 'CFT' ? true : false
    };

    setItems([...items, item]);

    setQuantity(0);
    setCft(0);
    setRatePerPiece(0);
    setCalculateOn('')
    setDescription("");
    setNotFilled(false)
  };

  // deleting item from list
  const deleteItem = (i) => {
    items.splice(i, 1);
    setItems([...items]);
  };

  //getting edit item data ininputs
  const editItem = (e, i) => {
    setDescription(e.Description);
    setRatePerPiece(e.RatePerPiecce);
    setQuantity(e.Quantity);
    setCft(e.Cft);
    setEdit(true);
    setCalculateOn(e.ByCft)
    setEditIndex(i);
  };

  // updating new data in edit item

  const updateEdit = (e) => {
    e.preventDefault();

    // updating new values for edit data
    const updatedItem = {
      Quantity:quantity ? Number(quantity) : 0,
      Description: description,
      RatePerPiecce: Number(ratePerPiece),
      Cft:cft ?  Number(cft) : 0,
      ByCft:calculateOn === 'CFT' ? true : false
    };

    // updating new data to the item selected for edit

    items[editIndex] = updatedItem;
    setItems([...items]);

    // setting fields to empty after update
    setQuantity(0);
    setRatePerPiece(0);
    setCft(0);
    setCalculateOn('')
    setDescription("");
    setEdit(false);
    setEditIndex("");
  };

  //   adding items in challan
  const addItemsInVoucher = async () => {
    setFormLoader(true);

    try {
      let data = {
        BillItems: items,
      };

      let res = await axios.post(
        `${api}CreateBillItems/${id}`,
        data, {
          headers: {
            Authorization: token,
            // Other headers as needed
          },
        }
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
            Add Bill Items
          </Typography>
        </Box>
        <Grid container spacing={6}>
        
          <Grid item sm={6} xs={12} >
            <TextField
              error={notFilled && !description ? true : false}
              helperText={notFilled && !description  ? "required *" : null}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              label="Description"
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              error={notFilled && (cft < 0 ) ? true :notFilled && (cft == 0 && quantity == 0) ? true  : false}
              helperText={notFilled &&  (cft < 0) ? "required *" :notFilled && (cft == 0 && quantity == 0) ? 'any one Required (Cft OR Quantity) ': null}
              value={cft}
              onChange={(e) => setCft(e.target.value)}
              fullWidth
              type="number"
              label="CFT"
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              error={notFilled && (quantity < 0 ) ? true :notFilled && (cft == 0 && quantity == 0) ? true : false}
              helperText={notFilled &&  (quantity < 0 ) ? "required *" :notFilled && (cft == 0 && quantity == 0) ? 'any one Required (Cft OR Quantity) ': null}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              fullWidth
              type="number"
              label="Quantity"
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              error={notFilled && (ratePerPiece < 1 || !ratePerPiece) ? true : false}
              helperText={notFilled &&  (ratePerPiece < 1 || !ratePerPiece) ? "required *" : null}
              value={ratePerPiece}
              onChange={(e) => setRatePerPiece(e.target.value)}
              fullWidth
              type="number"
              label="Rate Per (peice OR Cft)"
            />
          </Grid>
          <Grid item xs={12}>
                  <FormControl   error={notFilled && !calculateOn ? true : false} fullWidth>
      <FormLabel id="demo-radio-buttons-group-label">Calculate On (CFT OR Piece) *</FormLabel>
      <RadioGroup
      row
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="female"
        name="radio-buttons-group"
        value={calculateOn}
        onChange={(e)=>setCalculateOn(e.target.value)}
      >
        <FormControlLabel value="CFT" control={<Radio />} label="CFT" />
        <FormControlLabel value="Piece" control={<Radio />} label="Piece" />
      </RadioGroup>
    </FormControl>
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
              <table className="bill_items_table">
                <thead>
                  <tr>
                    <th>Quantity</th>
                    <th>CFT</th>
                    <th>Description</th>
                    <th>RPP</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((e, i) => {
                    return (
                      <tr key={i}>
                        <td>{e.Quantity}</td>
                        <td>{e.Cft}</td>
                        <td>{e.Description}</td>
                        <td>{Number(e.RatePerPiecce).toLocaleString()}</td>
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
              Create Bill
            </Button>
          )}
        </DialogActions>
      )}
    </>
  );
};

export default CreateBill;
