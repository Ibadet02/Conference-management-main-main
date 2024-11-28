/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { collection, getDocs, DocumentData } from "firebase/firestore";
import { db } from "../firebase";
import useGetUsersIds from "./useGetUsersIds";
import { getData } from "./axiosPool";

const useGetUsers = (
  collectionName: string
): { users: DocumentData[]; loading: boolean; reviewers: DocumentData[] } => {
  const userIds = useGetUsersIds(collectionName);
  const [users, setUsers] = useState<DocumentData[]>([]);
  const [reviewers, setReviewers] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updateData, setUpdateData] = useState<boolean>(false);
  const getAllReviewers = async () => {
    let reviewers: DocumentData[] = [];
    try {
      setLoading(true);
      const reviewersResponse = await getData("/reviewers");
      reviewers = reviewersResponse.reviewers;
    } catch (error) {
      console.log("error", error);
      reviewers = [];
      setLoading(false);
    }
    setReviewers([
      ...(reviewers.map((reviewer: DocumentData) => ({
        ...reviewer,
        title: `${reviewer?.firstName} ${reviewer?.lastName}`,
        id: reviewer?.reviewerId,
      })) || []),
    ]);
    setUsers([
      ...(reviewers.map((reviewer: DocumentData) => ({
        ...reviewer,
        title: `${reviewer?.firstName} ${reviewer?.lastName}`,
        id: reviewer?.reviewerId,
      })) || []),
    ]);
    setLoading(false);
    return reviewers;
  };
  const getAllAuthors = async () => {
    try {
      setLoading(true);
      const authorsRes = await getData(`/authors`);
      setUsers(
        authorsRes?.authors.map((author: any) => ({
          ...author,
          title: `${author?.firstName} ${author?.lastName}`,
          id: author?.authorId,
        }))
      );
      setLoading(false);
      return authorsRes?.authors;
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (collectionName.includes("author")) getAllAuthors();
    if (collectionName.includes("reviewer")) getAllReviewers();
  }, [collectionName, userIds, updateData]);

  return { users, loading, reviewers, setUpdateData };
};

export default useGetUsers;
