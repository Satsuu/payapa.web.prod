import { firestore } from "../services/Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const useNotification = () => {
  const updateNotificationStatus = async (uid) => {
    try {
      const questionRef = doc(firestore, "questions", uid);
      const questionDoc = await getDoc(questionRef);

      if (questionDoc.exists()) {
        const data = questionDoc.data();
        console.log("Current stress level:", data.stress_level);

        if (data.stress_level.toLowerCase() === "severe") {
          await updateDoc(questionRef, {
            notify: true,
          });
          toast.warning("Student is experiencing severe stress level!");
          return {
            success: true,
            message: "Student is experiencing severe stress level!",
          };
        } else {
          toast.info(
            `Student's stress level is ${data.stress_level.toLowerCase()} - no immediate action required`
          );
          return {
            success: true,
            message: `Student's stress level is ${data.stress_level.toLowerCase()}`,
          };
        }
      } else {
        toast.error("No questions document found");
        return { success: false, message: "No questions document found" };
      }
    } catch (error) {
      toast.error(`Error updating notification status: ${error.message}`);
      console.error("Error updating notification status:", error);
      return { success: false, message: error.message };
    }
  };

  return { updateNotificationStatus };
};

export default useNotification;
