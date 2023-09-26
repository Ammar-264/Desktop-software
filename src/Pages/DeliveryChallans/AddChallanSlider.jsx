// ** React Imports
import { useEffect, useState } from "react";
// ** MUI Imports
import Box from "@mui/material/Box";
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
import axios from "axios";
import { api } from "../../utils/api";
import toast from "react-hot-toast";
import IconButton from '@mui/material/IconButton'
import Close from 'mdi-material-ui/Close'
import DialogTitle from '@mui/material/DialogTitle'
import { useNavigate } from "react-router-dom";


// creating challann
const CreateChallan = ({show_modal ,onHide ,setRefresh , refresh}) => {
  // ** States
  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverContact, setReceiverContact] = useState("");
  const [deliverySite, setDeliverySite] = useState("");
  const [loader, setLoader] = useState(false);
  const [formLoader, setFormLoader] = useState(false);
  const [clientName, setClientName] = useState(null);
  const [parties, setParties] = useState([]);
  const [challanId, setChallanId] = useState("");
  const [notFilled, setNotFilled] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate()


  //   creating challan
  const sendFormData = async () => {
    
    if (
      !clientName ||
      !date ||
      !receiverName ||
      !receiverContact ||
      !deliverySite
    ) {
      setNotFilled(true);
      return toast.error("fill all the fields correctly!");
    }

    setFormLoader(true);

    try {
      let data = {
        ClientName: clientName && clientName.id,
        DeliveryDate: date,
        ReceiverName: receiverName,
        ReceiverContact: receiverContact,
        DeliverySite: deliverySite,
      };

      let res = await axios.post(`${api}CreateChallan`, data , {
        headers: {
          Authorization: token,
          // Other headers as needed
        },
      });

      toast.success(res.statusText);

      setChallanId(res.data.data._id);
      // making fields empty
      setClientName(null);
      setDate(null);
      setDeliverySite(null);
      setReceiverContact(null);
      setReceiverName(null);
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

  //   fetching client names
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
      .catch((err) => console.log(err));
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
                    Create Challan
                  </Typography>
                </Box>

                <Grid container spacing={6}>
                  <Grid item sm={6} xs={12}>
                    <Autocomplete
                      id="free-solo-demo"
                      options={parties}
                      getOptionLabel={(option) => option.name}
                      value={clientName}
                      onChange={(event, newValue) => setClientName(newValue)}
                      renderInput={(params) => (
                        <TextField
                          error={notFilled && !clientName ? true : false}
                          helperText={
                            notFilled && !clientName ? "required *" : null
                          }
                          {...params}
                          label="Client Name"
                        />
                      )}
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
                      error={notFilled && !receiverName ? true : false}
                      helperText={
                        notFilled && !receiverName ? "required *" : null
                      }
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      fullWidth
                      label="Receiver Name"
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      error={notFilled && !receiverContact ? true : false}
                      helperText={
                        notFilled && !receiverContact ? "required *" : null
                      }
                      value={receiverContact}
                      onChange={(e) => setReceiverContact(e.target.value)}
                      fullWidth
                      label="Receiver Contact"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      error={notFilled && !deliverySite ? true : false}
                      helperText={
                        notFilled && !deliverySite ? "required *" : null
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
                      (!clientName ||
                        !date ||
                        !receiverName ||
                        !receiverContact ||
                        !deliverySite)
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
        <AddItems setRefresh={setRefresh} onHide={onHide} setStep={setStep}  id={challanId} />
      )}
    </Dialog>
  );
};

// creating items in challan
const AddItems = ({ id , onHide , setStep , setRefresh}) => {
  const [items, setItems] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [description, setDescription] = useState("");
  const [editIndex, setEditIndex] = useState(false);
  const [edit, setEdit] = useState(false);
  const [formLoader, setFormLoader] = useState(false);
  const [notFilled, setNotFilled] = useState(false);
  const token = localStorage.getItem('token');


  // adding new item
  const addNewItem = () => {
    if (quantity < 1 || !description) {
      setNotFilled(true);
      return toast.error("fill all the fields correctly!");
    }
    let item = {
      Quantity: quantity,
      Description: description,
    };

    setItems([...items, item]);

    setQuantity(0);
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
    setQuantity(e.Quantity);
    setDescription(e.Description);
    setEdit(true);
    setEditIndex(i);
  };

  // updating new data in edit item

  const updateEdit = (e) => {
    e.preventDefault();

    // updating new values for edit data
    const updatedItem = {
      Quantity: Number(quantity),
      Description: description,
    };

    // updating new data to the item selected for edit

    items[editIndex] = updatedItem;
    setItems([...items]);

    // setting fields to empty after update
    setQuantity(0);
    setDescription("");
    setEdit(false);
    setEditIndex("");
  };

  //   adding items in challan
  const addItemsInChallan = async () => {
    setFormLoader(true);

    try {
      let data = {
        ChallanItems: items,
      };

      let res = await axios.post(
        `${api}CreateChallanItems/${id}`,
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
            Add Challan Items
          </Typography>
        </Box>
        <Grid container spacing={6}>
          <Grid item sm={6} xs={12}>
            <TextField
              error={notFilled && !description ? true : false}
              helperText={notFilled && !description ? "required *" : null}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              label="Description"
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              error={notFilled && quantity < 1 ? true : false}
              helperText={notFilled && quantity < 1 ? "required *" : null}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              fullWidth
              type="number"
              label="quantity"
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
              <table className="challan_items_table">
                <thead>
                  <tr>
                    <th>Quantity</th>
                    <th>Description</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((e, i) => {
                    return (
                      <tr key={i}>
                        <td>{e.Quantity}</td>
                        <td>{e.Description}</td>
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
            <Button variant="contained" fullWidth onClick={addItemsInChallan} className="form_btn">
              Create Challan
            </Button>
          )}
        </DialogActions>
      )}
    </>
  );
};

export default CreateChallan;
