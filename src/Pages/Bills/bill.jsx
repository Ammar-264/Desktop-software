import React , {useEffect, useRef, useState} from 'react'
import logo from '../../assets/logo.png'
import {AiOutlinePrinter  , AiOutlineEdit} from 'react-icons/ai'
import { useReactToPrint } from 'react-to-print'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { api } from '../../utils/api'
import toast from 'react-hot-toast'
import { Loader } from '../../Components/loader/loader'
import { formattedDate } from '../../utils/functions'
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../Components/Sidebar/sidebar'


export const Bill = () => {

    const navigate = useNavigate()
    const token = localStorage.getItem('token');
    const [bill, setBill] = useState()
    const [refresh, setRefresh] = useState(false)
    let { id } = useParams();

    useEffect(()=>{
        
        axios.get(`${api}GetSingleBill/${id}`, {
            headers: {
              Authorization: token,
              // Other headers as needed
            },
          } )
        .then((res)=>{
            setBill(res.data.data)
            toast.success(res.statusText)
        }).catch((err)=>{

            if(err.response.status === 401){
                toast.error('Login first')
                return navigate('/login')
            }
            
            toast.error(err.response.data.message)
            navigate('/bills')
        })
       },[refresh])

    const componentRef = useRef();    
   const handlePrint = useReactToPrint({
     content: () => componentRef.current,
   });



  return (
    <>
    {bill ? 
     <div className="main_container">
        <div className="sidebar">
        <Sidebar setRefresh={setRefresh}/>
  
     </div>
     <div className={`page_content `}>
    <div className="challan_cont">
        <div className="btns">
            {/* <button><AiOutlineEdit/></button> */}
            <button onClick={handlePrint}><AiOutlinePrinter/></button>
        </div>
        <div  className="challan">
          <div ref={componentRef} className='challan_content'>
            <div className='challan_content_side' >
            
            <img src={logo} alt="" />

            <h4>Bill</h4>

            <div className="bill_header">
                <div >
                    <span>
                    <h5>Bill No :</h5>
                    <p>{bill.BillNo}</p>
                    </span>

                    <span>
                    <h5>Party Name :</h5>
                    <p>{bill.Party_NameData.Name}</p>
                    </span>

                    <span>
                    <h5>Delivery Site :</h5>
                    <p>{bill.DeliverySite}</p>
                    </span>
                </div>
                <div>
                    <h5>Created At :</h5>
                    <p>{formattedDate(bill.Date)}</p>
                </div>
            </div>

            <table className="bill_table">
                <tr>
                    <th>Quantity</th>
                    <th>CFT</th>
                    <th>Description</th>
                    <th>Price Per (Piece OR Cft)</th>
                    <th>Total Amount</th>
                </tr>
               {
               bill.BillIdData.map((e,i)=>{
                return(
                    <tr key={i}>
                    <td>{Number(e.Quantity).toLocaleString()}</td>
                    <td>{Number(e.Cft).toLocaleString()}</td>
                    <td>{e.Description}</td>
                    <td>{Number(e.RatePerPiecce).toLocaleString()}</td>
                    <td>{e.ByCft  ? Number(e.Cft * e.RatePerPiecce).toLocaleString() : Number(e.Quantity * e.RatePerPiecce).toLocaleString()}</td>
                </tr>
                )
               }) }
              
            </table>
            <div className="bill_amounts">
                <div className="bill_amounts_content" >
                    <div>
                        <p>Cartage :</p>
                        <span>{bill.Cartage}</span>
                    </div>
                    <div>
                        <p>Loading :</p>
                        <span>{bill.Loading}</span>
                    </div>
                    <div>
                        <p>Total Amount :</p>
                        <span>{Number(bill.TotalAmount).toLocaleString()}</span>
                    </div>
                </div>
            </div>
            </div>
         
          </div>
        </div>
    </div>
    </div>
    </div>
    :<Loader />}
    </>
   
  )
}
