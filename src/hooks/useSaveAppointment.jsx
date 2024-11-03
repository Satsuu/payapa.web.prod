import { useState } from "react";
import { firestore } from "../services/Firebase";
import { doc, setDoc } from "firebase/firestore";

const useSaveAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveAppointment = async (appointmentData) => {
    setLoading(true);
    setError(null);

    try {
      const userDoc = doc(
        firestore,
        "scheduledAppointments",
        appointmentData.userId
      );

      await setDoc(
        userDoc,
        {
          date: appointmentData.date,
          time: appointmentData.time,
          message: appointmentData.message,
        },
        { merge: true }
      );

      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { saveAppointment, loading, error };
};

export default useSaveAppointment;
