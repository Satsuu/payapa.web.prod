import { useState } from "react";
import { auth, firestore } from "../services/Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useUser } from "../services/UserContext";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setCurrentUser } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const userId = user.uid;

      // Check if a document exists in Firestore with documentId equal to userId
      const userDocRef = doc(firestore, "authentication", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        console.log("User found in authentication collection:", userDoc.data());
        setCurrentUser(user);
        navigate("/user_approval");
      } else {
        console.log(
          "No document found with matching uid in authentication collection."
        );
        toast.error("User not found in authentication collection");
      }
    } catch (error) {
      toast.error("Admin Permission Needed");
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
  };
};

export default useLogin;
