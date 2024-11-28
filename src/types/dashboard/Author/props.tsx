/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProjectDataTypeWithIds, UserDataProps } from "../../hooks/types";
import { ProjectDataType } from "../Admin/types";

export interface ConferenceProps {
  conferenceInfo: ProjectDataTypeWithIds;
}

export interface AppliedProjectDataProps {
  projectData: ProjectDataType;
  projectId: string;
  matchedItem: any;
}
export interface ReadOnlyUserDataProps {
  userDataElements: UserDataProps;
}
export interface PaperSubmissionInputsProps {
  projectId: string;
  matchedItem: any;
  projectData: any;
}

export interface ConferencesTableProps {
  projects: ProjectDataTypeWithIds[];
}

export interface ConferencePopupProps {
  project: ProjectDataTypeWithIds | null;
  onClose: () => void;
  projects: Array;
  setUpdateData: (prev: boolean) => void;
}
