import { useEffect, useState } from "react";
import { getData } from "./axiosPool";

const useGetFinalReviews = () => {
  const [projectState, setProjectState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateData, setUpdateData] = useState(false);
  const getAllReviews = async () => {
    try {
      setLoading(true);
      const reviewResponse = await getData(`/submissions//final-reviews`);
      console.log("final reviews Response", reviewResponse);
      setProjectState(reviewResponse?.reviews);
      setLoading(false);
      return reviewResponse?.reviews;
    } catch (error) {
      console.error("Error fetching review data:", error);
    }
  };
  useEffect(() => {
    getAllReviews();
  }, [updateData]); // Empty dependency array ensures this runs only once on mount

  return {
    finalReviews: projectState,
    finalReviewsLoading: loading,
    setUpdateData,
  };
};

export default useGetFinalReviews;
