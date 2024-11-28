// import { initialRegisterFormData } from "../../Form/registration/InitialRegisterFormData";
import { ProjectDataType } from "../../../../types/dashboard/Admin/types";
export const initialProjectData: ProjectDataType = {
  title: "",
  topic: "",
  description: "",
  deadline: {
    startDate: null,
    endDate: null,
  },
  createdOn: new Date().toISOString(),
  id: "2",
};
