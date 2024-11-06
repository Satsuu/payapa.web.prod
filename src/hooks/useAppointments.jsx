import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { firestore } from "../services/Firebase";
import useUserDocument from "./useUserDocument";

const useAppointments = () => {
  const { userCourses, error: userError } = useUserDocument();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
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

            const userDocRef = doc(firestore, "users", appointmentId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              const userData = userDoc.data();
              console.log("Fetched User Data:", userData);

              const appointmentWithUser = {
                id: appointmentId,
                ...appointmentData,
                user: {
                  uid: userDoc.id,
                  firstName: userData.firstName,
                  lastName: userData.lastName,
                  email: userData.email,
                  course: userData.course,
                  reasonForStress:
                    appointmentData.reasonForStress ||
                    "No reason for stress provided",
                },
              };

              return appointmentWithUser;
            } else {
              return {
                id: appointmentId,
                ...appointmentData,
                user: null,
              };
            }
          })
        );

        setAppointments(appointmentsWithUsers);
        console.log("All Appointments with Users:", appointmentsWithUsers);

        if (userCourses.length > 0) {
          const filtered = appointmentsWithUsers.filter((appointment) => {
            console.log("Checking appointment:", appointment);
            console.log(
              "User course matches:",
              appointment.user?.course.toLowerCase(),
              "in",
              userCourses.map((course) => course.toLowerCase())
            );
            return (
              appointment.user &&
              userCourses.some(
                (course) =>
                  course.toLowerCase() === appointment.user.course.toLowerCase()
              )
            );
          });
          setFilteredAppointments(filtered);
          console.log("Filtered Appointments:", filtered);
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

    if (userCourses.length > 0) {
      fetchAppointmentsWithUsers();
    }
  }, [userCourses]);

  return {
    appointments,
    filteredAppointments,
    loading,
    error: userError || error,
  };
};

export default useAppointments;
