import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

const Notification = () => {
  const dispatch = useDispatch();
  const { message, type } = useSelector((state) => state.notification);

  if (!message) return null;

  return (
    <div className={`notification ${type}`}>
      {message}
      <button onClick={() => dispatch({ type: 'CLEAR_NOTIFICATION' })}>
        ×
      </button>
    </div>
  );
};

export default Notification;