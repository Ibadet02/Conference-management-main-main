/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthorUserDataType } from "../Form/registration/Author/types";
import { ProjectDataType } from "../dashboard/Admin/types";
import { PaperSubmissionDataType } from "../dashboard/Author/types";

export type ProjectDataTypeWithIds = ProjectDataType & {
  id: string;
};

export type ProjectStateType = {
  projects: ProjectDataTypeWithIds[];
  loading: boolean;
  setUserDetails?: (userData: object) => void;
  setUserId?: (userId: string) => void;
  userDetails?: object;
  userId?: string;
  setUserType?: (userType: string) => void;
  setUpdateData: (updateData: boolean) => void;
};

export type PaperSubmissionDataTypeWithIds = PaperSubmissionDataType & {
  id: string;
};

export type SubmittedPapersStateType = {
  submittedPapers: PaperSubmissionDataTypeWithIds[];
  loading: boolean;
  setUpdateData: (updateData: boolean) => void;
};

export interface UserDataProps {
  userData: AuthorUserDataType;
  userDataLoading: boolean;
  userId: string | null; // Add userId property
  loading: boolean;
  getReviewForASubmission: (submissionId: number) => Promise<any>;
  setUpdateData: Function;
}
