import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../services/Firebase";

const useAverageStatus = () => {
  const [score, setScore] = useState([]);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const questionCollection = collection(firestore, "questions");
        const scoreSnapshot = await getDocs(questionCollection);

        const scoresData = scoreSnapshot.docs.map((doc) => ({
          id: doc.id,
          score: doc.data().score,
        }));

        console.log("Score: ", scoresData);
        setScore(scoresData);
      } catch (error) {
        console.error("Error fetching scores: ", error);
      }
    };

    fetchScore();
  }, []);

  return { score };
};

export default useAverageStatus;
