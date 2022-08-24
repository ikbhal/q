import logo from './logo.svg';
import './App.css';
import {useState} from 'react';
function App() {
  const onStartClick = ()=>{
    console.log("onstartclick");
    setStart(true)
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
    seta(false);
    setua('');
    setm('');
    setUserAnswered(false)
  }
  var [isStarted, setStart] = useState(false);
  var [a, seta] = useState('20');
  var [ua, setua] = useState('');
  var [m, setm] = useState('');
  var [isUserAnswered, setUserAnswered] = useState(false);
  return (
    <div className="App">
      {!isStarted && <button onClick={onStartClick}>Start</button>}
      {isStarted && 
        <div className="q">
          <h1>Q</h1>
          <h2>10+10?</h2>
          <h3>{m}</h3>

          {!isUserAnswered &&
            <div className="ua">
              <input type="number" name="a" id="a" 
                value={ua}
                onChange={e=> setua(e.target.value)}
              />
              <button onClick={onClick}>Submit</button> 
            </div>
          }
          { isUserAnswered && <button onClick={onTryAgain}>Try Again</button>}
        </div>
      }
    </div>
  );
}

export default App;
