import { useEffect, useState } from "react";
import { getData } from "./axiosPool";
export const getAllAuthors = async () => {
  const authorsRes = await getData(`/authors`);
  return authorsRes?.authors;
};
const useGetAuthorsData = () => {
  const [projectState, setProjectState] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllAuthors().then((authors) => {
      setProjectState(authors);
      setLoading(false);
    });
  }, []); // Empty dependency array ensures this runs only once on mount

  return { authorsData: projectState, authorsDataLoading: loading };
};

export default useGetAuthorsData;
