import React, { useState, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiShowAlt } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "../../Components/loader/loader";
import axios from "axios";
import { api } from "../../utils/api";
import CreateChallan from "./AddChallanSlider";
import toast from "react-hot-toast";
import DeleteConfirmation from "../../Components/alert/alert";
import {
  Pagination,
  Button,
  Grid,
  Autocomplete,
  TextField,
} from "@mui/material";
import { formattedDate } from "../../utils/functions";
import { Sidebar } from "../../Components/Sidebar/sidebar";


// theme

export const DeliveryChallans = () => {
  const [challans, setChallans] = useState();
  const [showForm, setShowForm] = useState(false);
  const [confirmDlt, setConfirmDlt] = useState(false);
  const [challanToDlt, setChallanToDlt] = useState();
  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [clientId, setClientId] = useState("");
  const [clientName, setClientName] = useState(null);
  const [parties, setParties] = useState([]);
  const [loader , setLoader] = useState(false)
  const token = localStorage.getItem('token');
  const navigate = useNavigate()

  const fetchParties = async () => {
    try {
      let partiesRes = await axios.get(`${api}GetPartyNameListing`, {
        headers: {
          Authorization: token,
          // Other headers as needed
        },
      });

      const filteredParties = partiesRes.data.data.map((item) => ({
        id: item._id,
        name: item.Name,
      }));

      setParties(filteredParties);
    } catch (err) {
      if(err.response.status === 401){
        toast.error('Login first')
        return navigate('/login')
    }
      console.log(err);
    }
  };

  const fetchChallans = async () => {
    try {
      let chalansRes = await axios.get(
        `${api}GetChallanListing?page=${currentPage}&size=15&ClientName=${
          clientId ? clientId : ""
        }`, {
          headers: {
            Authorization: token,
            // Other headers as needed
          },
        } 
      );

      setChallans(chalansRes.data.data);
      setTotalPages(chalansRes.data.totalPages);
      toast.success("Challans Loaded");
    } catch (err) {
      if(err.response.status === 401){
        toast.error('Login first')
        return navigate('/login')
    }
    }
  };

  useEffect(() => {
    setLoader(true)

    fetchParties()
    fetchChallans()
    setRefresh(false);

    setLoader(false)

  }, [refresh, currentPage, clientId]);
  console.log(clientName);
  console.log(clientId);

  return (
    <>
      {(!loader && challans && parties )? (
         <div className="main_container">
         { <div className="sidebar">
             <Sidebar setRefresh={setRefresh} />
         </div>}
     
           <div className={`page_content `}>
        <div>
          <div className="page_table_container">
            <DeleteConfirmation
              dltCategory={"challan"}
              setRefresh={setRefresh}
              toDltId={challanToDlt}
              confirmDlt={confirmDlt}
              setConfirmDlt={setConfirmDlt}
            />
            <CreateChallan
              setRefresh={setRefresh}
              show_modal={showForm}
              onHide={setShowForm}
              refresh={refresh}
            />
            <div className="page_header">
              <Grid  sx={{ px: 2 }} container spacing={3}>
                <Grid style={{display:'flex',alignItems:'center'}} item sm={6}>
                  <h3>Delivery Challans</h3>
                </Grid>
                <Grid item sm={4}>
                  <Autocomplete
                    id="free-solo-demo"
                    freeSolo
                    fullWidth
                    options={parties}
                    getOptionLabel={(option) => option.name}
                    value={clientName}
                    onChange={(event, newValue) => {
                      setClientName(newValue);
                      setClientId(newValue ? newValue.id ? newValue.id :  "" : '');
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Search Client" />
                    )}
                  />
                </Grid>

                <Grid item sm={2}>
                  <Button
                    style={{ height: "100%", fontSize: "20px" }}
                    fullWidth
                    variant="contained"
                    onClick={() => setShowForm(true)}
                  >
                    Create
                  </Button>
                </Grid>
              </Grid>
            </div>

            <div className="challans_table">
              <table>
                <tr>
                  <th>S.no</th>
                  <th>Client Name</th>
                  <th>Delivery Site</th>
                  <th>Date</th>
                  <th></th>
                  <th></th>
                </tr>

                {challans.map((e, i) => {
                  return (
                    <tr>
                      <td>{i + 1}</td>
                      <td>{e.ClientNameIdData.Name}</td>
                      <td>{e.DeliverySite}</td>
                      <td>{formattedDate(e.DeliveryDate)}</td>
                      <td>
                        <Link
                          className="table_btn_show"
                          to={`/deliveryChallan/${e._id}`}
                        >
                          <BiShowAlt />
                        </Link>
                      </td>
                      <td
                        onClick={() => {
                          setChallanToDlt(e._id);
                          setConfirmDlt(true);
                        }}
                      >
                        <AiOutlineDelete />
                      </td>
                    </tr>
                  );
                })}
              </table>
              <div className="pagination_block">
                <Pagination
                  page={currentPage}
                  onChange={(event, newPage) => setCurrentPage(newPage)}
                  color="primary"
                  count={totalPages}
                  size="large"
                />
              </div>
            </div>
          </div>
        </div>
        </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};
