import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../services/Firebase";

const useStatus = () => {
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const fetchDetectedLabels = async () => {
      try {
        const detectedStatusCollection = collection(
          firestore,
          "detected_labels"
        );
        const statusSnapshot = await getDocs(detectedStatusCollection);

        // Extract only the labels
        const labelsData = statusSnapshot.docs.map((doc) => ({
          id: doc.id,
          label: doc.data().label, // Only getting the label
        }));

        console.log("Detected Labels:", labelsData); // Log to verify data structure
        setLabels(labelsData);
      } catch (error) {
        console.error("Error fetching detected labels: ", error);
      }
    };

    fetchDetectedLabels();
  }, []);

  return { labels };
};

export default useStatus;
