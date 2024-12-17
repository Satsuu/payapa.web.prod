import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firestore } from "../services/Firebase";
import useUserDocument from "./useUserDocument";

const useAppointments = () => {
  const { userCourses, error: userError } = useUserDocument();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserEmail(user.email);
      } else {
        setCurrentUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchAppointmentsWithUsers = async () => {
      try {
        const appointmentsCollection = collection(firestore, "appointments");
        const appointmentSnapshot = await getDocs(appointmentsCollection);

        const appointmentsWithUsers = await Promise.all(
          appointmentSnapshot.docs.map(async (appointmentDoc) => {
            const appointmentId = appointmentDoc.id;
            const appointmentData = appointmentDoc.data();

            const userDocRef = doc(firestore, "users", appointmentId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              const userData = userDoc.data();
              return {
                id: appointmentId,
                ...appointmentData,
                user: {
                  uid: userDoc.id,
                  firstName: userData.firstName,
                  lastName: userData.lastName,
                  email: userData.email,
                  course: userData.course,
                  year: userData.year,
                  role: userData.role,
                  reasonForStress:
                    appointmentData.reasonForStress ||
                    "No reason for stress provided",
                  appointmentType: appointmentData.appointmentType,
                  timestamp: appointmentData.timestamp,
                },
              };
            } else {
              return { id: appointmentId, ...appointmentData, user: null };
            }
          })
        );

        setAppointments(appointmentsWithUsers);

        // Super admin bypasses filtering
        if (currentUserEmail === "super_admin@gmail.com") {
          setFilteredAppointments(appointmentsWithUsers);
        } else if (userCourses.length > 0) {
          const filtered = appointmentsWithUsers.filter((appointment) => {
            return (
              appointment.user &&
              appointment.user.course &&
              userCourses.some(
                (course) =>
                  course.toLowerCase() === appointment.user.course.toLowerCase()
              )
            );
          });
          setFilteredAppointments(filtered);
        } else {
          setFilteredAppointments(appointmentsWithUsers);
        }
      } catch (err) {
        setError(err);
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserEmail) {
      fetchAppointmentsWithUsers();
    }
  }, [userCourses, currentUserEmail]);

  return {
    appointments,
    filteredAppointments,
    loading,
    error: userError || error,
  };
};

export default useAppointments;
