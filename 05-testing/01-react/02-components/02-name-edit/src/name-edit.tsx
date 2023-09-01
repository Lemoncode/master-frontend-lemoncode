import React from 'react';

export const NameEdit: React.FC = () => {
  const [userName, setUserName] = React.useState('');

  return (
    <>
      <h3>{userName}</h3>
      <input value={userName} onChange={e => setUserName(e.target.value)} />
    </>
  );
};
