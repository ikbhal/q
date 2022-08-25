
//https://socket.io/docs/v3/emitting-events/
import './App.css';
import {useState, useEffect} from 'react';
import socketIOClient from "socket.io-client";
import { IoHourglassOutline,IoArrowForwardSharp } from 'react-icons/io5';
import {FiCheck, FiX} from 'react-icons/fi';
import {BiPlay, BiRepeat} from 'react-icons/bi';
import {FaSave} from 'react-icons/fa';
// import {GrNext} from 'react-icons/gr';
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
  var [rightPoints, setRightPoints] = useState(0);
  var [wrongPoints, setWrongPoints] = useState(0);
  var [testMessage, setTestMessage] = useState('');
  var [tableId, setTableId] = useState('');
  var [tableMembers, setTableMembers] = useState([]);

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
        console.log("inside userSet event received , data:", data);
        var user = data.username;
        setName(user);
        setTableId(data.table.id);
        setTestMessage('username was set accepted from server is ' + user)
    });

    socket.on('member_updated', (table) =>{
      console.log("inside member_update event received table:",table);
      // if(table.id == tableId){ // only for our table, others ignore, backend change todo
        setTableMembers([...table.members ])
      // }
    })

    socket.on('start_test_response', data => {
      console.log('received start test response message data,', data);
      // debugger;
      // var resp = data;'
      // var username = data.username;
      qres = data.question;
      var q = data.q;
      var a = data.a;
      seta(a);
      setq(q);

      resetTest();
      startTest();
    });

    socket.on('test_status', data =>{
      console.log('Inside test_status event received client callback data:', data);
      //io.to(table.id).emit('test_status', {status: 'win', 'message': 'won', username});
      //socket.emit('test_status', {status: 'lose', 'message': 'right but slow'})

      // var status = data.status;
      var message = data.message;
      var username = 'username' in data ? data.username : '';

      var testStatusMessage = "";
      if(username === name){
        // same user  -> mostly win
        testStatusMessage = message;
      }else {
        testStatusMessage = "You lose the game";
      }
      setTestMessage(testStatusMessage);

    });

    //leave_table_response
    socket.on('leave_table_response', (data) =>{
      console.log("leave_table_response client callback data:", data);
      // io.to(table.id).emit('leave_table_response', {message:"left table", username})
      var username = data.username;
      // var message = data.message;

      var testMesage = username + " left  table";
      setTestMessage(testMesage);
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

        socket.emit('test_complete', {timeout:true, q, username:name});
        return 0;
      }
      return t;
    });
  }

  const onStartClick = ()=>{
    console.log("onstartclick");
   
    socket.emit('start_test', name);
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
    debugger;
    socket.emit('test_complete', {ua, q, username:name});
    if(ua === a){
      setm('Right');
      setRightPoints(p => p+1);
      
    }else{
      setm('Wrong');
      setWrongPoints(p => p+1);
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

  const leaveTable = () =>{
    console.log("inside leave table");
    socket.emit('leave_table', {username:name});
  }

  const leaveAndJoinNewTable = () =>{
    socket.emit('leave_and_join_new_table', {username: name});
  }
  return (
    <div className="App">
      <div id="test-message">
        {testMessage}
      </div>
      
      {!isStarted && <button onClick={onStartClick}><BiPlay/>Start</button>}
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
          { isUserAnswered && <button onClick={onTryAgain}>
            {/* Try Again */}
            <BiRepeat/>
          </button>}
          <button onClick={nextQuestion}>
            {/* Next Q */}
            {/* <GrNext/> */}
            <IoArrowForwardSharp/>
            </button>
        </div>
      }

      <div id="footer"
        style={{position: 'fixed', bottom: '10px', textAlign:'center', width:'100%'}}
        >
        <div className="table">
          Table id : <span className="tableid">{tableId}</span> <br/>
          <div className="table-members">
            Members: 
            {tableMembers.map((m, index) => 
                <span key={index} className="table_member">{m.username}</span>
            )}
          </div>
          <button className="leave-table" 
            onClick={leaveTable}>
            Leave Table
          </button>
          <button className="leave-table" 
            onClick={leaveAndJoinNewTable}>
            Leave and Join new Table
          </button>
        </div>
        <div className="achievements">
          <span className="rightPointsContainer pointsContainer">
          <FiCheck/>&nbsp; <span  className="right_points">{rightPoints}</span>
          </span>
          
          <span className="wrongPointsContainer pointsContainer">
             <FiX/> &nbsp; <span className="wrong_points">{wrongPoints}</span>
          </span>         
        </div>
        <input type="text" 
          name="name" 
          id="name" 
          value={name}
          onChange = {e => setName(e.target.value)}
          placeholder="Enter name"/>

        <button onClick={
          e => {
            sendNameToSever(name)
          }
        }><FaSave /></button>
      </div>
    </div>
  );
}

export default App;
