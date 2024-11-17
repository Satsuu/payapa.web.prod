import { useState, useEffect } from "react";
import { firestore } from "../services/Firebase";
import { collection, getDocs } from "firebase/firestore";

function useFetchAppointmentHistory() {
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointmentHistory = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(firestore, "appointmentHistory")
        );
        const appointmentHistoryList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAppointmentHistory(appointmentHistoryList);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentHistory();
  }, []);

  return { appointmentHistory, loading, error };
}

export default useFetchAppointmentHistory;
