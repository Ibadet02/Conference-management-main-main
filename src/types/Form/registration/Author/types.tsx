import { StringDropdownInputType } from "../types";

export type AuthorUserDataType = {
  authorId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  affiliation: StringDropdownInputType;
  academicInterest: StringDropdownInputType;
  program: StringDropdownInputType;
  supervisor: StringDropdownInputType;
  password: string;
  actualState?: number;
  myStatus?: string;
  reviewResult?: string;
};
