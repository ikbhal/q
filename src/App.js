
import './App.css';
import {useState, useEffect} from 'react';
function App() {

  // update meta tags 
  useEffect(() => {
    document.head.innerHTML+=`
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
    `
  }, []);

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
    seta('20');
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
              <br/>
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
