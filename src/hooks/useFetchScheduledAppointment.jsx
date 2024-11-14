import { useState, useEffect } from "react";
import { firestore } from "../services/Firebase";
import { collection, getDocs, query } from "firebase/firestore";

function useFetchScheduledAppointment(selectedUserId) {
  const [scheduledAppointment, setScheduledAppointment] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScheduledAppointment = async () => {
      if (!selectedUserId) {
        setScheduledAppointment([]);
        return;
      }

      try {
        const appointmentsRef = collection(
          firestore,
          "scheduledAppointments",
          selectedUserId,
          "appointments"
        );

        const q = query(appointmentsRef);

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setScheduledAppointment([]);
        } else {
          const appointmentsData = querySnapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }));
          setScheduledAppointment(appointmentsData);
        }
      } catch (err) {
        setError(err);
      }
    };

    fetchScheduledAppointment();
  }, [selectedUserId]);

  return { scheduledAppointment, error };
}

export default useFetchScheduledAppointment;
