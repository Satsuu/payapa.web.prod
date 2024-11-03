import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { firestore } from "../services/Firebase";

// Custom hook to fetch appointments and matching user data
const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointmentsWithUsers = async () => {
      try {
        const appointmentsCollection = collection(firestore, "appointments");
        const appointmentSnapshot = await getDocs(appointmentsCollection);

        const appointmentsWithUsers = await Promise.all(
          appointmentSnapshot.docs.map(async (appointmentDoc) => {
            const appointmentId = appointmentDoc.id;
            const appointmentData = appointmentDoc.data();

            console.log("Appointment Data:", appointmentData);

            // Try to fetch the matching user by document ID
            const userDocRef = doc(firestore, "users", appointmentId); // Assuming user doc id is same as appointment id
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              const userData = userDoc.data();
              console.log("Fetched User Data:", userData);

              return {
                id: appointmentId,
                ...appointmentData,
                user: {
                  uid: userDoc.id,
                  firstName: userData.firstName,
                  lastName: userData.lastName,
                  email: userData.email,
                  reasonForStress:
                    appointmentData.reasonForStress ||
                    "No reason for stress provided",
                },
              };
            } else {
              return {
                id: appointmentId,
                ...appointmentData,
                user: null, // No matching user found
              };
            }
          })
        );

        setAppointments(appointmentsWithUsers);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentsWithUsers();
  }, []);

  return { appointments, loading, error };
};

export default useAppointments;
