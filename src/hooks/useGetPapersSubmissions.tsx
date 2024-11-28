import { useEffect, useState } from "react";
import { QuerySnapshot, collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import {
  PaperSubmissionDataTypeWithIds,
  SubmittedPapersStateType,
} from "../types/hooks/types";
import { initialsubmittedPapersStateData } from "../data/hooks/SubmittedPapersStateData";
import { PaperSubmissionDataType } from "../types/dashboard/Author/types";
import { getData } from "./axiosPool";
export const getAllSubmissions = async () => {
  const abstractsRes = await getData(`/submissions/`);
  return abstractsRes?.submissions;
};
const useGetSubmittedPapers = () => {
  const [submittedPapersState, setSubmittedPapersState] =
    useState<SubmittedPapersStateType>(initialsubmittedPapersStateData);
  const [updateData, setUpdateData] = useState(false);

  useEffect(() => {
    // const unsubscribe = onSnapshot(
    //   collection(db, "paperSubmissions"),
    //   (snapshot) => {
    //     const submittedPapersDataWithIds: PaperSubmissionDataTypeWithIds[] = [];
    //     snapshot.forEach((doc) => {
    //       console.log("doc", doc.data());
    //       const submittedPaper: PaperSubmissionDataType =
    //         doc.data() as PaperSubmissionDataType;
    //       submittedPapersDataWithIds.push({ id: doc.id, ...submittedPaper });
    //     });

    //   }
    // );
    getAllSubmissions().then((submissions) => {
      console.log("data", submissions);
      setSubmittedPapersState({
        submittedPapers: submissions,
        loading: false,
        setUpdateData: setUpdateData,
      });
    });
    // return () => unsubscribe();
  }, [updateData]); // Empty dependency array ensures this runs only once on mount
  return submittedPapersState;
};

export default useGetSubmittedPapers;
