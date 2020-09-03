import * as React from 'react';

export const TestRunnerStudentComponent = () => {
  const [room, setRoom] = React.useState('');
  const [log, setLog] = React.useState('');

  const fireTestRunner = () => {};

  return (
    <>
      <h3>Test Runner Student</h3>
      <label>Room</label>
      <input value={room} onChange={e => setRoom(e.target.value)} />
      <button onClick={fireTestRunner}>Test Student</button>
      <div>
        <textarea value={log} style={{ height: '200px', width: '100%' }} />
      </div>
    </>
  );
};
