import { useState } from "react";
import { firestore } from "../services/Firebase";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const useAppointmentHistory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveAppointmentHistory = async (appointmentHistoryData) => {
    setLoading(true);
    setError(null);

    try {
      const appointmentHistoryRef = collection(firestore, "appointmentHistory");

      // fullName is already included in appointmentHistoryData
      await addDoc(appointmentHistoryRef, appointmentHistoryData);

      toast.success("Appointment history saved successfully!");
      return true;
    } catch (err) {
      setError(err);
      toast.error("Failed to save appointment history. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { saveAppointmentHistory, loading, error };
};

export default useAppointmentHistory;
