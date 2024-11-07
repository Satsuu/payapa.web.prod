import { useState, useEffect } from "react";
import { firestore } from "../services/Firebase";
import { doc, getDoc } from "firebase/firestore";

function useFetchScheduledAppointment(selectedUserId) {
  const [scheduledAppointment, setScheduledAppointment] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // console.log("=== Fetch Process Started ===");
    // console.log("Current selectedUserId:", selectedUserId);

    const fetchScheduledAppointment = async () => {
      if (!selectedUserId) {
        // console.log("No user selected, clearing appointments");
        setScheduledAppointment([]);
        return;
      }

      try {
        // console.log("Fetching appointments for user:", selectedUserId);
        const appointmentRef = doc(
          firestore,
          "scheduledAppointments",
          selectedUserId
        );
        const docSnap = await getDoc(appointmentRef);

        if (docSnap.exists()) {
          const appointmentData = {
            id: docSnap.id,
            ...docSnap.data(),
          };
          // console.log("Fetched appointment:", appointmentData);
          setScheduledAppointment([appointmentData]);
        } else {
          // console.log("No appointment found for this user");
          setScheduledAppointment([]);
        }
      } catch (err) {
        // console.error("Error fetching appointments:", err);
        setError(err);
      }
    };

    fetchScheduledAppointment();
  }, [selectedUserId]);

  return { scheduledAppointment, error };
}

export default useFetchScheduledAppointment;
