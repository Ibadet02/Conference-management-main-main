import { Firestore } from "firebase/firestore";
import { db } from "../firebase"; // Assuming db is the Firestore instance
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { PaperAssesmentDataType } from "../types/dashboard/Reviewer/types";
import { useState } from "react";
import useAuthentication from "./useAuthentication";
import { postData } from "./axiosPool";
import useGetReviewerData from "./useGetReviewerData";

const usePaperAssessment = () => {
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const authUser = useAuthentication();
  const reviewerId = localStorage.getItem("userId");
  const { setUpdateData } = useGetReviewerData();
  const submitAssessment = async (
    formData: PaperAssesmentDataType,
    correspondingAuthor: string,
    projectId: string,
    paperId: string,
    paperUpdated: any
  ) => {
    try {
      setLoading(true);
      console.log("formData", formData);
      await postData(`/submissions/${paperId}`, {
        ...formData,
        reviewerId,
        projectId,
        correspondingAuthor: correspondingAuthor,
        paperId: paperId,
      });
      // const userRef = doc(db, "reviewerUsers", authUser.uid);
      // await updateDoc(userRef, {
      //   assessedPapers: arrayUnion({
      //     ...formData,
      //   projectId,
      //   correspondingAuthor: correspondingAuthor,
      //   paperId: paperId,
      //   paperUpdated: paperUpdated ? paperUpdated : false
      //   }),
      // });

      setLoading(false);
      setUpdateData(true);
      setSubmitted(true);
    } catch (err: any) {
      setLoading(false);
      setError(
        err.message || "An error occurred while submitting the assessment."
      );
      console.error(err);
    }
  };

  return { submitAssessment, error, submitted, loading };
};

export default usePaperAssessment;
