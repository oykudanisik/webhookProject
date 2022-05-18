import './App.css';
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
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
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';

import SelectUnstyled, { selectUnstyledClasses } from '@mui/base/SelectUnstyled';
import OptionUnstyled, { optionUnstyledClasses } from '@mui/base/OptionUnstyled';
import PopperUnstyled from '@mui/base/PopperUnstyled';
import { styled } from '@mui/system';

import AlertDialogSlide from './components/AlertDialogSlide';
var axios = require('axios');

function App() {
  const [jotformForms, setJotformForms] = useState([]);
  const [selectedJotformForm, setSelectedJotformForm] = useState('');
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

  const blue = {
    100: '#DAECFF',
    200: '#99CCF3',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
  };
  
  const grey = {
    100: '#E7EBF0',
    200: '#E0E3E7',
    300: '#CDD2D7',
    400: '#B2BAC2',
    500: '#A0AAB4',
    600: '#6F7E8C',
    700: '#3E5060',
    800: '#2D3843',
    900: '#1A2027',
  };
  
  const StyledButton = styled('button')(
    ({ theme }) => `
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    box-sizing: border-box;
    min-height: calc(1.5em + 22px);
    min-width: 320px;
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[300]};
    border-radius: 0.75em;
    margin: 0.5em;
    padding: 10px;
    text-align: left;
    line-height: 1.5;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  
    &:hover {
      background: ${theme.palette.mode === 'dark' ? '' : grey[100]};
      border-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
    }
  
    &.${selectUnstyledClasses.focusVisible} {
      outline: 3px solid ${theme.palette.mode === 'dark' ? blue[600] : blue[100]};
    }
  
    &.${selectUnstyledClasses.expanded} {
      &::after {
        content: '▴';
      }
    }
  
    &::after {
      content: '▾';
      float: right;
    }
    `,
  );
  
  const StyledListbox = styled('ul')(
    ({ theme }) => `
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    box-sizing: border-box;
    padding: 5px;
    margin: 10px 0;
    min-width: 320px;
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[300]};
    border-radius: 0.75em;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    overflow: auto;
    outline: 0px;
    `,
  );
  
  const StyledOption = styled(OptionUnstyled)(
    ({ theme }) => `
    list-style: none;
    padding: 8px;
    border-radius: 0.45em;
    cursor: default;
  
    &:last-of-type {
      border-bottom: none;
    }
  
    &.${optionUnstyledClasses.selected} {
      background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
      color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
    }
  
    &.${optionUnstyledClasses.highlighted} {
      background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
      color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    }
  
    &.${optionUnstyledClasses.highlighted}.${optionUnstyledClasses.selected} {
      background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
      color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
    }
  
    &.${optionUnstyledClasses.disabled} {
      color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
    }
  
    &:hover:not(.${optionUnstyledClasses.disabled}) {
      background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
      color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    }
    `,
  );
  
  const StyledPopper = styled(PopperUnstyled)`
    z-index: 1;
  `;
  
  const CustomSelect = React.forwardRef(function CustomSelect(props, ref) {
    const components = {
      Root: StyledButton,
      Listbox: StyledListbox,
      Popper: StyledPopper,
      ...props.components,
    };
    return <SelectUnstyled {...props} ref={ref} components={components} />;
});
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
                secondary={JSON.stringify(dataRecieved, null, "\t")}
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
        response.data.content.forEach(dat => {
          dat.map(d =>{
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
          obj2=[];

          setFormWebhooks(obj);
        })
      })
      .catch(function (error) {
        console.log(error);
      });

  },[selectedJotformForm]);

  //
  // DETAILS OF THE WEBHOOK DATA SENT DATS RECIEVED (WEBHOOK_RUNS)
  // 

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
      if(response.data.content.length == 0){
        setDataSent('data_sent');
        setDataRecieved('data_recieved');
        setSelectedWebhookId('d.webhook_id');
      } else{
        response.data.content.map(d =>{
          let data_recieved = d.data_recieved;
          let data_sent = d.data_sent;
          console.log("data_recieved",JSON.parse(data_recieved));
          console.log("data_sent",JSON.parse(data_sent)); 
          setDataSent(data_sent);
          setDataRecieved(data_recieved);
          setSelectedWebhookId(d.webhook_id);
        })
      }
      
    })
    .catch(function (error) {
      console.log(error);
    });
  }


  //
  // ADDING A NEW WEBHOOK
  //
  const addNewWebhook = () =>{
    var formEl = document.forms.webhookData;
    var formData = new FormData(formEl);

    var webhookURL = formData.get('webhookURL');
    var webhookRequestSecret = formData.get('webhookRequestSecret');
    var webhookRequestHeaderName = formData.get('webhookRequestHeaderName');
    var webhookLabel = formData.get('webhookLabel');

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
    console.log("truefalse",e);
    setAllowWebhook(!e);
  }
  
  const setJotfromAPIFunction = (e) =>{
    console.log("event", e.target.value);
    setJotformAPI(e.target.value);
  }
  const TransitionWebhook = React.forwardRef(function TransitionWebhook(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  const [openWebhook, setOpenWebhook] = React.useState(false);

  const handleClickOpenWebhook = (e) => {
    setOpenWebhook(true);
    allowWebhookAdding(e.target.value);
  };

  const handleCloseWebhook = () => {
    setOpenWebhook(false);
  };
  function PaperComponent(props) {
    return (
      <Draggable
        handle="#draggable-dialog-title"
        cancel={'[class*="MuiDialogContent-root"]'}
      >
        <Paper {...props} />
      </Draggable>
    );
  }

  return (
    <div className="App">
      <br></br>
      {/* PROBLEM IS THIS PART setJotfromAPIFunction FUNCTION DOESNT UPDATE THE STATE IMMEDIATELY */}
      <TextField onChange={setJotfromAPIFunction} label="Jotform API Key" type="text" name="name" placeholder='Jotform API Key'/>
      <div><br></br>
      <InputLabel id="demo-simple-select-label">Select Form</InputLabel>
      <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Select" onChange = {handleSelect}>
         <MenuItem  value = "Select Form">Select Form</MenuItem>
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
            console.log(key[0]);
          return (
            <div display="block" marginLeft="auto">
            <Card  sx={{maxWidth: 600 }} variant="outlined">
              <CardContent>
              <Typography gutterBottom variant="h5" component="div">
              {key[1].webhookURL}
              </Typography>
              <Typography variant="body2" color="text.secondary">
              {key[1].webhookLabel}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" onClick={event => handleClickOpen(event.target.value)}  value ={key[0]} variant="outlined">HISTORY</Button>
            </CardActions>
            </Card>
            </div>
          )
        })
      : ''}
      <br></br>
      {selectedJotformForm != null ?
       <div>
      <Button variant="outlined" onClick={handleClickOpenWebhook}>
        Add New Webhook
      </Button>
      <Dialog
        open={openWebhook}
        onClose={handleCloseWebhook}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Add New Webhook
        </DialogTitle>
        <DialogContent>
          <form action="" method="post" id="webhookData">
          <TextField id = "webhookURL" name = "webhookURL"  placeholder='URL'></TextField><br></br>
          <TextField id = "webhookRequestSecret" name = "webhookRequestSecret" placeholder='Request Secret'></TextField><br></br>
          <TextField id = "webhookRequestHeaderName" name = "webhookRequestHeaderName" placeholder='Request Header Name'></TextField><br></br>
          <TextField id = "webhookLabel" name = "webhookLabel" placeholder='Label'></TextField><br></br>
          </form>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleCloseWebhook}>Cancel</Button>
        <Button type = "submit" variant="outlined" onClick={addNewWebhook}>Add Webhook</Button>
        </DialogActions>
      </Dialog>
    </div>
    : ''}
    </div>
  );
}

export default App;
