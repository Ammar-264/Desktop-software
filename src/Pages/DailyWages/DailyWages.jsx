import React, { useEffect, useState } from "react";
import { BiShowAlt } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { Loader } from "../../Components/loader/loader";
import { formattedDate} from "../../utils/functions";
import { api } from "../../utils/api";
import {  Button, Grid } from "@mui/material";
import CreateWageTable from "./CreateWageTable";
import { Sidebar } from "../../Components/Sidebar/sidebar";

export const DailyWages = () => {
  const [wagesListing, setWagesListing] = useState();
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const token = localStorage.getItem('token');
  const navigate = useNavigate()



  useEffect(() => {
    axios
      .get(`${api}GetDailyWagesListingv2`, {
        headers: {
          Authorization: token,
          // Other headers as needed
        },})
      .then((res) => {
        setWagesListing(res.data.DailyWagesData);
        toast.success("Wages Loaded");
      })
      .catch((err) => {
        if(err.response.status === 401){
          toast.error('Login first')
          return navigate('/login')
      }
      });
    setRefresh(false);
  }, [refresh]);

  return (
    <>
      {wagesListing ? (
         <div className="main_container">
         { <div className="sidebar">
             <Sidebar setRefresh={setRefresh} />
         </div>}
     
           <div className={`page_content `}>
        <div className="page_table_container">
          <CreateWageTable
            setRefresh={setRefresh}
            onHide={setShowForm}
            show_modal={showForm}
          />
          <div className="page_header">
            <Grid sx={{ px: 2 }} container spacing={3}>
              <Grid
                style={{ display: "flex", alignItems: "center" }}
                item
                sm={10}
              >
                <h3>Daily Wages</h3>
              </Grid>
              {/* <Grid item sm={4}>
                <TextField
                fullWidth
                 type="date" 
                 onChange={(e)=>setSearchDate(e.target.value)}
                 value={searchDate}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={()=>setSearchDate('')}>
                      <ClearIcon />
                    </IconButton>
                  ),
                }} />
               
              </Grid> */}

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

          <div className="dailywages_table">
            {/* wages listing table */}
            <table>
              <tr>
                <th>S.no</th>
                <th>Date</th>
                <th>Remaining Amount</th>
                <th></th>
              </tr>

              {wagesListing.map((e, i) => {
                return (
                  <tr>
                    <td>{i + 1}</td>
                    <td>{formattedDate(e.main.Date)}</td>
                    <td>{Number(e.logs).toLocaleString()}</td>
                    <td>
                      <Link
                        className="table_btn_show"
                        to={`/wages/${e.main._id}`}
                      >
                        <BiShowAlt />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </table>
          
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
