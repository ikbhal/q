
//https://socket.io/docs/v3/emitting-events/
import './App.css';
import {useState, useEffect} from 'react';
import socketIOClient from "socket.io-client";
import { IoHourglassOutline } from 'react-icons/io5';
const ENDPOINT = "http://127.0.0.1:4001";
var socket = null;

var qres = null;
function App() {

  var [isStarted, setStart] = useState(false);
  var [q, setq] =useState('10*10?');
  var [a, seta] = useState('20');
  var [ua, setua] = useState('');
  var [m, setm] = useState('');
  var [isUserAnswered, setUserAnswered] = useState(false);
  var [timeLeft, setTimeLeft] = useState(10);// 20 seconds
  var [name, setName] = useState('');
  var [intervalObj, setIntervalObj] = useState(null);
  var [testMessage, setTestMessage] = useState('');
  // update meta tags 
  useEffect(() => {
    document.head.innerHTML+=`
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
    `;
    socket = socketIOClient(ENDPOINT,{ transports: ['websocket'] });
    socket.on('userExists', function(data){
      setTestMessage(data);
    });
    socket.on('userSet', function(data){
        var user = data.username;
        setTestMessage('username was set accepted from server is ' + user)
    });

    socket.on('start_test_response', data => {
      console.log('received start test response message data,', data);
      qres = data;
      var q = data.q;
      var a = data.a;
      seta(a);
      setq(q);

      resetTest();
      startTest();
    });

  }, []);

  const updateTimeLeft = () => {
    // console.log("inside update time left");
    setTimeLeft(t => {
      t-= 1;
      // console.log("tl:", t, typeof(t))
      if(t <=0){
        console.log("time out");
        setm('Timeout');
        setua('timeout');
        setUserAnswered(true);
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
   
    socket.emit('start_test');
  }

  const startTest = () =>{
    console.log("start test");
    setStart(true);
    var iobj = setInterval(updateTimeLeft, 1000);// 1/10 second
    setIntervalObj(iobj);

    // call backend to start start
    // socket.emit("start_test");
  }
  const onSubmit= () =>{
    console.log("inside onClick submit")
    if(ua == a){
      setm('Right');
    }else{
      setm('Wrong');
    }
    setUserAnswered(true);

    setIntervalObj(iob => {
      //clear interval
      clearInterval(iob);
      return null;
    })
  }
  const onTryAgain = () =>{
    console.log("ontryagain");

    
    resetTest();
    startTest();
  }
  const resetTest =() =>{
    console.log("reset test");
    if(qres !=null &&'a' in qres){
      seta(qres.a);
    } else {
      seta('20');//hard code answer need to change
    }

    if(qres !=null && 'q' in qres){
      setq(qres.q);
    }else{
      setq('10+10?');
    }
    setua('');
    setm('');
    setTimeLeft(10);
    setUserAnswered(false);

    setIntervalObj(iob => {
      //clear interval
      clearInterval(iob);
      return null;
    });
  }
  const sendNameToSever = (name) =>{
    console.log('sendName to server name:', name);
    socket.emit('setUsername', name);
  }

  const nextQuestion = () =>{
    console.log("next question");
    socket.emit('start_test');   
  }
  return (
    <div className="App">
      <div id="test-message">
        {testMessage}
      </div>
      {!isStarted && <button onClick={onStartClick}>Start</button>}
      {isStarted && 
        <div className="q">
          <h1>Q</h1>
          <h2>{q}</h2>
          <h3>{m}</h3>

          {!isUserAnswered &&
            <div className="ua">
              <input type="number" name="a" id="a" 
                value={ua}
                onChange={e=> setua(e.target.value)}
              />
              <br/>
              <button onClick={onSubmit}><IoHourglassOutline/>{timeLeft>0 ?timeLeft : ''} Submit</button> 

            </div>
          }
          { isUserAnswered && <button onClick={onTryAgain}>Try Again</button>}
          <button onClick={nextQuestion}>Next Q</button>
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
