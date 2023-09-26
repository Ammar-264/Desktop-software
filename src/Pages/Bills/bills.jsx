import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiShowAlt } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../../utils/api";
import toast from "react-hot-toast";
import { Pagination, Button , Autocomplete ,Grid , TextField } from "@mui/material";
import CreateBill from "./createBill";
import { formattedDate } from "../../utils/functions";
import { Loader } from "../../Components/loader/loader";
import DeleteConfirmation from "../../Components/alert/alert";
import Cookies from "js-cookie";
import { Sidebar } from "../../Components/Sidebar/sidebar";

export const Bills = () => {
  const [bills, setBills] = useState();
  const [showForm, setShowForm] = useState(false);
  const [confirmDlt, setConfirmDlt] = useState(false);
  const [billToDlt, setBillToDlt] = useState();
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

  const fetchBills = async () => {
    try {
      let billRes = await axios.get(
        `${api}GetBillListing?page=${currentPage}&size=15&Party_Name=${
          clientId ? clientId : ""
        }`, {
          headers: {
            Authorization: token,
            // Other headers as needed
          },
        } 
      );

      setBills(billRes.data.data);
      setTotalPages(billRes.data.totalPages);
      toast.success("Bills Loaded");
    } catch (err) {
      console.log(err)
      if(err.response.status === 401){
        toast.error('Login first')
        return navigate('/login')
    }

        }
  };

  useEffect(() => {
    setLoader(true)

    fetchParties()
    fetchBills()
    setRefresh(false);

    setLoader(false)
  }, [refresh, currentPage , clientId]);

  return (
    <>
      {(!loader && bills && parties ) ? (
         <div className="main_container">
         { <div className="sidebar">
             <Sidebar setRefresh={setRefresh} />
         </div>}
     
           <div className={`page_content `}>
        <div>
          <div className="page_table_container">
            <CreateBill
            refresh = {refresh}
              setRefresh={setRefresh}
              show_modal={showForm}
              onHide={setShowForm}
            />
            <DeleteConfirmation
              dltCategory={"bill"}
              setRefresh={setRefresh}
              toDltId={billToDlt}
              confirmDlt={confirmDlt}
              setConfirmDlt={setConfirmDlt}
            />
             <div className="page_header">
              <Grid  sx={{ px: 2 }} container spacing={3}>
                <Grid style={{display:'flex',alignItems:'center'}} item sm={6}>
                  <h3>Bills</h3>
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
                      <TextField {...params} label="Search Party" />
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

            <div className="bills_table">
              <table>
                <thead>
                  <tr>
                    <th>Bill No</th>
                    <th>Particular</th>
                    <th>Date</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((e, i) => {
                    return (
                      <tr key={i}>
                        <td>{e.BillNo}</td>
                        <td>{e.Party_NameData.Name}</td>
                        <td>{formattedDate(e.Date)}</td>
                        <td>
                          <Link
                            className="table_btn_show"
                            to={`/bill/${e._id}`}
                          >
                            <BiShowAlt />
                          </Link>
                        </td>
                        <td
                          onClick={() => {
                            setBillToDlt(e._id);
                            setConfirmDlt(true);
                          }}
                        >
                          <AiOutlineDelete />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
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
