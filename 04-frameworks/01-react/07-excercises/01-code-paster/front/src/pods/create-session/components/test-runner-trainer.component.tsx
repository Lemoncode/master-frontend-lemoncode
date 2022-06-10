import * as React from 'react';
import { createRoom } from './test-runner-trainer.api';
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

export const TestRunnerTrainerComponent = () => {
  const { log, appendToLog } = useLog();
  const [socket, setSocket] = React.useState<SocketIO.Socket>(null);

  const handleConnection = async () => {
    // Http ask server to obtain a room name plus trainer token
    const response = await createRoom();
    console.log(response);
    appendToLog(response.room);
    appendToLog(response.trainerToken);

    // Connect to socket
    const localSocket = createSocket({
      room: response.room,
      trainertoken: response.trainerToken,
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

  const fireTestRunner = () => {
    handleConnection();
  };

  const handleAppendRandomText = () => {
    const mytext = 'this is a boring line :)';
    socket.emit(SocketOuputMessageLiteral.MESSAGE, {
      type: SocketEmitMessageTypes.TRAINER_APPEND_TEXT,
      payload: mytext,
    });
  };

  return (
    <>
      <h3>Test Runner Trainer</h3>
      <button onClick={fireTestRunner}>Create Connection Trainer</button>
      <button onClick={handleAppendRandomText}>Append Random Text</button>
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
