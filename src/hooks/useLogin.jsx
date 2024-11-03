import { useState } from "react";
import { auth } from "../services/Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
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

      if (email === "admin@gmail.com") {
        setCurrentUser(user);
        toast.success("Logged in successfully");
        navigate("/dashboard");
      } else {
        toast.error("Admin Permission Needed");
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
