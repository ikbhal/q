
import './App.css';
import {useState, useEffect} from 'react';
import socketIOClient from "socket.io-client";
import Qsc from './components/Qsc';
import Hello from './components/Hello';
//D:\git_tauqeer\jigs\q\src\components\sc.js
import { IoHourglassOutline } from 'react-icons/io5';

const ENDPOINT = "http://127.0.0.1:4001";
var socket = null;
//IoHourglassOutline
function App() {


  /*
 useEffect(() => {
    //{ transports: ['websocket'] }
    const socket = socketIOClient(ENDPOINT,{ transports: ['websocket'] });
    socket.on("FromAPI", data => {
      setResponse(data);
    });

    //https://socket.io/docs/v3/emitting-events/

    //socket.emit("hello", "world");

    // socket.on('start_test_reponse', data => {
    //   console.log("start test response data: ", data);
    // });
  }, []);
  */

  //  var socket=null;
  // update meta tags 
  useEffect(() => {
    document.head.innerHTML+=`
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
    `;

  
    socket = socketIOClient(ENDPOINT,{ transports: ['websocket'] });
    // socket.on("FromAPI", data => {
    //   setResponse(data);
    // });

    socket.on('userExists', function(data){
      // document.getElementById('error-container').innerHTML = data;
      setErr(data);
   });
   socket.on('userSet', function(data){
      var user = data.username;
      // document.body.innerHTML = '<input type="text" id="message">\
      // <button type="button" name="button" onclick="sendMessage()">Send</button>\
      // <div id="message-container"></div>';
      // setm();
      setTestMessasge('username was set accepted from server is ' + user)
   });

    //https://socket.io/docs/v3/emitting-events/

    //socket.emit("hello", "world");

    socket.on('start_test_reponse', data => {
      debugger;
      console.log("start test response data: ", data);
      var q = data.q;
      var a = data.a;
      seta(a);
      setq(q);
    });
  }, []);

  const updateTimeLeft = () => {
    // console.log("inside update time left");
    setTimeLeft(t => {
      t-= 1;
      // console.log("tl:", t, typeof(t))
      if(t <=0){
        // debugger;
        console.log("time out");
        setm('Timeout');
        setua('timeout');
        setUserAnswered(true);
  
        // clear Interval
        setIntervalObj(iob => {
          //clear interval
          clearInterval(iob);
          return iob;
        })
        return 0;
      }
      return t;
    });
   
  }

  const onStartClick = ()=>{
    console.log("onstartclick");
    setStart(true);
    var iobj = setInterval(updateTimeLeft, 1000);// 1/10 second
    setIntervalObj(iobj);

    // call backend to start start
    socket.emit("start_test");// send user details later 
  }
  const onClick= () =>{
    console.log("inside onClick submit")
    if(ua == a){
      setm('Right');
    }else{
      setm('Wrong');
    }
    setUserAnswered(true);
  }
  const onTryAgain = () =>{
    console.log("ontryagain");
    resetTest()
  }
  const resetTest =() =>{
    console.log("reset test");
    seta('20');
    setua('');
    setm('');
    setUserAnswered(false)
  }

  const sendNameToSever = (name) =>{
    console.log('sendName to server name:', name);
    socket.emit('setUsername', name);
  }

  
  var [isStarted, setStart] = useState(false);
  var [q, setq] =useState('10*10?');
  var [a, seta] = useState('20');
  var [ua, setua] = useState('');
  var [m, setm] = useState('');
  var [isUserAnswered, setUserAnswered] = useState(false);
  var [timeLeft, setTimeLeft] = useState(10);// 20 seconds
  var [name, setName] = useState('');
  var [intervalObj, setIntervalObj] = useState(null);
  var [err, setErr] = useState('');
  var [testMessage, setTestMessasge] = useState('');

  const [response, setResponse] = useState("");
  return (
    <div className="App">
      {/* <Qsc/> */}
      {/* <Hello/> */}

      <div id="errors">
        {err}
      </div>
      <div id="test-message">
        {testMessage}
      </div>

      {!isStarted && <button onClick={onStartClick}>Start</button>}
      {isStarted && 
        <div className="q">
          <h1>Q</h1>
          <h2>{q}</h2>
          <h3>Message: {m}</h3>

          {!isUserAnswered &&
            <div className="ua">
              <input type="number" name="a" id="a" 
                value={ua}
                onChange={e=> setua(e.target.value)}
              />
              <br/>
              <button onClick={onClick}><IoHourglassOutline/>{timeLeft>0 ?timeLeft : ''} Submit</button> 

            </div>
          }
          { isUserAnswered && <button onClick={onTryAgain}>Try Again</button>}
        </div>
      }

      <div id="footer"
        style={{position: 'fixed', bottom: '10px', textAlign:'center', width:'100%'}}
        >
        <input type="text" 
          name="name" 
          id="name" 
          onChange = {e => setName(e.target.value)}
          placeholder="Enter name"/>

        <button onClick={
          e => {
            sendNameToSever(name)
          }
        }>Set Name</button>
      </div>
    </div>
  );
}

export default App;
