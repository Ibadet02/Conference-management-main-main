import { useEffect, useState } from "react";
import { StyledMyConference } from "../../../../styles/pages/dashboard/Author/MyConference";
import useUserAppliedProjects from "../../../../hooks/useUserAppliedProjects";
import AppliedProjectData from "./AppliedProjectData";
import useUserData from "../../../../hooks/useUserData";
import useGetProjects from "../../../../hooks/useGetProjects";

const MyConferencesPage = () => {
  // const { userAppliedProjectsData, loading } = useUserAppliedProjects();
  const { projects, loading } = useGetProjects();
  const { userData } = useUserData();
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const mySubmissions = userData?.submittedPapers;
    setSubmissions(mySubmissions);
  }, [userData]);

  const [type, setType] = useState("New");

  const [latestProject, setLatestProject] = useState([]);
  const [remainingProjects, setRemainingProjects] = useState([]);

  useEffect(() => {
    if (projects?.length > 0) {
      const latest = projects?.at(-1);
      const remaining = projects?.slice(0, -1);

      if (latest) {
        setLatestProject([latest]);
      }
      setRemainingProjects(remaining);
    }
  }, [projects]);

  return (
    <StyledMyConference style={{ overflow: "hidden" }}>
      <div
        style={{ flex: 1, padding: "1rem", overflow: "auto", height: "100%" }}
      >
        <div
          className="first-name"
          style={{
            margin: "1rem",
            flex: 1,
            background: "rgba(255,255,255,1)",
            padding: "1rem",
            borderRadius: "1rem",
            boxShadow: "5px 5px 20px rgba(0,0,0,0.3)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "100%",
              fontWeight: "bolder",
              textAlign: "center",
              color: "#2e2e2e",
              marginTop: "5px",
            }}
          >
            MY CONFERENCES
          </div>

          <div
            style={{
              display: "flex",
              alignContent: "center",
              flex: 1,
              width: "100%",
              background: "#eee",
              borderRadius: "1rem",
              overflow: "hidden",
              boxShadow: "5px 5px 10px rgba(0,0,0,0.2)",
              margin: "15px 0px",
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
                setType("Archived");
              }}
              style={{
                flex: 1,
                padding: "10px",
                textAlign: "center",
                background: type === "Archived" ? "#0f67fd" : "transparent",
                color: type === "Archived" ? "#fff" : "#3e3e3e",
                fontWeight: "bolder",
                cursor: "pointer",
              }}
            >
              Archived
            </div>
          </div>

          <div
            style={{
              flex: 1,
              padding: "10px",
              background: "#fff",
              borderRadius: "10px",
            }}
          >
            {projects?.length > 0 ? (
              <>
                {type === "New" ? (
                  <>
                    {latestProject
                      ?.filter(
                        (e) => !submissions?.some((a) => a?.projectId === e?.id)
                      )
                      ?.map((project) => {
                        return (
                          <AppliedProjectData
                            key={project?.id}
                            projectData={project}
                            projectId={project?.id}
                          />
                        );
                      })}
                    {latestProject?.filter(
                      (e) => !submissions?.some((a) => a?.projectId === e?.id)
                    )?.length === 0 && (
                      <div
                        style={{
                          height: "200px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          color: "#ccc",
                        }}
                      >
                        No Data
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {remainingProjects
                      ?.filter((e) =>
                        submissions?.some((a) => a?.projectId === e?.id)
                      )
                      ?.map((project) => {
                        const matchedItem = submissions?.find(
                          (e) => e?.projectId === project?.id
                        );
                        return (
                          <AppliedProjectData
                            key={project?.id}
                            projectData={project}
                            projectId={project?.id}
                            matchedItem={matchedItem}
                          />
                        );
                      })}
                    {remainingProjects?.filter((e) =>
                      submissions?.some((a) => a?.projectId === e?.id)
                    )?.length === 0 && (
                      <div
                        style={{
                          height: "200px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          color: "#ccc",
                        }}
                      >
                        No Data
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <div
                className={loading ? "loadingAnimator" : ""}
                style={{
                  height: "200px",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#ccc",
                }}
              >
                {loading ? "Loading Data" : "No Data"}
              </div>
            )}
          </div>
        </div>
      </div>
    </StyledMyConference>
  );
};

export default MyConferencesPage;
