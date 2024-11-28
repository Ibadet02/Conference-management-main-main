import { useEffect, useState } from "react";
import { AuthorUserDataType } from "../types/Form/registration/Author/types";
import { UserDataProps } from "../types/hooks/types";
import { getData } from "./axiosPool";

const useUserData = (): UserDataProps => {
  const [userData, setUserData] = useState<AuthorUserDataType>(
    {} as AuthorUserDataType
  );
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null); // State for userId
  const [updateData, setUpdateData] = useState(false);
  const authUid = localStorage.getItem("userId");
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!authUid) {
          setUserDataLoading(false);
          return;
        }

        setUserId(authUid); // Set userId here
        const userResponse = await getData(`/auth/user/${authUid}`);
        setUserData(userResponse?.user);

        setUserDataLoading(false);
      } catch (error) {
        setUserDataLoading(false);
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [authUid, updateData]);

  return { userData, userDataLoading, userId, setUpdateData }; // Include userId in the returned object
};

export default useUserData;
