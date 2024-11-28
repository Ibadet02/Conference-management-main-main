import { ProjectDataType } from "../types/dashboard/Admin/types";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useState } from "react";
import toast from "react-hot-toast";
import { putData } from "./axiosPool";

const useUpdateProjectAdmin = () => {
  const [loading, setLoading] = useState(false);

  const updateProject = async (projectData: ProjectDataType) => {
    try {
      setLoading(true);
      await putData(`/conferences`, projectData);

      toast.success("Conference updated successfully");

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error adding document: ", error);
    }
  };
  return { updateProject, updating: loading };
};

export default useUpdateProjectAdmin;
