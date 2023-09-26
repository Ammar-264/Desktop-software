import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import Cookies from "js-cookie";
import AddIcon from '@mui/icons-material/Add';
import AddParty from "./addParty";


export const Sidebar = ({setRefresh}) => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);


  return (
    <>
     <AddParty
            setRefresh={setRefresh}
            onHide={setShowForm}
            show_modal={showForm}
          />
    
    <div className="sidebar_container">

    <div className="company_signature">
      <h5>Build By <span>Saviolution </span></h5>

    </div>
      <div className="sidebar_container_main">
      
      <div className="logo">
        <img src={logo} alt="" />
      </div>

      <div className="page_links">
        <div style={{ padding: "30px 10px" }}>
          <Button 
          onClick={()=>setShowForm(true)}
            variant="contained"
            fullWidth
          >
           <AddIcon/>  Add New Party 
          </Button>
        </div>
        <Link className="page_link" to={"/"}>
          Party Ledgers
        </Link>
        <Link className="page_link" to={"/bills"}>
          {" "}
          Bills{" "}
        </Link>
        {/* <Link to={"/ledgers"}>Ledgers</Link> */}
        <Link className="page_link" to={"/deliveryChallans"}>
          Delivery Challans
        </Link>
        <Link className="page_link" to={"/paymentVouchers"}>
          Payment Vouchers
        </Link>
        <Link className="page_link" to={"/dailyWages"}>
          Daily Wages
        </Link>
        <Link className="page_link" to={"/users"}>
          Users
        </Link>
        <div style={{ padding: "30px 10px" }}>
          <Button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            variant="contained"
            fullWidth
          >
            Logout
          </Button>
        </div>
      </div>
      </div>
    </div>
    </>
  );
};
