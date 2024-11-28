/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from "react";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { PaperSubmissionDataType } from "../types/dashboard/Author/types";
import toast from "react-hot-toast";
import { ProjectsContext } from "../context/ProjectsContext";
import { getData, postData, putData } from "./axiosPool";

interface PaperSubmissionHookProps {
  paperSubmissionData: PaperSubmissionDataType;
  projectId: string; // Assuming projectId is a string
  matchedItem: any;
}
export const useUpdateAuthorStatus = () => {
  const { userDetails } = useContext(ProjectsContext);
  const updateAuthorStatus = async (
    userId: string,
    myStatus: string,
    actualState?: number
  ) => {
    try {
      await putData(`/authors/${userId}/updateStatus`, {
        myStatus,
        actualState: actualState ?? (userDetails as any)?.actualState,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return { updateAuthorStatus };
};
export const approveOrRejectAbstract = async (
  abstractId: string,
  adminResult: object
) => {
  await putData(`/submissions/${abstractId}/adminResult`, adminResult);
};
export const useUpdateAbstract = () => {
  const updateAbstract = async (
    abstractId: string,
    abstractData: PaperSubmissionDataType,
    isAbstractUpdated?: boolean
  ) => {
    try {
      await putData(`/submissions/${abstractId}`, {
        ...abstractData,
        abstractUpdated: !isAbstractUpdated,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return { updateAbstract };
};
export const useCreateAbstract = () => {
  const createAbstract = async (abstractData: PaperSubmissionDataType) => {
    try {
      await postData(`/submissions`, abstractData);
    } catch (error) {
      console.log(error);
    }
  };
  return { createAbstract };
};
export const getAbstractsForAuthor = async () => {
  const userId = localStorage.getItem("userId");
  const abstractsRes = await getData(`/submissions/${userId}`);
  return abstractsRes?.submissions;
};
const usePaperAbstractApproval = ({
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
  const { createAbstract } = useCreateAbstract();
  // Update the "submittedPapers" field in the "authorUsers" collection

  const submitAbstract = async () => {
    setIsSubmitting(true);
    try {
      console.log("userId", userId);
      if (userId) {
        let fileId = (matchedItem as any)?.fileId;

        // Upload PDF file to Firebase storage if it exists
        if (paperSubmissionData.file?.name) {
          const storageRef = ref(
            storage,
            `user_papers/${userId}/${projectId}/${paperSubmissionData.file.name}`
          );
          await uploadBytes(storageRef, paperSubmissionData.file);
          fileId = storageRef.name;
          console.log("File uploaded successfully", fileId);
        }

        // Get the document from the "paperSubmissions" collection where userId === authUser.uid
        const abstracts = await getAbstractsForAuthor();

        let updated = false; // Initialize flag to track if any document was updated

        const exisitingAbstract = abstracts.find(
          (abstract: any) => abstract?.projectId === projectId
        );
        console.log("exisitingAbstract", exisitingAbstract, projectId);
        if (exisitingAbstract) {
          updated = true;
          console.log("FOUND", exisitingAbstract?.projectId, projectId);
          if (exisitingAbstract?.projectId === projectId) {
            console.log("FOUND");
            updated = true;
            await updateAbstract(exisitingAbstract?.id, {
              ...paperSubmissionData,
              abstractUpdated: true,
              projectId: projectId,
              correspondingAuthor: userId,
            }); // Set flag to true
            await updateAuthorStatus(userId, "abstract updated", 1);
          }
        }

        if (!updated) {
          await createAbstract({
            ...paperSubmissionData,
            projectId: projectId,
            correspondingAuthor: userId,
          });
          await updateAuthorStatus(userId, "abstract sent", 1);
        }

        // Create the new paper object
        // const newPaper = {
        //   ...paperSubmissionData,
        //   projectId: projectId,
        //   fileId: fileId || "", // Add other fields as needed
        //   userId: authUser.uid,
        // };

        toast.success("Submitted");
        setIsSubmitting(false);
      }
      setIsSubmitting(false);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setIsSubmitting(false);
    }
  };

  return {
    submitAbstract,
    isAbstractSubmitting: isSubmitting,
    abstractError: error,
  };
};

export default usePaperAbstractApproval;
