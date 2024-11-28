import { useEffect, useState } from "react";
import { AuthorUserDataType } from "../types/Form/registration/Author/types";
import useAuthentication from "./useAuthentication";
import { UserDataProps } from "../types/hooks/types";
import { getData } from "./axiosPool";

const useGetReviewerData = (): UserDataProps => {
  const [userData, setUserData] = useState<AuthorUserDataType>(
    {} as AuthorUserDataType
  );
  const [userDataLoading, setUserDataLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const authUser = useAuthentication();
  const getReviewForASubmission = async (submissionId: number) => {
    try {
      const reviewResponse = await getData(
        `/submissions/${submissionId}/${userId}`
      );
      console.log("reviewResponse", reviewResponse);
      return reviewResponse?.review;
    } catch (error) {
      console.error("Error fetching review data:", error);
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setUserDataLoading(true);

        if (!userId) {
          setUserDataLoading(false);
          return;
        }

        const reviewerResponse = await getData(`/reviewers/${userId}`);
        setUserData(reviewerResponse?.reviewer);

        setUserDataLoading(false);
      } catch (error) {
        setUserDataLoading(false);
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [authUser]);

  return {
    userData,
    loading: userDataLoading,
    userId,
    userDataLoading,
    getReviewForASubmission,
  }; // Include userId in the returned object
};

export default useGetReviewerData;
