/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { PaperSubmissionDataType } from "../types/dashboard/Author/types";
import useAuthentication from "./useAuthentication";
import toast from "react-hot-toast";
import useNotifyAdmin from "../notify/notifyAdmin";
import useGetAuthorsData from "./useGetAuthorsData";
import {
  getAbstractsForAuthor,
  useUpdateAbstract,
  useUpdateAuthorStatus,
} from "./usePaperAbstractApproval";
import { putData } from "./axiosPool";

interface PaperSubmissionHookProps {
  paperSubmissionData: PaperSubmissionDataType;
  projectId: string; // Assuming projectId is a string
  matchedItem: any;
}
export const addReviewersToPaper = async (
  paperId: string,
  reviewers: string[]
) => {
  console.log("reviewers", reviewers);
  await putData(`/submissions/${paperId}/add-reviewers`, {
    reviewers: reviewers,
  });
};
const usePaperUpdate = ({
  paperSubmissionData,
  projectId,
  matchedItem,
}: PaperSubmissionHookProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const storage = getStorage(); // Initialize Firebase Storage
  const userId = localStorage.getItem("userId");
  const { updateAuthorStatus } = useUpdateAuthorStatus();
  const { updateAbstract } = useUpdateAbstract();
  const { authorsData } = useGetAuthorsData();

  const submitPaper = async () => {
    if (!userId) return;
    setIsSubmitting(true);
    try {
      let fileId = matchedItem?.fileId;

      // Upload PDF file to Firebase storage if it exists
      if (paperSubmissionData.file?.name) {
        const storageRef = ref(
          storage,
          `user_papers/${userId}/${projectId}/${paperSubmissionData.file.name}`
        );
        await uploadBytes(storageRef, paperSubmissionData.file);
        fileId = storageRef.name;
      }

      // Get the document from the "paperSubmissions" collection where userId === userId
      const submissions = await getAbstractsForAuthor();
      const exisitingAbstract = submissions.find(
        (abstract: any) => abstract?.projectId === projectId
      );
      if (exisitingAbstract?.projectId === projectId) {
        await updateAbstract(
          exisitingAbstract.id,
          {
            ...exisitingAbstract,
            fileId: fileId || exisitingAbstract?.fileId,
          },
          true
        );
      }
      const author: any = authorsData.find(
        (author: any) => author?.authorId === userId
      );
      await updateAuthorStatus(userId, author?.myStatus, 3);

      toast.success("Sent");
      setIsSubmitting(false);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setIsSubmitting(false);
    }
  };

  return { submitPaper, isSubmitting, error };
};
export default usePaperUpdate;
