import * as React from 'react';
import {
  createSocket,
  SocketOuputMessageLiteral,
  SocketEmitMessageTypes,
  SocketReceiveMessageTypes,
} from 'core';

const useLog = () => {
  const [log, internalSetLog] = React.useState('');
  const logRef = React.useRef('');

  const appendToLog = (value: string) => {
    const newText = `${logRef.current}\n${value} `;
    internalSetLog(newText);
    logRef.current = newText;
  };

  return { log, appendToLog, logRef };
};

export const TestRunnerStudentComponent = () => {
  const [room, setRoom] = React.useState('');
  const { log, appendToLog } = useLog();
  const [socket, setSocket] = React.useState<SocketIO.Socket>(null);

  const fireTestRunner = () => {
    // Connect to socket
    const localSocket = createSocket({
      room: room,
      trainertoken: '',
    });

    setSocket(localSocket);

    localSocket.on(SocketOuputMessageLiteral.MESSAGE, msg => {
      console.log(msg);

      if (msg.type) {
        const { type, payload } = msg;

        switch (type) {
          case SocketReceiveMessageTypes.APPEND_TEXT:
            appendToLog(payload);
            break;
        }
      }
    });
  };

  return (
    <>
      <h3>Test Runner Student</h3>
      <label>Room</label>
      <input value={room} onChange={e => setRoom(e.target.value)} />
      <button onClick={fireTestRunner}>Test Student</button>
      <div>
        <textarea
          value={log}
          readOnly
          style={{ height: '200px', width: '100%' }}
        />
      </div>
    </>
  );
};
