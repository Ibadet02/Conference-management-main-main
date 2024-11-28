import { useEffect, useState } from "react";
import { ProjectDataTypeWithIds, ProjectStateType } from "../types/hooks/types";
import { initialProjectStateData } from "../data/hooks/ProjectStateData";
import { getData } from "./axiosPool";

const useGetProjects = () => {
  const [projectState, setProjectState] = useState<ProjectStateType>(
    initialProjectStateData
  );
  const [loading, setLoading] = useState(true);
  const [updateData, setUpdateData] = useState(false);
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const projectsResponse = await getData("/conferences");
      console.log("projectsResponse", projectsResponse.projects);
      console.log("hola");
      setProjectState({
        projects: projectsResponse?.conferences as ProjectDataTypeWithIds[],
        loading: false,
        setUpdateData,
      });
      setLoading(false);
    };

    fetchProjects();
  }, [updateData]);

  return { projects: projectState.projects, loading, setUpdateData };
};

export default useGetProjects;
