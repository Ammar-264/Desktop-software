import { Button, Grid, IconButton, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { BtnLoader } from '../../Components/loader/loader'
import axios from 'axios'
import { api } from '../../utils/api'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import toast from 'react-hot-toast'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'



export const Login = () => {

    const [btnLoader , setBtnLoader] = useState(false)
    const [password ,setPassword] = useState('')
    const [showPass , setShowPass ] = useState(false)
    const [firstName ,setFirstName] = useState('')
    const [notFilled , setNotFilled] = useState(false)
    const navigate = useNavigate()


    const login =async ()=>{
      if(!firstName || !password){
        setNotFilled(true)
        return toast.error('fill all the fields correctly')
      }
      
      setBtnLoader(true)
      try {
        let data = {
          FirstName:firstName,
          password:password
        }
        let res = await axios.post(`${api}LoginUser` , data)
        console.log(res);
        let token = res.data.token

        localStorage.setItem('token', token);

        toast.success('login successfully')
        navigate('/')
        setPassword('')
        setFirstName('')
        setNotFilled('')

      } catch (err) {
        toast.error(err.response.data.message)
      }

      setBtnLoader(false)
    }
  return (
    <div className="page_table_container">

<Grid style={{display:'flex' , justifyContent:'center' , alignItems:'center' , height:'100vh'}} container >

    <Grid
    className='login_form'
     item sm={5} spacing={2}>
      <Typography variant='h3' align='center' sx={{py:2}}>
        Login
      </Typography>

        <TextField 
         error={notFilled && !firstName ? true : false}
         helperText={
           notFilled && !firstName ? "required *" : null
         }
        value={firstName}
        onChange={(e)=>setFirstName(e.target.value)}
        sx={{my:1}}
        fullWidth 
        label='First Name' />


        <TextField
         error={notFilled && !password ? true : false}
         helperText={
           notFilled && !password ? "required *" : null
         }
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        type={showPass ? 'text' : 'password'}
        sx={{my:1}}
          fullWidth
           label='Password'
           InputProps={{
            endAdornment: (
              <IconButton onClick={()=>setShowPass(showPass ? false : true)}>
               {showPass ? <VisibilityOffIcon/> :  <VisibilityIcon />}
              </IconButton>
            ),
          }} />

           <Grid sm={12} sx={{mt:5}}
            >

       {btnLoader?<BtnLoader/>: <Button onClick={login} style={{fontSize:'20px'}} fullWidth variant='contained' >Login</Button>}
           </Grid>
    </Grid>
    </Grid>
    </div>
  )
}
