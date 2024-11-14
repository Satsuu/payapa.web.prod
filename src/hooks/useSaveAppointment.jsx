import { useState } from "react";
import { firestore } from "../services/Firebase";
import { collection, addDoc } from "firebase/firestore";

const useSaveAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveAppointment = async (appointmentData) => {
    setLoading(true);
    setError(null);

    try {
      const userAppointmentsRef = collection(
        firestore,
        "scheduledAppointments",
        appointmentData.userId,
        "appointments"
      );

      await addDoc(userAppointmentsRef, {
        date: appointmentData.date,
        time: appointmentData.time,
        message: appointmentData.message,
        respond: "Pending",
      });

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
