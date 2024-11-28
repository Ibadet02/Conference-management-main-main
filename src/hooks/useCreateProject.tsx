import { ProjectDataType } from "../types/dashboard/Admin/types";
import { useState } from "react";
import toast from "react-hot-toast";
import { postData, putData } from "./axiosPool";

const useCreateProject = () => {
  const [loading, setLoading] = useState(false);

  const createProject = async (projectData: ProjectDataType) => {
    try {
      setLoading(true);
      const res = await postData("/conferences", projectData);
      toast.success("Conference created successfully");

      await putData("auth/reset-author-status", {});

      setLoading(false);
      return res?.project;
    } catch (error) {
      setLoading(false);
      console.error("Error adding document: ", error);
    }
  };
  return { createProject, loading };
};

export default useCreateProject;
