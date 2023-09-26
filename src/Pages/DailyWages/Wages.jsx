import React, { useEffect, useRef, useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import {AiOutlinePrinter} from 'react-icons/ai'
import { AiOutlineDelete } from "react-icons/ai";
import { useReactToPrint } from "react-to-print";
import toast from "react-hot-toast";
import axios from "axios";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { api } from "../../utils/api";
import { Loader } from "../../Components/loader/loader";
import { formattedDate } from "../../utils/functions";
import AddWage from "./addWage";
import DeleteConfirmation from "../../Components/alert/alert";
import { Sidebar } from "../../Components/Sidebar/sidebar";

export const Wages = () => {

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  
  let { id } = useParams();
  const [wages , setWages] = useState()
  const [showForm , setShowForm ] = useState(false)
  const [refresh , setRefresh] = useState(false)
  const [confirmDlt, setConfirmDlt] = useState(false);
  const [wageLogToDlt, setWageLogToDlt] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate()
 
  let credits =[]
  let debits =[]
  let creditTotalAmount = 0;
  let debitTotalAmount = 0;

 
  useEffect(()=>{
    axios.get(`${api}GetSingleDailyWages/${id}`, {
      headers: {
        Authorization: token,
        // Other headers as needed
      },})
    .then((res)=>{
        setWages(res.data.DailyWagesData)
        toast.success(res.statusText)

        
      }).catch((err)=>{
        if(err.response.status === 401){
          toast.error('Login first')
          return navigate('/login')
      }
        toast.error(err.response.data.message)
      
    })
    setRefresh(false);

   },[refresh])
   
   //    filtering credits and debits and calculations credits & debit total amount
   
   if(wages){
    let wageList  = wages.main.DailyWageData

    for (var i = 0; i < wageList.length; i++) {
      if (wageList[i].Type === "Credit") {
        credits.push(wageList[i]);
        creditTotalAmount += wageList[i].Amount;
      } else {
        debits.push(wageList[i]);
        debitTotalAmount += wageList[i].Amount;
      }
    }
}

  
  

  return (
    <>
   {wages ?
     <div className="main_container">
     { <div className="sidebar">
         <Sidebar setRefresh={setRefresh} />
     </div>}
 
       <div className={`page_content `}>
   <div className="page_table_container">
    <AddWage wageTableId={id} show_modal={showForm} onHide={setShowForm} setRefresh={setRefresh}  />

    <DeleteConfirmation 
      dltCategory={'wageLog'}
      setRefresh={setRefresh}
      toDltId={wageLogToDlt}
      confirmDlt={confirmDlt}
      setConfirmDlt={setConfirmDlt}
    />
      <div>
        <Grid sx={{px:2}} className="wages_header_1">
            <button onClick={handlePrint}><AiOutlinePrinter /></button>
            <Button onClick={()=>setShowForm(true)} variant="contained" >Add New Wage</Button>
        </Grid>
        <div ref={componentRef} style={{width:'100%'}}>
           
      <Grid sx={{px:2}} className="page_header wages_header">
        <h3>Wages Of : {formattedDate(wages.main.Date)}</h3>
        <div>
            <h3>Remaining Amount : <span>{Number(wages.logs).toLocaleString()}</span> </h3>
            
        </div>
      </Grid>

      <Grid sx={{px:2}} className="wages_tables">
      <table className="wages_table_1" >
          <thead>

            <tr>
                <th>Description</th>
                <th>Credit</th>
                <th className='hide-on-print'></th>
            </tr>
          </thead>
            <tbody>

           {credits.map((e,i)=>{
             return(
               <tr key={i}>
                <td>{e.Description}</td>
                <td>{Number(e.Amount).toLocaleString()}</td>
                <td className='hide-on-print'   onClick={() => {
                        setWageLogToDlt(e._id);
                        setConfirmDlt(true);
                      }} >
                      <AiOutlineDelete />
                    </td>
            </tr>
            )
           }) }
            </tbody>
           <tfoot>

           <tr>
            <th>Total Amount</th>
            <th>{creditTotalAmount.toLocaleString()}</th>
            <th className="hide-on-print"></th>
           </tr>
           </tfoot>
        </table>
        <table className="wages_table_1" >
          <thead>

            <tr>
                <th>Description</th>
                <th>Debit</th>
                <th className="hide-on-print"></th>
            </tr>
          </thead>
            <tbody>

           {debits.map((e,i)=>{
             return(
               <tr key={i}>
                <td>{e.Description}</td>
                <td>{Number(e.Amount).toLocaleString()}</td>
                <td  
                className="hide-on-print"
                onClick={() => {
                  setWageLogToDlt(e._id);
                  setConfirmDlt(true)}} >
                      <AiOutlineDelete />
                    </td>
            </tr>
            )
           }) }
            </tbody>
           <tfoot>

           <tr>
            <th>Total Amount</th>
            <th>{debitTotalAmount.toLocaleString()}</th>
            <th className="hide-on-print"></th>
           </tr>
           </tfoot>
        </table>
      </Grid>
      </div>
      </div>
    </div>
    </div>
    </div> : <Loader/>}

    </>
  );
};
