import React, { useEffect, useState } from "react";
import { StyledConferencePopup } from "../../../../styles/pages/dashboard/Author/AllConferences/ConferencePopup.styled";
import { ConferencePopupProps } from "../../../../types/dashboard/Author/props";
import { StyledAccordion } from "../../../../styles/pages/dashboard/Author/AllConferences/Accordion.styled";
import Button from "@mui/material/Button";
import { Timestamp } from "firebase/firestore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useAuthentication from "../../../../hooks/useAuthentication";
import useGetReviewerData from "../../../../hooks/useGetReviewerData";
import useDownloadPDF from "../../../../hooks/useDownloadPdf";

const MoreInfo: React.FC<ConferencePopupProps> = ({
  project,
  projects,
  onClose,
  handleApply,
}) => {
  function getColor(value) {
    if (value >= 8) {
      return "#28a745"; // green
    } else if (value >= 5) {
      return "#fd7e14"; // orange
    } else {
      return "#dc3545"; // red
    }
  }

  const {
    downloadLastPdf,
    downloadUrl,
    error,
    downloadProjectId,
    downloadLoading,
  } = useDownloadPDF();

  const handleDownload = (
    correspondingAuthorId: string,
    projectId: string,
    paperId: string
  ) => {
    downloadLastPdf(correspondingAuthorId, projectId, paperId);
  };
  const [review, setReview] = useState({});
  const { userData, getReviewForASubmission } = useGetReviewerData();
  useEffect(() => {
    getReviewForASubmission(parseInt(project?.id ?? "-1"))
      .then((res) => {
        console.log("ressss", res);
        setReview(res);
      })
      .catch((error) => {
        console.log("Error fetching review data:", error);
      });
  }, []);
  return (
    <StyledConferencePopup>
      {project && (
        <div
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <div style={{ overflow: "auto", height: "100%", padding: "1rem" }}>
            <div
              style={{
                color: "#1e1e1e",
                fontWeight: "bold",
                fontSize: "2rem",
                flex: 1,
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              Result Information
            </div>

            <Accordion style={{ background: "rgba(255,255,255,0.5)" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography sx={{ width: "100%", flexShrink: 0 }}>
                  Project Title
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ color: "text.secondary" }}>
                  {projects?.find((e) => e?.id === project?.projectId)?.title}
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion style={{ background: "rgba(255,255,255,0.5)" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography sx={{ width: "100%", flexShrink: 0 }}>
                  Abstract
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ color: "text.secondary" }}>
                  {project?.abstract}
                </Typography>
              </AccordionDetails>
            </Accordion>

            {review && (
              <Accordion style={{ background: "rgba(255,255,255,0.5)" }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography sx={{ width: "100%", flexShrink: 0 }}>
                    My Reviews
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ color: "text.secondary" }}>
                    <div
                      style={{
                        background: "#fff",
                        padding: "10px",
                        margin: "5px",
                      }}
                    >
                      <Accordion
                        style={{
                          color: "#fff",
                          background: getColor(review?.academicQuality),
                        }}
                      >
                        <AccordionSummary
                          expandIcon={
                            <ExpandMoreIcon style={{ color: "#fff" }} />
                          }
                          aria-controls="panel1bh-content"
                          id="panel1bh-header"
                        >
                          <Typography sx={{ width: "100%", flexShrink: 0 }}>
                            Academic Quality Review
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography sx={{ color: "#fff" }}>
                            <div>
                              <b>Academic Quality Score: </b>
                              {review?.academicQuality}
                            </div>
                            <div>
                              <b>Academic Quality Comment: </b>
                              {review?.academicQualityComment}
                            </div>
                          </Typography>
                        </AccordionDetails>
                      </Accordion>

                      <Accordion
                        style={{
                          color: "#fff",
                          background: getColor(review?.contribution),
                        }}
                      >
                        <AccordionSummary
                          expandIcon={
                            <ExpandMoreIcon style={{ color: "#fff" }} />
                          }
                          aria-controls="panel1bh-content"
                          id="panel1bh-header"
                        >
                          <Typography sx={{ width: "100%", flexShrink: 0 }}>
                            Contribution Review
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography sx={{ color: "#fff" }}>
                            <div>
                              <b>Contribution Score: </b>
                              {review?.contribution}
                            </div>
                            <div>
                              <b>Contribution Comment: </b>
                              {review?.contributionComment}
                            </div>
                          </Typography>
                        </AccordionDetails>
                      </Accordion>

                      <Accordion
                        style={{
                          color: "#fff",
                          background: getColor(review?.language),
                        }}
                      >
                        <AccordionSummary
                          expandIcon={
                            <ExpandMoreIcon style={{ color: "#fff" }} />
                          }
                          aria-controls="panel1bh-content"
                          id="panel1bh-header"
                        >
                          <Typography sx={{ width: "100%", flexShrink: 0 }}>
                            Language Review
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography sx={{ color: "#fff" }}>
                            <div>
                              <b>Language Score: </b>
                              {review?.language}
                            </div>
                            <div>
                              <b>Language Comment: </b>
                              {review?.languageComment}
                            </div>
                          </Typography>
                        </AccordionDetails>
                      </Accordion>

                      <Accordion
                        style={{
                          color: "#fff",
                          background: getColor(
                            review?.literatureReviewAndBibliography
                          ),
                        }}
                      >
                        <AccordionSummary
                          expandIcon={
                            <ExpandMoreIcon style={{ color: "#fff" }} />
                          }
                          aria-controls="panel1bh-content"
                          id="panel1bh-header"
                        >
                          <Typography sx={{ width: "100%", flexShrink: 0 }}>
                            Literature Review and Bibliography Review
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography sx={{ color: "#fff" }}>
                            <div>
                              <b>Literature Review and Bibliography Score: </b>
                              {review?.literatureReviewAndBibliography}
                            </div>
                            <div>
                              <b>
                                Literature Review and Bibliography Comment:{" "}
                              </b>
                              {review?.literatureReviewAndBibliographyComment}
                            </div>
                          </Typography>
                        </AccordionDetails>
                      </Accordion>

                      <Accordion
                        style={{
                          color: "#fff",
                          background: getColor(review?.novelty),
                        }}
                      >
                        <AccordionSummary
                          expandIcon={
                            <ExpandMoreIcon style={{ color: "#fff" }} />
                          }
                          aria-controls="panel1bh-content"
                          id="panel1bh-header"
                        >
                          <Typography sx={{ width: "100%", flexShrink: 0 }}>
                            Novelty Review
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography sx={{ color: "#fff" }}>
                            <div>
                              <b>Novelty Score: </b>
                              {review?.novelty}
                            </div>
                            <div>
                              <b>Novelty Comment: </b>
                              {review?.noveltyComment}
                            </div>
                          </Typography>
                        </AccordionDetails>
                      </Accordion>

                      <Accordion
                        style={{
                          color: "#fff",
                          background: getColor(review?.styleAndFormat),
                        }}
                      >
                        <AccordionSummary
                          expandIcon={
                            <ExpandMoreIcon style={{ color: "#fff" }} />
                          }
                          aria-controls="panel1bh-content"
                          id="panel1bh-header"
                        >
                          <Typography sx={{ width: "100%", flexShrink: 0 }}>
                            Style and Format Review
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography sx={{ color: "#fff" }}>
                            <div>
                              <b>Style and Format Score: </b>
                              {review?.styleAndFormat}
                            </div>
                            <div>
                              <b>Style and Format Comment: </b>
                              {review?.styleAndFormatComment}
                            </div>
                          </Typography>
                        </AccordionDetails>
                      </Accordion>

                      <Accordion
                        style={{
                          color: "#fff",
                          background: getColor(review?.topic),
                        }}
                      >
                        <AccordionSummary
                          expandIcon={
                            <ExpandMoreIcon style={{ color: "#fff" }} />
                          }
                          aria-controls="panel1bh-content"
                          id="panel1bh-header"
                        >
                          <Typography sx={{ width: "100%", flexShrink: 0 }}>
                            Topic Review
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography sx={{ color: "#fff" }}>
                            <div>
                              <b>Topic Score: </b>
                              {review?.topic}
                            </div>
                            <div>
                              <b>Topic Comment: </b>
                              {review?.topicComment}
                            </div>
                          </Typography>
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1bh-content"
                          id="panel1bh-header"
                        >
                          <Typography sx={{ width: "100%", flexShrink: 0 }}>
                            Summary
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                            <div>{review?.summary}</div>
                          </Typography>
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1bh-content"
                          id="panel1bh-header"
                        >
                          <Typography sx={{ width: "100%", flexShrink: 0 }}>
                            Comments for Organizing Commitee
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                            <div>{review?.commentsForOrganizingCommittee}</div>
                          </Typography>
                        </AccordionDetails>
                      </Accordion>

                      <div
                        style={{
                          background:
                            review?.recommendation === "Strong Accept"
                              ? "#28a745"
                              : review?.recommendation === "Accept"
                              ? "#6f42c1"
                              : review?.recommendation === "Weak Accept"
                              ? "#fd7e14"
                              : "#dc3545",
                          padding: "10px 20px",
                          color: "#fff",
                        }}
                      >
                        <h4>Recommendation: {review?.recommendation}</h4>
                      </div>
                    </div>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            )}

            <Accordion style={{ background: "rgba(255,255,255,0.5)" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography sx={{ width: "100%", flexShrink: 0 }}>
                  File
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ color: "text.secondary" }}>
                  <Button
                    variant="contained"
                    disabled={downloadLoading === project.paperId}
                    onClick={() => {
                      handleDownload(
                        project.correspondingAuthor,
                        project.projectId,
                        project.id
                      );
                    }}
                  >
                    {downloadLoading === project.id
                      ? "Downloading"
                      : "Download"}
                  </Button>
                </Typography>
              </AccordionDetails>
            </Accordion>

            <div
              style={{
                flex: 1,
                display: "flex",
                gap: "10px",
                padding: "1rem 0rem",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <Button variant="contained" color="error" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </StyledConferencePopup>
  );
};

export default MoreInfo;
