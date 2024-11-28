import { useEffect, useState } from "react";
import { ProjectDataType } from "../types/dashboard/Admin/types";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { getData } from "./axiosPool";

const useGetReviewersList = () => {
  const [projectState, setProjectState] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllReviewers = async () => {
      try {
        const reviewerResponse = await getData(`/reviewers`);
        setProjectState(reviewerResponse?.reviewers);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching user data:", error);
      }
    };
    fetchAllReviewers();
  }, []); // Empty dependency array ensures this runs only once on mount

  return { reviewersList: projectState, reviewerListLoading: loading };
};

export default useGetReviewersList;
