import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { ProjectsContext } from "../context/ProjectsContext";

import { postData } from "./axiosPool";

const useGetUserAllType = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setUserDetails, setUserType, setUserId } =
    useContext(ProjectsContext);
  const getUser = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userDataResponse = await postData("/auth/login", {
        user_name: email,
        password,
      });

      const userRole = userDataResponse?.user?.roleType;
      localStorage.setItem("userRole", userRole);
      console.log("userDataResponse", userDataResponse, userRole);
      setUserType?.(userDataResponse?.user?.roleType);
      setUserDetails?.(userDataResponse?.user);
      setLoading(false);
      setUserId?.(userDataResponse?.user?.id);
      localStorage.setItem("userId", userDataResponse?.user?.id);
      navigate(`/${userRole}-dashboard`, {
        state: { userData: userDataResponse?.user },
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return {
    getUser,
    loading,
  };
};

export default useGetUserAllType;
