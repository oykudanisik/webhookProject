import './App.css';
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Input from '@mui/material/Input';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
var axios = require('axios');

function App() {
  const [jotformForms, setJotformForms] = useState([]);
  const [selectedJotformForm, setSelectedJotformForm] = useState();
  const [jotformAPI, setJotformAPI] = useState('');
  const [formStatus, setFormStatus] = useState(true);
  const [formUsername, setFormUsername] = useState('');
  const [formWebhooks, setFormWebhooks] = useState({});
  const [webhookURL, setWebhookURL] = useState('');
  const [webhookRequestSecret, setWebhookRequestSecret] = useState('');
  const [webhookRequestHeaderName, setWebhookRequestHeaderName] = useState('');
  const [webhookLabel, setWebhookLabel] = useState('');
  const [allowWebhook, setAllowWebhook] = useState(false);
  const [selectedWebhookHistory, setSelectedWebhookHistory] = useState();
  const [dataSent, setDataSent] = useState('');
  const [dataRecieved, setDataRecieved] = useState('');
  const [selectedWebhookId, setSelectedWebhookId] = useState('');
  
  
  const getJotformForm = 'https://o-danisik.jotform.dev/intern-api/get-jotform-forms';
  const getFormWebhooks = 'https://o-danisik.jotform.dev/intern-api/form-webhooks';


  //
  // FULL-SCREEN DIALOG 
  //
  const handleClickOpen = (e) => {
    setOpen(true);
    console.log("e", e);
    setSelectedWebhookHistory(e);
    getWebhookHistoryDetailsFunction();
  };
  const [open, setOpen] = React.useState(false);
  
  const handleClose = () => {
    setOpen(false);
  };
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
 
  function FullScreenDialog() {
    return (
      <div>
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Webhook Id: {selectedWebhookId}
              </Typography>
            </Toolbar>
          </AppBar>
          <List>
            <ListItem button>
              <ListItemText primary="Data Sent" secondary={dataSent}/>
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemText
                primary="Data Recieved"
                secondary={dataRecieved}
              />
            </ListItem>
          </List>
        </Dialog>
      </div>
    );
  }


  //
  // GET THE FORMS AFTER THE JOTFORM API IS ENTERED
  //
  useEffect(()=>
    async function getJotformForms() {
    let jotformFormsArray = [];
    fetch(getJotformForm, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body : JSON.stringify({jotformAPI: jotformAPI})
    })
    .then(response => response.json())
    .then(data => {
      console.log("data",data)
        data.data.map(d =>{
            console.log(d)
            jotformFormsArray.push(d);
        })
        setJotformForms(jotformFormsArray);
    })
  },[jotformAPI]);

  //
  // GETTING THE EXISTING WEBHOOKS USING WEBHOOKS AND WEBHOOK_SETTINGS
  //

  useEffect(()=>
    async function getFormWebhooks() {
      let obj = {};
      let obj2 = {};

      let webhooks = [];
      var config = {
        method: 'post',
        url: 'https://o-danisik.jotform.dev/intern-api/form-webhooks',
        data: {
          selectedJotformForm: selectedJotformForm
        }
      };

      axios(config)
      .then(function (response) {
        console.log("DATA",response.data);
        response.data.content.map(d =>{
          let key = d.setting;
          let value = d.value;
          console.log("key",key);
          console.log("value",value);
          obj2[key] = value;
          console.log("obj 2", obj2);
          obj[d.webhook_id] = obj2;
          console.log(obj);
          webhooks.push(d);
        })
        setFormWebhooks(obj);
      })
      .catch(function (error) {
        console.log(error);
      });

  },[selectedJotformForm]);

  async function getWebhookHistoryDetailsFunction() {
    var config = {
      method: 'post',
      url: 'https://o-danisik.jotform.dev/intern-api/webhook-runs',
      data: {
        selectedWebhookHistory: selectedWebhookHistory
      }
    };

    axios(config)
    .then(function (response) {
      console.log("DATA",response.data.content);
      response.data.content.map(d =>{
        let data_recieved = d.data_recieved;
        let data_sent = d.data_sent;
        console.log("data_recieved",JSON.parse(data_recieved));
        console.log("data_sent",JSON.parse(data_sent)); 
        setDataSent(data_sent);
        setDataRecieved(data_recieved);
        setSelectedWebhookId(d.webhook_id);
      })
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  //
  // ADDING A NEW WEBHOOK
  //
  const addNewWebhook=()=>{
    let settingsObject = {
      webhookURL: webhookURL,
      webhookRequestSecret: webhookRequestSecret,
      webhookRequestHeaderName:webhookRequestHeaderName,
      webhookLabel:webhookLabel,
    };

    var config = {
      method: 'post',
      url: 'https://o-danisik.jotform.dev/intern-api/webhook',
      data: {
        settingsObject: settingsObject,
        selectedJotformForm: selectedJotformForm,
        webhook_id : Math.floor(Math.random() * 1000000),
        username:"oyku",
        status: false
      }
    };

    axios(config)
    .then(function (response) {
      let resp = JSON.stringify(response);
      let res = JSON.parse(resp);
      console.log("res", res);

    })
    .catch(function (error) {
      console.log(error);
    });
  }

  //
  // ONCHANGE FUNCTIONS
  //

  const handleSelect=(e)=>{
    console.log("e", e.target.value);
    setSelectedJotformForm(e.target.value);
  }

  const allowWebhookAdding =(e)=>{
    console.log("truefalse",e)
    setAllowWebhook(!e);
  }
  
  const getWebhookHistoryDetails = (e) =>{
    console.log("e", e);
    setSelectedWebhookHistory(e);
  }

  return (
    <div className="App">
      <Input onChange={event => setJotformAPI(event.target.value)}  type="text" name="name" placeholder='Jotform API Key'/>
      <div><br></br>
      <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Select Form" onChange = {handleSelect}>
         <MenuItem value = "Select Form">Select Form</MenuItem>
          {jotformForms.map(jotformForm =>{
            if(jotformForm.status !== "DELETED"){
              return (
                <MenuItem value = {jotformForm.id}>{jotformForm.title}</MenuItem>
              )
            }
          })}
      </Select>
      </div>      
      <br></br>
      <FullScreenDialog/>
      {selectedJotformForm != null ?
          Object.entries(formWebhooks).map((key, value) => {
          return (
            <Card sx={{ maxWidth: 345 }} height="140" variant="outlined">
              <CardContent>
              <Typography gutterBottom variant="h5" component="div">
              {key[1].webhookRequestSecret}
              </Typography>
              <Typography variant="body2" color="text.secondary">
              {key[1].webhookURL}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" onClick={event => handleClickOpen(event.target.value)}  value ={key[1].webhook_id} variant="outlined">edit</Button>
            </CardActions>
            </Card>
          )
        })
      : 'no form'}
      <br></br>
      <Button variant="outlined" onClick={event => allowWebhookAdding(event.target.value)}>Add New Webhook</Button>
      {allowWebhook ?
        <div>
          <div><Input onChange={event => setWebhookURL(event.target.value)} placeholder='URL'></Input></div><br></br>
          <div><Input onChange={event => setWebhookRequestSecret(event.target.value)} placeholder='Request Secret'></Input></div><br></br>
          <div><Input onChange={event => setWebhookRequestHeaderName(event.target.value)} placeholder='Request Header Name'></Input></div><br></br>
          <div><Input onChange={event => setWebhookLabel(event.target.value)} placeholder='Label'></Input></div><br></br>
          <Button variant="outlined" onClick={addNewWebhook}>Add Webhook</Button>
        </div>
      : ''}
    </div>
  );
}

export default App;
