import './App.css';
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Input from '@mui/material/Input';
import Switch from '@mui/material/Switch';

var axios = require('axios');

function App() {
  const [jotformForms, setJotformForms] = useState([]);
  const [selectedJotformForm, setSelectedJotformForm] = useState();
  const [jotformAPI, setJotformAPI] = useState('');
  const [formStatus, setFormStatus] = useState(true);
  const [formUsername, setFormUsername] = useState('');
  const [formWebhooks, setFormWebhooks] = useState([]);
  const [webhookURL, setWebhookURL] = useState('');
  const [webhookRequestSecret, setWebhookRequestSecret] = useState('');
  const [webhookRequestHeaderName, setWebhookRequestHeaderName] = useState('');
  const [webhookLabel, setWebhookLabel] = useState('');
  const [allowWebhook, setAllowWebhook] = useState(false);


  const getJotformForm = 'https://o-danisik.jotform.dev/intern-api/get-jotform-forms';
  const getFormWebhooks = 'https://o-danisik.jotform.dev/intern-api/form-webhooks';

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
        console.log("DATA",response.data.content);
        response.data.content.map(d =>{
          console.log(d)
          webhooks.push(d);
        })
        setFormWebhooks(webhooks);
      })
      .catch(function (error) {
        console.log(error);
      });

  },[selectedJotformForm]);



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
    setAllowWebhook(true);
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
      </div><br></br>
      {selectedJotformForm!=null ? 
        <div>
         {formWebhooks.map(webhook =>{ 
            console.log("webhook",webhook);
              return (
                <div>
                <div value={webhook.webhook_id}>{webhook.setting} : {webhook.value}</div>
                <Switch/>
                <Button variant="outlined">Edit</Button>
                <Button variant="outlined">History</Button>
                </div>
              )
          })}
        </div>
      : ''}
      <br></br>
      <Button variant="outlined" onClick={allowWebhookAdding}>Add New Webhook</Button>
      {allowWebhook ? 
        <div>
          <div><Input onChange={event => setWebhookURL(event.target.value)} placeholder='URL'></Input></div><br></br>
          <div><Input onChange={event => setWebhookRequestSecret(event.target.value)} placeholder='Request Secret'></Input></div><br></br>
          <div><Input onChange={event => setWebhookRequestHeaderName(event.target.value)} placeholder='Request Header Name'></Input></div><br></br>
          <div><Input onChange={event => setWebhookLabel(event.target.value)} placeholder='Label'></Input></div><br></br>
          <Button variant="outlined" onClick={addNewWebhook}>Add</Button>
        </div>
      : ''}
    </div>
  );
}

export default App;
