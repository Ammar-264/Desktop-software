import React , {useEffect, useRef, useState} from 'react'
import logo from '../../assets/logo.png'
import {AiOutlinePrinter  } from 'react-icons/ai'
import { useReactToPrint } from 'react-to-print'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Loader } from '../../Components/loader/loader'
import axios from 'axios'
import { api } from '../../utils/api'
import { capitalizeEveryWord, formattedDate } from '../../utils/functions'
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../Components/Sidebar/sidebar'


export const Voucher = () => {

    const navigate = useNavigate()
    const [refresh, setRefresh] = useState(false)
    const token = localStorage.getItem('token');

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
     content: () => componentRef.current,
   });

   let { id } = useParams();
   const [voucher , setVoucher] = useState()



// fetching single challan
useEffect(()=>{
    axios.get(`${api}GetSingleVoucher/${id}`, {
        headers: {
          Authorization: token,
          // Other headers as needed
        },
      } )
    .then((res)=>{
        setVoucher(res.data.data)
        toast.success(res.statusText)
    }).catch((err)=>{
        if(err.response.status === 401){
            toast.error('Login first')
            return navigate('/login')
        }
        toast.error(err.response.data.message)
        navigate('/paymentVouchers')
    })
   },[refresh])


   return (
    <>
    
 { voucher? 
  <div className="main_container">
  { <div className="sidebar">
      <Sidebar setRefresh={setRefresh} />
  </div>}

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

            <h4>Payment Voucher</h4>

            <div className="bill_header">
                <div >
                    <span>
                    <h5>Pay To :</h5>
                    <p>{capitalizeEveryWord(voucher.PayTo)}</p>
                    </span>

                 
                </div>
                <div>
                    <h5>Created At :</h5>
                    <p>{ formattedDate(voucher.PaymentDate)}</p>
                </div>
            </div>

            <table className="voucher_table">
                <tr>
                    <th>Cheque No</th>
                    <th>Bank</th>
                    <th>Amount</th>
                </tr>

                {
                    voucher.VoucherIdData.map((e,i)=>{
                        return(
                            <tr>
                    <td>{e.ChequeNumber}</td>
                    <td>{e.BankName}</td>
                    <td>{Number(e.Amount).toLocaleString()}</td>
                </tr>
                        )
                    })
                }
                
                <tr>
                    <th></th>
                    <th>Total Amount</th>
                    <th>{Number(voucher.TotalAmount).toLocaleString()}</th>
                </tr>
               
            </table>
           
           <div className="voucher_bottom">
            <div>
                <p>Recieved By  </p>
                <span></span>
            </div>
           </div>
            </div>
         
          </div>
        </div>
    </div> 
    </div> 
    </div> 
    : <Loader/>}
    </>
  )
}
