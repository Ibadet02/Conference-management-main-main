import { useEffect, useState } from "react";
import { initialProjectData } from "../../../../data/pages/dashboard/Admin/InitialProjectData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ProjectDataType } from "../../../../types/dashboard/Admin/types";
import useCreateProject from "../../../../hooks/useCreateProject";
import { StyledCreateConference } from "../../../../styles/pages/dashboard/Admin/CreateConference/index.styled";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";
import useGetProjects from "../../../../hooks/useGetProjects";
import useUpdateProjectAdmin from "../../../../hooks/useUpdateProjectAdmin";

import { ProjectDataTypeWithIds } from "../../../../types/hooks/types";

const CreateConference = () => {
  const [projectData, setProjectData] =
    useState<ProjectDataType>(initialProjectData);
  const [currentConference, setCurrentConference] =
    useState<ProjectDataTypeWithIds>();
  const [type, setType] = useState("New");

  const { createProject, loading } = useCreateProject();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setProjectData({ ...projectData, [name]: value });
  };

  const handleDateChange = (
    date: Date | null,
    inputName: "startDate" | "endDate"
  ) => {
    setProjectData({
      ...projectData,
      deadline: {
        ...projectData.deadline,
        [inputName]: date,
      },
    });
  };

  const { updateProject, updating } = useUpdateProjectAdmin();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (type === "New") {
      console.log("projectData", projectData);
      await createProject(projectData);

      setProjectData(initialProjectData);
    } else {
      await updateProject(projectData);
    }
    setUpdateData((prev) => !prev);
  };

  useEffect(() => {
    setProjectData(initialProjectData);
  }, [type]);

  const { projects, setUpdateData } = useGetProjects();
  useEffect(() => {
    if (projects?.length > 0) {
      const latest = projects[projects.length - 1];
      if (latest) {
        setCurrentConference(latest);
      }
    }
  }, [projects]);

  useEffect(() => {
    if (type === "Edit") {
      if (currentConference?.deadline) {
        const startDate = currentConference?.deadline?.startDate
          ?.toString()
          ?.split("T")[0]
          ? new Date(
              currentConference?.deadline?.startDate?.toString()?.split("T")[0]
            )
          : null;
        const endDate = currentConference?.deadline?.endDate
          ?.toString()
          .split("T")[0]
          ? new Date(
              currentConference?.deadline?.endDate?.toString().split("T")[0]
            )
          : null;
        console.log(
          "endDate",
          currentConference?.deadline?.endDate?.toString().split("T")[0]
        );
        setProjectData({
          ...currentConference,
          deadline: {
            startDate,
            endDate,
          },
        });
      } else {
        setProjectData(initialProjectData);
      }
    }
  }, [type]);
  // console.log("currentConference", currentConference)

  return (
    <StyledCreateConference>
      <div
        style={{
          overflow: "auto",
          width: "100%",
          height: "100%",
          padding: "1rem",
        }}
      >
        <form
          style={{
            margin: "1rem",
            flex: 1,
            background: "rgba(255,255,255,1)",
            padding: "1rem",
            borderRadius: "1rem",
            boxShadow: "5px 5px 20px rgba(0,0,0,0.3)",
          }}
          onSubmit={handleSubmit}
        >
          <div
            style={{
              width: "100%",
              fontWeight: "bolder",
              textAlign: "center",
              color: "#2e2e2e",
              marginBottom: "15px",
            }}
          >
            CREATE CONFERENCE
          </div>

          <div
            style={{
              display: "flex",
              alignContent: "center",
              flex: 1,
              background: "#eee",
              borderRadius: "1rem",
              overflow: "hidden",
              boxShadow: "5px 5px 10px rgba(0,0,0,0.2)",
              margin: "15px 10px",
            }}
          >
            <div
              onClick={() => {
                setType("New");
              }}
              style={{
                flex: 1,
                padding: "10px",
                textAlign: "center",
                background: type === "New" ? "#0f67fd" : "transparent",
                color: type === "New" ? "#fff" : "#3e3e3e",
                fontWeight: "bolder",
                cursor: "pointer",
              }}
            >
              New
            </div>
            <div
              onClick={() => {
                setType("Edit");
              }}
              style={{
                flex: 1,
                padding: "10px",
                textAlign: "center",
                background: type === "Edit" ? "#0f67fd" : "transparent",
                color: type === "Edit" ? "#fff" : "#3e3e3e",
                fontWeight: "bolder",
                cursor: "pointer",
              }}
            >
              Edit
            </div>
          </div>
          {type === "New" ? (
            <div
              style={{
                margin: "1rem",
                background: "rgba(255,255,255,0.6)",
                padding: "10px",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              <TextField
                id="Title"
                label="Title"
                style={{ width: "100%" }}
                type="text"
                name="title"
                value={projectData.title}
                onChange={handleChange}
                required
              />

              <TextField
                id="Topic"
                label="Topic"
                style={{ width: "100%" }}
                type="text"
                name="topic"
                value={projectData.topic}
                onChange={handleChange}
                required
              />

              <TextField
                id="Description"
                label="Description"
                style={{ width: "100%" }}
                type="text"
                name="description"
                value={projectData.description}
                onChange={handleChange}
                required
                multiline
                rows={2}
              />

              <div
                style={{
                  padding: "15px",
                  border: "2px solid #ccc",
                  background: "transparent",
                  color: "#5e5e5e",
                  width: "100%",
                  height: "50px",
                  display: "flex",
                  gap: "10px",
                  borderRadius: "5px",
                }}
              >
                <label style={{ color: "#5e5e5e" }}>Start Date:</label>
                <DatePicker
                  selected={projectData.deadline.startDate}
                  onChange={(date: Date) => handleDateChange(date, "startDate")}
                  selectsStart
                  startDate={projectData.deadline.startDate}
                  endDate={projectData.deadline.endDate}
                  placeholderText="Select start date"
                  required
                  name="startDate"
                />
              </div>

              <div
                style={{
                  padding: "15px",
                  border: "2px solid #ccc",
                  background: "transparent",
                  color: "#5e5e5e",
                  width: "100%",
                  height: "50px",
                  display: "flex",
                  gap: "10px",
                  borderRadius: "5px",
                }}
              >
                <label style={{ color: "#5e5e5e" }}>End Date:</label>
                <DatePicker
                  selected={projectData.deadline.endDate}
                  onChange={(date: Date) => handleDateChange(date, "endDate")}
                  selectsEnd
                  startDate={projectData.deadline.startDate}
                  endDate={projectData.deadline.endDate}
                  minDate={projectData.deadline.startDate}
                  placeholderText="Select end date"
                  required
                  name="endDate"
                />
              </div>

              {loading ? (
                <LoadingButton
                  color="secondary"
                  loading={true}
                  loadingPosition="start"
                  startIcon={<SaveIcon />}
                  variant="contained"
                  style={{ width: "100%" }}
                >
                  <span>CREATING</span>
                </LoadingButton>
              ) : (
                <Button
                  variant="contained"
                  style={{ width: "100%" }}
                  type="submit"
                >
                  CREATE CONFERENCE
                </Button>
              )}
            </div>
          ) : (
            <div
              style={{
                margin: "1rem",
                background: "rgba(255,255,255,0.6)",
                padding: "10px",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              <TextField
                id="Title"
                label="Title"
                style={{ width: "100%" }}
                type="text"
                name="title"
                value={projectData.title}
                onChange={handleChange}
                required
              />

              <TextField
                id="Topic"
                label="Topic"
                style={{ width: "100%" }}
                type="text"
                name="topic"
                value={projectData.topic}
                onChange={handleChange}
                required
              />

              <TextField
                id="Description"
                label="Description"
                style={{ width: "100%" }}
                type="text"
                name="description"
                value={projectData.description}
                onChange={handleChange}
                required
                multiline
                rows={2}
              />

              <div
                style={{
                  padding: "15px",
                  border: "2px solid #ccc",
                  background: "transparent",
                  color: "#5e5e5e",
                  width: "100%",
                  height: "50px",
                  display: "flex",
                  gap: "10px",
                  borderRadius: "5px",
                }}
              >
                <label style={{ color: "#5e5e5e" }}>Start Date:</label>
                <DatePicker
                  selected={projectData.deadline.startDate}
                  onChange={(date: Date) => handleDateChange(date, "startDate")}
                  selectsStart
                  startDate={projectData.deadline.startDate}
                  endDate={projectData.deadline.endDate}
                  placeholderText="Select start date"
                  required
                  name="startDate"
                />
              </div>

              <div
                style={{
                  padding: "15px",
                  border: "2px solid #ccc",
                  background: "transparent",
                  color: "#5e5e5e",
                  width: "100%",
                  height: "50px",
                  display: "flex",
                  gap: "10px",
                  borderRadius: "5px",
                }}
              >
                <label style={{ color: "#5e5e5e" }}>End Date:</label>
                <DatePicker
                  selected={projectData.deadline.endDate}
                  onChange={(date: Date) => handleDateChange(date, "endDate")}
                  selectsEnd
                  startDate={projectData.deadline.startDate}
                  endDate={projectData.deadline.endDate}
                  minDate={projectData.deadline.startDate}
                  placeholderText="Select end date"
                  required
                  name="endDate"
                />
              </div>

              {updating ? (
                <LoadingButton
                  color="secondary"
                  loading={true}
                  loadingPosition="start"
                  startIcon={<SaveIcon />}
                  variant="contained"
                  style={{ width: "100%" }}
                >
                  <span>Updating</span>
                </LoadingButton>
              ) : (
                <Button
                  variant="contained"
                  style={{ width: "100%" }}
                  type="submit"
                >
                  Update CONFERENCE
                </Button>
              )}
            </div>
          )}
        </form>
      </div>
    </StyledCreateConference>
  );
};

export default CreateConference;
