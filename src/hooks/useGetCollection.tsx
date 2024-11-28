import { useEffect, useState } from "react";
import { getData } from "./axiosPool";

const useGetCollection = (authorId: string) => {
  const [collectionState, setCollectionState] = useState<object | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const response = await getData(
          `/submissions/${authorId}/final-results`
        );
        console.log("response", response);
        setCollectionState({
          collection: response?.finalResults,
          loading: false,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setLoading(false);
        setCollectionState((prevState) => ({ ...prevState, loading: false }));
      }
    };

    getProjects();
  }, []); // Empty dependency array ensures this runs only once on mount

  return { collectionState, loading };
};

export default useGetCollection;
