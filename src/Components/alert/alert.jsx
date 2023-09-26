// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import { Typography } from '@mui/material'
import axios from 'axios'
import { api } from '../../utils/api'
import { BtnLoader } from '../../Components/loader/loader'
import toast from 'react-hot-toast'


const DeleteConfirmation = ({dltCategory,confirmDlt , setConfirmDlt , toDltId , setRefresh}) => {
  
    const [loader , setLoader] = useState(false)
    const token = localStorage.getItem('token');

    const deleteChallan =async( ) =>{
        setLoader(true)
        try {

           let categoryToDltFrom = dltCategory == 'challan' ? "SoftDeleteChallan"
           : dltCategory == 'voucher' ? "SoftDeleteVoucher" : dltCategory == 'wageLog' ? "DeleteDailyWagesLogs" : dltCategory === "ledgerLog" ?'DeleteLedgerLogs': dltCategory === "bill" ? 'SoftDeleteBill' : dltCategory === "ledger" ? 'CompleteLedgerDelete' :dltCategory === "user" ? 'DeleteUser'  : ''
           
            let res = await axios.delete(`${api}${categoryToDltFrom}/${toDltId}`,
             {
              headers: {
                Authorization: token,
                // Other headers as needed
              },
            })
            toast.success(res.data.message)
            setConfirmDlt(false)
            setRefresh(true)
        } catch (err) {
            toast.error(err.response.statusText)
        }

        setLoader(false)
    }
 
  return (
    <Fragment>
      <Dialog
        open={confirmDlt}
        disableEscapeKeyDown
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
       
      >
       
        <DialogContent>
          <DialogContentText >
            <Typography >
            Are You Sure You Want To Delete ?
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{display:'flex',justifyContent:'center'}}  className='dialog-actions-dense'>
            {loader ? <BtnLoader/>:
            <>
          <Button variant="outlined" color='success' onClick={()=>setConfirmDlt(false)}>Cancel</Button>
          <Button onClick={deleteChallan} variant='contained' color='error' >Confirm</Button>
            </>
         }
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default DeleteConfirmation
