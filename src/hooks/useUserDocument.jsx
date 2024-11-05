import { useState, useEffect } from "react";
import { firestore } from "../services/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { useUser } from "../services/UserContext";

const useUserDocument = () => {
  const { currentUser } = useUser();
  const [documentExists, setDocumentExists] = useState(false);
  const [userCourses, setUserCourses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkUserDocument = async () => {
      if (currentUser) {
        const userId = currentUser.uid;
        const userDocRef = doc(firestore, "authentication", userId);

        console.log("Checking document for userId:", userId);

        try {
          const userDoc = await getDoc(userDocRef);
          const exists = userDoc.exists();
          setDocumentExists(exists);

          if (exists) {
            const userData = userDoc.data();
            console.log(`Document exists for userId ${userId}`);

            // Get the Courses array from the document
            if (userData.Courses) {
              setUserCourses(userData.Courses); // Store courses
              console.log("Courses array:", userData.Courses);
            } else {
              console.log("No Courses array found in the document.");
            }
          } else {
            console.log(`No document found for userId ${userId}`);
          }
        } catch (err) {
          setError(err);
          console.error("Error checking document:", err);
        }
      } else {
        setDocumentExists(false);
        setError(null);
        console.log("No current user available for document check.");
      }
    };

    checkUserDocument();
  }, [currentUser]);

  return { documentExists, userCourses, error };
};

export default useUserDocument;
