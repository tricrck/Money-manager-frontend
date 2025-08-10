import { useEffect } from 'react';
import { messaging, getToken, onMessage } from '../firebase';
import { savePushToken } from '../actions/userActions';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const VAPID_KEY = import.meta.env.VITE_VAPID_KEY;

const usePushNotifications = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const setup = async () => {
      if (!('serviceWorker' in navigator)) return;

      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        const pushToken = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (pushToken) dispatch(savePushToken(pushToken));
      } catch (err) {
        console.error('Push setup error:', err);
      }
    };

    setup();

    onMessage(messaging, (payload) => {
      const { title, body } = payload.notification || {};
      if (title && body) {
        toast.info(<div><strong>{title}</strong><div>{body}</div></div>);
      }
    });
  }, []);
};

export default usePushNotifications;
