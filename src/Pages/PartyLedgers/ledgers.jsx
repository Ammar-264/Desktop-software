import React, { useEffect, useRef, useState } from "react";
import {  useLocation, useParams } from "react-router-dom";
import {AiOutlinePrinter} from 'react-icons/ai'
import { AiOutlineDelete } from "react-icons/ai";
import { useReactToPrint } from "react-to-print";
import toast from "react-hot-toast";
import axios from "axios";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { api } from "../../utils/api";
import { Loader } from "../../Components/loader/loader";
import { capitalizeEveryWord, formattedDate } from "../../utils/functions";
import DeleteConfirmation from "../../Components/alert/alert";
import AddLedgerLog from './addLedgerLog.jsx'
import { useNavigate } from 'react-router-dom';
import { Sidebar } from "../../Components/Sidebar/sidebar";



export const Ledgers = () => {

  const navigate = useNavigate()
  const token = localStorage.getItem('token');

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  
  let { id } = useParams();
  const [ledgers , setLedgers] = useState()
  const [showForm , setShowForm ] = useState(false)
  const [refresh , setRefresh] = useState(false)
  const [confirmDlt, setConfirmDlt] = useState(false);
  const [ledgerLogToDlt, setLedgerLogToDlt] = useState('');
 

 
  useEffect(()=>{
    axios.get(`${api}LedgerById/${id}`, {
      headers: {
        Authorization: token,
        // Other headers as needed
      },
    })
    .then((res)=>{
        setLedgers(res.data.results)
        toast.success(res.statusText)

        
      }).catch((err)=>{
        if(err.response.status === 401){
          toast.error('Login first')
          return navigate('/login')
      }
      
        toast.error(err.response.data.message)
        navigate('/ledgerParties')
    })
    setRefresh(false);

   },[refresh])


   const location = useLocation()

console.log(ledgers);
  return (
    <>
   {ledgers ?
    <div className="main_container">
    { <div className="sidebar">
        <Sidebar setRefresh={setRefresh} />
    </div>}

      <div className={`page_content `}>
   <div className="page_table_container">
    <AddLedgerLog ldegerId={id} show_modal={showForm} onHide={setShowForm} setRefresh={setRefresh}  />

    <DeleteConfirmation 
      dltCategory={'ledgerLog'}
      setRefresh={setRefresh}
      toDltId={ledgerLogToDlt}
      confirmDlt={confirmDlt}
      setConfirmDlt={setConfirmDlt}
    />
      <div>
        <Grid sx={{px:2}} className="wages_header_1">
            <button onClick={handlePrint}><AiOutlinePrinter /></button>
            <Button onClick={()=>setShowForm(true)} variant="contained" >Add New Ledger</Button>
        </Grid>
        <div ref={componentRef} style={{width:'100%'}}>
           
      <Grid sx={{px:2}} className="page_header wages_header">
        <h3>Ledgers Of {location.state.name && capitalizeEveryWord(location.state.name)}</h3>
       
      </Grid>

      <Grid className="ledger_table">
   
        <table  >
          <thead>
            <tr>
                <th>Bill No</th>
                <th>Description</th>
                <th>Date</th>
                <th>Credit</th>
                <th>Debit</th>
                <th>Amount</th>
                <th className="hide-on-print"></th>
            </tr>
          </thead>
            <tbody>

           {ledgers.map((e,i)=>{
             return(
               <tr key={i}>
                <td>{e.BillNo}</td>
                <td>{e.Description}</td>
                <td>{formattedDate(e.Date)}</td>
                <td>{Number(e.credit).toLocaleString()}</td>
                <td>{Number(e.debit).toLocaleString()}</td>
                <td>{Number(e.CumulativeBalance).toLocaleString()}</td>
                <td className="hide-on-print"  onClick={() => {
                        setLedgerLogToDlt(e._id);
                        setConfirmDlt(true);
                      }} ><AiOutlineDelete /></td>
            </tr>
            )
           }) }
            </tbody>
        </table>
      </Grid>
      </div>
      </div>
    </div> 
    </div> 
    </div> 
    : <Loader/>}

    </>
  );
};
