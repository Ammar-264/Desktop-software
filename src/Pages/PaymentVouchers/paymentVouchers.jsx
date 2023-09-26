import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiShowAlt } from "react-icons/bi";
import { Link } from "react-router-dom";
import { Pagination , Button , Grid , TextField ,IconButton } from "@mui/material";
import toast from "react-hot-toast";
import { api } from "../../utils/api";
import axios from "axios";
import { Loader } from "../../Components/loader/loader";
import CreateVoucher from "./CreateVoucher";
import DeleteConfirmation from "../../Components/alert/alert";
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../Components/Sidebar/sidebar";


export const PaymentVouchers = () => {
  const [vouchers, setVouchers] = useState();
  const [showForm, setShowForm] = useState(false);
  const [confirmDlt, setConfirmDlt] = useState(false);
  const [voucherToDlt, setVoucherToDlt] = useState();
  const [refresh, setRefresh] = useState(false);
  const [currentPage , setCurrentPage] = useState(1)
  const [totalPages , setTotalPages] = useState()
  const [searchText , setSearchText] = useState('')
  const token = localStorage.getItem('token');
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get(`${api}GetVoucherListing?page=${currentPage}&size=15&PayTo=${searchText}`  , {
        headers: {
          Authorization: token,
          // Other headers as needed
        },})
      .then((res) => {
        setVouchers(res.data.data);
        setTotalPages(res.data.totalPages)
        toast.success("Vouchers Loaded");
      })
      .catch((err) =>{
        if(err.response.status === 401){
          toast.error('Login first')
          return navigate('/login')
      }
      });
    setRefresh(false);
  }, [refresh , currentPage]);

  console.log(vouchers);

  return (
    <div className="page_cont">
      {vouchers ? (
         <div className="main_container">
         { <div className="sidebar">
             <Sidebar setRefresh={setRefresh} />
         </div>}
     
           <div className={`page_content `}>
        <div className="page_table_container">
          <CreateVoucher
            setRefresh={setRefresh}
            show_modal={showForm}
            onHide={setShowForm}
          />
          <DeleteConfirmation
          dltCategory={'voucher'}
            setRefresh={setRefresh}
            toDltId={voucherToDlt}
            confirmDlt={confirmDlt}
            setConfirmDlt={setConfirmDlt}
          />
         <div className="page_header">
            <Grid sx={{ px: 2 }} container spacing={3}>
              <Grid
                style={{ display: "flex", alignItems: "center" }}
                item
                sm={6}
              >
                <h3>Payment Vouchers</h3>
              </Grid>
              <Grid item sm={4}>
                <TextField
                fullWidth
                label='Search Particular'
                value={searchText}
                onChange={(e)=>setSearchText(e.target
                  .value)}
                InputProps={{
                  endAdornment: (
                    <IconButton 
                    onClick={()=>
                      {setRefresh(true)
                        setCurrentPage(1)
                    }} >
                      <SearchIcon />
                    </IconButton>
                  ),
                }} />
               
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
              <tr>
                <th>S.no</th>
                <th>Particular</th>
                <th>Amount</th>
                <th></th>
                <th></th>
              </tr>

              {vouchers.map((e, i) => {
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{e.PayTo}</td>
                    <td>{Number(e.TotalAmount).toLocaleString()}</td>
                    <td>
                      <Link
                        className="table_btn_show"
                        to={`/paymentVoucher/${e._id}`}
                      >
                        <BiShowAlt />
                      </Link>
                    </td>
                    <td
                      onClick={() => {
                        setVoucherToDlt(e._id);
                        setConfirmDlt(true);
                      }}
                    >
                      <span className="table_btn_dlt">
                      <AiOutlineDelete />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </table>
            <div className="pagination_block">
              <Pagination
              page={currentPage}
              onChange={(event, newPage) => setCurrentPage(newPage)}
              color="primary" count={totalPages} size="large" />
            </div>
          </div>
        </div>
        </div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};
