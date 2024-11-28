import { useEffect, useState } from "react";
import { initialToBeReviewedStateData } from "../data/hooks/SubmittedPapersStateData";
import useGetReviewerData from "./useGetReviewerData";
import { getData } from "./axiosPool";

const useGetToBeReviewed = () => {
  const [toBeReviewedState, setToBeReviewedState] = useState(
    initialToBeReviewedStateData
  );
  const [updateData, setUpdateData] = useState(false);
  const { userData: reviewerData, loading } = useGetReviewerData();
  const roleType = localStorage.getItem("userRole");
  const getReviewsForAdmin = async () => {
    try {
      const reviewResponse = await getData(`/submissions/reviews`);
      console.log("reviewResponse", reviewResponse);
      setToBeReviewedState({
        toBeReviewed: reviewResponse?.reviews,
        loading,
        setUpdateData,
      });
      return reviewResponse?.reviews;
    } catch (error) {
      console.error("Error fetching review data:", error);
    }
  };
  useEffect(() => {
    console.log("roleType", roleType);
    if (roleType === "reviewer") {
      setToBeReviewedState({
        toBeReviewed: [
          ...(reviewerData?.assessedPapers?.reviewedPapers ?? []),
          ...(reviewerData?.assessedPapers?.toBeReviewedPapers ?? []),
        ],
        loading: false,
        setUpdateData,
      });
      return;
    } else {
      getReviewsForAdmin();
      return;
    }
  }, [reviewerData, roleType, updateData]); // Empty dependency array ensures this runs only once on mount

  return toBeReviewedState;
};

export default useGetToBeReviewed;
