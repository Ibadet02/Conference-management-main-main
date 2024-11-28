import { useState } from "react";
import toast from "react-hot-toast";
import { postData } from "./axiosPool";

const useCreateFinalReviews = () => {
  const [isLoading, setIsLoading] = useState(false);
  const createFinalReviews = async (paperId?: string, finalResult?: string) => {
    setIsLoading(true);
    try {
      // const docRef = await addDoc(collection(db, collectionName), reviewData);
      const response = await postData(
        `submissions/${paperId}/add-final-result`,
        { finalResult }
      );
      toast.success("Review Sent");
      console.log("final result", finalResult, response);
      setIsLoading(false);
    } catch (error) {
      console.error("Error adding document: ", error);
      setIsLoading(false);
    }
  };

  return { createFinalReviews, isLoading };
};

export default useCreateFinalReviews;
