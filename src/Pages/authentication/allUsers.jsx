import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { Pagination , Button , Grid  } from "@mui/material";
import toast from "react-hot-toast";
import { api } from "../../utils/api";
import axios from "axios";
import { Loader } from "../../Components/loader/loader";
import DeleteConfirmation from "../../Components/alert/alert";
import { useNavigate } from "react-router-dom";
import CreateUser from "./createUser";
import {Sidebar} from '../../Components/Sidebar/sidebar'


export const AllUsers = () => {
  const [users, setUsers] = useState();
  const [showForm, setShowForm] = useState(false);
  const [confirmDlt, setConfirmDlt] = useState(false);
  const [userToDlt, setUserToDlt] = useState();
  const [refresh, setRefresh] = useState(false);
  const [currentPage , setCurrentPage] = useState(1)
  const [totalPages , setTotalPages] = useState()
  const token = localStorage.getItem('token');

  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get(`${api}GetUsers?page=${currentPage}&size=15`  , {
        headers: {
          Authorization: token,
          // Other headers as needed
        },})
      .then((res) => {
        setUsers(res.data.data);
        setTotalPages(res.data.totalPages)
        toast.success("Users Loaded");
      })
      .catch((err) =>{
        if(err.response.status === 401){
          toast.error('Login first')
          return navigate('/login')
      }
      });
    setRefresh(false);
  }, [refresh , currentPage]);

  console.log(users);


  return (
    <div className="page_cont">
      {users ? (
         <div className="main_container">
         { <div className="sidebar">
             <Sidebar />
         </div>}
     
           <div className={`page_content `}>
        <div className="page_table_container">
              <CreateUser  show_modal={showForm} onHide={setShowForm} setRefresh={setRefresh}  />

      
          <DeleteConfirmation
          dltCategory={'user'}
            setRefresh={setRefresh}
            toDltId={userToDlt}
            confirmDlt={confirmDlt}
            setConfirmDlt={setConfirmDlt}
          />
         <div className="page_header">
            <Grid sx={{ px: 2 }} container spacing={3}>
              <Grid
                style={{ display: "flex", alignItems: "center" }}
                item
                sm={9}
              >
                <h3>Users</h3>
              </Grid>
             

              <Grid item sm={3}>
                <Button
                  style={{ height: "100%", fontSize: "20px" }}
                  fullWidth
                  variant="contained"
                  onClick={() => setShowForm(true)}
                >
                  Create User
                </Button>
              </Grid>
            </Grid>
          </div>

          <div className="users_table">
            <table>
              <tr>
                <th>S.no</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th></th>
              </tr>

              {users.map((e, i) => {
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{e.FirstName}</td>
                    <td>{e.LastName}</td>
                    <td
                      onClick={() => {
                        if (users.length > 1){
                          setUserToDlt(e._id);
                        setConfirmDlt(true);
                        }else{
                          toast.error('Cannot Delete Last User')
                        }
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
