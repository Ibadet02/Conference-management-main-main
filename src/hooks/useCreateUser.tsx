// import { collection, addDoc } from "firebase/firestore";
// import { db } from "../firebase";
// import { RoleType } from "../data/pages/Form/registration/InitialRegisterFormData";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { useNavigate } from "react-router-dom";

// const useCreateUser = (userData: object, userRole: RoleType) => {
//   const navigate = useNavigate();
//   const createUser = async (auth: any, email: string, password: string) => {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );

//       const authUid = userCredential.user.uid;

//       const usersCollectionRef = collection(db, `${userRole}Users`);
//       if (userRole === "author") {
//         await addDoc(usersCollectionRef, {
//           ...userData,
//           authUid,
//           appliedProjects: [],
//         });
//       } else {
//         await addDoc(usersCollectionRef, { ...userData, authUid });
//       }

//       navigate(`/${userRole}-dashboard`, { state: userData });
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return {
//     createUser,
//   };
// };

// export default useCreateUser;

import { RoleType } from "../data/pages/Form/registration/InitialRegisterFormData";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { ProjectsContext } from "../context/ProjectsContext";

import { postData } from "./axiosPool";

const useCreateUser = (userData: object, userRole: RoleType) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setUserDetails } = useContext(ProjectsContext);

  const createUser = async (email: string, password: string) => {
    try {
      setLoading(true);
      setUserDetails(userData);
      const res = await postData("auth/register", {
        ...userData,
        user_name: email,
        password,
        type: userRole,
      });
      toast.success(res?.message);
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("userId", res?.userId);
      navigate(`/${userRole}-dashboard`, { state: userData });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return {
    createUser,
    loading,
  };
};

export default useCreateUser;
