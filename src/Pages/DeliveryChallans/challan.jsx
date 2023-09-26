import React , {useEffect, useRef, useState} from 'react'
import logo from '../../assets/logo.png'
import {AiOutlinePrinter  } from 'react-icons/ai'
import { useReactToPrint } from 'react-to-print'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { api } from '../../utils/api'
import toast from 'react-hot-toast'
import { Loader } from '../../Components/loader/loader'
import { formattedDate } from '../../utils/functions'
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../Components/Sidebar/sidebar'


export const Challan = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('token');
    const [challan , setChallan] = useState()
    const [refresh, setRefresh] = useState(false)


    const componentRef = useRef();
    let { id } = useParams();
   
    const handlePrint = useReactToPrint({
     content: () => componentRef.current,
   });

   useEffect(()=>{
    axios.get(`${api}GetSingleChallan/${id}`  , {
        headers: {
          Authorization: token,
          // Other headers as needed
        },
      })
    .then((res)=>{
        setChallan(res.data.data)
        toast.success(res.statusText)
    }).catch((err)=>{
        if(err.response.status === 401){
            toast.error('Login first')
            return navigate('/login')
        }
        toast.error(err.response.data.message)
        navigate('/deliveryChallans')
    })
   },[refresh])



  return (
    <>
   { challan ? 
    <div className="main_container">
    { <div className="sidebar">
        <Sidebar setRefresh={setRefresh} />
    </div>}

      <div className={`page_content `}>
    <div className="challan_cont">
        <div className="btns">
            <button onClick={handlePrint}><AiOutlinePrinter/></button>
        </div>
        <div  className="challan">
          <div ref={componentRef} className='challan_content'>
            <div className='challan_content_side' >
            
            <img src={logo} alt="" />

            <h4>Delivery Challan</h4>

            <div className="challan_header">
                <div className="left_side">
                    <div>

                    <h5>Client :</h5>
                    <p>{challan.ClientNameIdData.Name}</p>
                    </div>
                    <div>

                    <h5>Delivery Site :</h5>
                    <p>{challan.DeliverySite}</p>
                    </div>
                    <div>

<h5>Date :</h5>
<p>{challan && formattedDate(challan.DeliveryDate)}</p>
</div>
                </div>
                <div className="right_side">
                  
                </div>
            </div>

            <table className="challan_table">
                <tr>
                    <th>Quantity</th>
                    <th>Description</th>
                </tr>

                {
                    challan.ChallanIdData.map((e,i)=>{
                        return(
                            <tr key={i}>
                            <td>{e.Quantity}</td>
                            <td>{e.Description}</td>
                        </tr>
                        )
                    })
                }
               
               
            </table>

            <div className="reciever_detail">
                <div>
                    <h5>Reciever Name : </h5>
                    <p>{challan.ReceiverName}</p>
                </div>
                <div>
                    <h5>Reciever Contact : </h5>
                    <p>{'0'+String(challan.ReceiverContact)}</p>
                </div>
            </div>
            </div>
            <div className="signatures">
                <p>Sender</p>
                <p>Reciever</p>
            </div>
          </div>
        </div>
    </div>
    </div>
    </div>
    :<Loader/>}

    </>
    
  )
}
