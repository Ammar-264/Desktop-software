import React, { useEffect, useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import {BiShowAlt} from 'react-icons/bi'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Pagination , Button , Grid , Autocomplete , TextField } from "@mui/material";
import { api } from '../../utils/api'
import { Loader } from '../../Components/loader/loader'
import toast from 'react-hot-toast'
import AddLedgerParty from './addLedgerParty'
import { useNavigate } from 'react-router-dom';
import DeleteConfirmation from '../../Components/alert/alert'
import { Sidebar } from '../../Components/Sidebar/sidebar'

export const Parties = () => {

    const [ledgerParties, setLedgerParties] = useState();
    const [showForm, setShowForm] = useState(false);
    const [confirmDlt, setConfirmDlt] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [clientId, setClientId] = useState("");
  const [clientName, setClientName] = useState(null);
  const [parties, setParties] = useState([]);
  const [loader , setLoader] = useState(false)
  const [ledgerToDlt, setLedgerToDlt] = useState('');
  const navigate = useNavigate()
  const token = localStorage.getItem('token');

  const fetchParties = async () => {
    try {
      let partiesRes = await axios.get(`${api}GetPartyNameListing`, {
        headers: {
          Authorization: token,
          // Other headers as needed
        },
      });

      const filteredParties = partiesRes.data.data.map((item) => ({
        id: item._id,
        name: item.Name,
      }));

      setParties(filteredParties);
    } catch (err) {
      if(err.response.status === 401){
        toast.error('Login first')
        return navigate('/login')
    }
    
    }
  };

  const fetchLedgerParties = async () => {
    try {
      let ledgerRes = await axios.get(
        `${api}GetLedgerListing?page=${currentPage}&size=15&Party_Name=${
          clientId ? clientId : ""
        }`, {
          headers: {
            Authorization: token,
            // Other headers as needed
          },
        }
      );

      setLedgerParties(ledgerRes.data.data);
      setTotalPages(ledgerRes.data.totalPages);
      toast.success("Ledger Parties Loaded");
    } catch (err) {
      if(err.response.status === 401){
        toast.error('Login first')
        return navigate('/login')
    }
    }
  };

  
    useEffect(() => {
      setLoader(true)

      fetchParties()
      fetchLedgerParties()
      setRefresh(false);
  
      setLoader(false)
    }, [refresh , currentPage , clientId]);


  return (
    <>
 {(!loader && ledgerParties && parties ) ?
  <div className="main_container">
  { <div className="sidebar">
      <Sidebar setRefresh={setRefresh} />
  </div>}

    <div className={`page_content `}>
 <>
  <div className="page_cont">
    <AddLedgerParty show_modal={showForm} onHide={setShowForm} setRefresh={setRefresh} refresh={refresh} />
    <DeleteConfirmation
      dltCategory={'ledger'}
      setRefresh={setRefresh}
      toDltId={ledgerToDlt}
      confirmDlt={confirmDlt}
      setConfirmDlt={setConfirmDlt}
    />
    <div className="page_table_container">
    <div className="page_header">
              <Grid  sx={{ px: 2 }} container spacing={3}>
                <Grid style={{display:'flex',alignItems:'center'}} item sm={6}>
                  <h3>Party Ledgers</h3>
                </Grid>
                <Grid item sm={4}>
                  <Autocomplete
                    id="free-solo-demo"
                    freeSolo
                    fullWidth
                    options={parties}
                    getOptionLabel={(option) => option.name}
                    value={clientName}
                    onChange={(event, newValue) => {
                      setClientName(newValue);
                      setClientId(newValue ? newValue.id ? newValue.id :  "" : '');
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Search Party" />
                    )}
                  />
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

    <div className="party_table">
      <table>
        <thead>

        <tr>
          <th>S.no</th>
          <th>Particular</th>
          <th></th>
          <th></th>
        </tr>
        </thead>

    <tbody>

       {ledgerParties.map((e,i)=>{
         return(
           <tr key={i}>
            <td>{i+1}</td>
            <td>{e.PartyIdDataForLedger.Name}</td>
            <td><Link className='table_btn_show' state={{name:e.PartyIdDataForLedger.Name}} to={`/ledgers/${e._id}`} ><BiShowAlt/></Link></td>
            <td  onClick={() => {
                        setLedgerToDlt(e._id);
                        setConfirmDlt(true);
                      }} ><AiOutlineDelete /></td>
          </tr>
          )
        }
        ) }
        </tbody>
      </table>
        <div className="pagination_block">
        <Pagination
                  page={currentPage}
                  onChange={(event, newPage) => setCurrentPage(newPage)}
                  color="primary"
                  count={totalPages}
                  size="large"
                />
        </div>
    </div>
    </div>
  </div>
  </>
  </div>
  </div>
   : <Loader/>}
  </>
  )
}
