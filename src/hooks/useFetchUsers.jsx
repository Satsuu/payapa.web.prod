import { useState, useEffect } from "react";
import { firestore } from "../services/Firebase";
import { collection, getDocs } from "firebase/firestore";

function useFetchUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvedCounts, setApprovedCounts] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "users"));
        const usersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched Users:", usersList);
        setUsers(usersList);

        const counts = {};
        usersList.forEach((user) => {
          if (user.isApproved) {
            const course = user.course;
            const role = user.role;

            if (!counts[course]) counts[course] = { total: 0, roles: {} };
            counts[course].total++;
            counts[course].roles[role] = (counts[course].roles[role] || 0) + 1;
          }
        });
        setApprovedCounts(counts);
      } catch (err) {
        setError(err);
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error, approvedCounts };
}

export default useFetchUsers;
