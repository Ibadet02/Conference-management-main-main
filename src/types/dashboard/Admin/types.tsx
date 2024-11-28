export type ProjectDataType = {
  id?: string;
  title: string;
  topic: string;
  description: string;
  deadline: {
    startDate: null | Date;
    endDate: null | Date;
  };
  createdOn: string;

  // assignedReviewers: string[]
};
