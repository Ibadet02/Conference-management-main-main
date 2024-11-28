import { useEffect, useState } from "react";
import { AuthorUserDataType } from "../types/Form/registration/Author/types";
import useAuthentication from "./useAuthentication";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { UserDataProps } from "../types/hooks/types";

const useGetAdminData = (): UserDataProps => {
  const [userData, setUserData] = useState<AuthorUserDataType>(
    {} as AuthorUserDataType
  );
  const [userDataLoading, setUserDataLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  const authUser = useAuthentication();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setUserDataLoading(true);

        const authUid = userId;
        if (!authUid) {
          setUserDataLoading(false);
          return;
        }

        const authorUserDocRef = doc(db, "adminUsers", authUid);
        const unsubscribe = onSnapshot(authorUserDocRef, (snapshot) => {
          if (snapshot.exists()) {
            const userDataFromSnapshot = snapshot.data() as AuthorUserDataType;
            setUserData(userDataFromSnapshot);
          }
          setUserDataLoading(false);
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        setUserDataLoading(false);
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [authUser]);

  return { userData, loading: userDataLoading, userId }; // Include userId in the returned object
};

export default useGetAdminData;
