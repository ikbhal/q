import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

// tutorial: https://www.valentinog.com/blog/socket-react/
//https://socket.io/docs/v3/emitting-events/
const ENDPOINT = "http://127.0.0.1:4001";
function Qsc() {
  const [response, setResponse] = useState("");

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

  return (
    <p>
      It's <time dateTime={response}>{response}</time>
    </p>
  );
}

export default Qsc;