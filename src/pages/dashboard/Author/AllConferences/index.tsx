import useGetProjects from "../../../../hooks/useGetProjects";
import { StyledAllConferences } from "../../../../styles/pages/dashboard/Author/AllConferences/index.styled";
import ConferencesTable from "./ConferencesTable";

const AllConferences = () => {
  const { projects, setUpdateData } = useGetProjects();

  return (
    <StyledAllConferences style={{ overflow: "hidden" }}>
      <div
        style={{
          flex: 1,
          padding: "1rem",
          overflow: "auto",
          height: "100%",
        }}
      >
        <ConferencesTable projects={projects} setUpdateData={setUpdateData} />
      </div>
    </StyledAllConferences>
  );
};

export default AllConferences;
