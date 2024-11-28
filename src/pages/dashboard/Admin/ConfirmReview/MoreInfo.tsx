import { StyledAssesmentView } from "../../../../styles/pages/dashboard/Admin/ConfirmReview/AssesmentView.styled";
import {
  AssesmentViewProps,
  MoreInfoProps,
} from "../../../../types/dashboard/Admin/props";
import Button from "@mui/material/Button";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useGetProjects from "../../../../hooks/useGetProjects";
import useGetAuthorsData from "../../../../hooks/useGetAuthorsData";
import useGetReviews from "../../../../hooks/useGetReviews";
import { useEffect, useState } from "react";
import useGetReviewersList from "../../../../hooks/useGetReviewersList";
import useGetFinalReviews from "../../../../hooks/useGetFinalReviews";
import useDownloadPDF from "../../../../hooks/useDownloadPdf";
import useCreateFinalReviews from "../../../../hooks/useCreateFinalReviews";
import useUpdateFinalReviews from "../../../../hooks/useUpdateFinalReviews";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase/index";

import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import useNotifyAuthor from "../../../../notify/notifyAuthor";
import { useUpdateAuthorStatus } from "../../../../hooks/usePaperAbstractApproval";

const MoreInfo: React.FC<MoreInfoProps> = ({
  project,
  onClose,
  handleOpenOtherModal,
  setUpdateData,
}) => {
  const { downloadLastPdf, downloadLoading } = useDownloadPDF();
  const { finalReviews, finalReviewsLoading } = useGetFinalReviews();
  const { reviews } = useGetReviews();
  const { reviewersList } = useGetReviewersList();
  const { projects } = useGetProjects();
  const { authorsData } = useGetAuthorsData();
  const [paperReviewerIds, setpaperReviewerIds] = useState([]);
  const [paperReviews, setpaperReviews] = useState([]);
  const { updateAuthorStatus } = useUpdateAuthorStatus();
  const handleDownload = (
    correspondingAuthorId: string,
    projectId: string,
    paperId: string
  ) => {
    downloadLastPdf(correspondingAuthorId, projectId, paperId);
  };

  useEffect(() => {
    setpaperReviewerIds(
      reviews
        .filter((rev) => rev.paperId === project.paperId)
        .map((rev: any) => rev.reviewerId)
    );

    setpaperReviews(reviews.filter((rev) => rev.paperId === project.paperId));
  }, [reviews]);

  // ________________________________________________________

  const { createFinalReviews, isLoading: iDLoading } = useCreateFinalReviews();

  const [finalAssessments, setFinalAssessments] = useState<{
    [key: string]: string;
  }>({});

  const { updateFinalReview, updating } = useUpdateFinalReviews();

  const handleFinalAssessmentChange = (
    paperId: string,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFinalAssessments((prevState) => ({
      ...prevState,
      [paperId]: event.target.value,
    }));
  };
  return (
    <StyledAssesmentView>
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "1rem",
          overflow: "auto",
        }}
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
          PAPER INFO
        </div>
        <div
          style={{
            flex: 1,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            marginBottom: "15px",
          }}
        >
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography sx={{ width: "100%", flexShrink: 0 }}>
                Conference Title
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {projects?.find((e) => e?.id === project?.projectId)?.title}
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            style={{
              color: "#5e5e5e",
              background: "#fff",
              boxShadow: "0px 5px 10px rgba(0,0,0,0.1)",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography sx={{ width: "100%", flexShrink: 0 }}>
                Corresponding Author
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {
                  authorsData?.find(
                    (e) => e?.authorId === project.correspondingAuthor
                  )?.firstName
                }{" "}
                {
                  authorsData?.find(
                    (e) => e?.authorId === project.correspondingAuthor
                  )?.lastName
                }
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            style={{
              color: "#5e5e5e",
              background: "#fff",
              boxShadow: "0px 5px 10px rgba(0,0,0,0.1)",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography sx={{ width: "100%", flexShrink: 0 }}>
                Co Author(s)
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {project.authors.map((author: any) => {
                  return (
                    <div key={author} style={{ margin: "5px" }}>
                      {
                        authorsData?.find((e) => e?.authorId === author)
                          ?.firstName
                      }{" "}
                      {
                        authorsData?.find((e) => e?.authorId === author)
                          ?.lastName
                      }
                    </div>
                  );
                })}
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            style={{
              color: "#5e5e5e",
              background: "#fff",
              boxShadow: "0px 5px 10px rgba(0,0,0,0.1)",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography sx={{ width: "100%", flexShrink: 0 }}>
                Assigned Reviewer(s)
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {project.assignedReviewers.map((reviewer: any) => {
                  return (
                    <p key={reviewer}>
                      <Button
                        variant="outlined"
                        style={{ width: "100%", borderRadius: "0px" }}
                        disabled={
                          reviewer !==
                          paperReviewerIds.find(
                            (reviewerId) => reviewerId === reviewer
                          )
                        }
                        onClick={() =>
                          handleOpenOtherModal(
                            paperReviews.find(
                              (review) => review.reviewerId === reviewer
                            )
                          )
                        }
                      >
                        {
                          reviewersList?.find((e) => e?.id === reviewer)
                            ?.firstName
                        }{" "}
                        {
                          reviewersList?.find((e) => e?.id === reviewer)
                            ?.lastName
                        }
                      </Button>
                    </p>
                  );
                })}
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            style={{
              color: "#5e5e5e",
              background: "#fff",
              boxShadow: "0px 5px 10px rgba(0,0,0,0.1)",
            }}
          >
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
              <Typography>
                <Button
                  variant="contained"
                  disabled={downloadLoading === project.paperId}
                  style={{ width: "100%", borderRadius: "0px" }}
                  onClick={() =>
                    handleDownload(
                      project.correspondingAuthor,
                      project.projectId,
                      project.paperId
                    )
                  }
                >
                  {downloadLoading === project.paperId
                    ? "Downloading"
                    : "Download"}
                </Button>
              </Typography>
            </AccordionDetails>
          </Accordion>

          {finalReviews?.find((e) => project?.paperId === e?.paperId)
            ?.finalResult && (
            <Accordion
              style={{
                background:
                  finalReviews?.find((e) => project?.paperId === e?.paperId)
                    ?.finalResult === "Strong Accept"
                    ? "#28a745"
                    : finalReviews?.find((e) => project?.paperId === e?.paperId)
                        ?.finalResult === "Accept"
                    ? "#6f42c1"
                    : finalReviews?.find((e) => project?.paperId === e?.paperId)
                        ?.finalResult === "Weak Accept"
                    ? "#fd7e14"
                    : "#dc3545",
                color: "#fff",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography sx={{ width: "100%", flexShrink: 0 }}>
                  Final Assessment
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography style={{ color: "#fff" }}>
                  {
                    finalReviews?.find((e) => project?.paperId === e?.paperId)
                      ?.finalResult
                  }
                </Typography>
              </AccordionDetails>
            </Accordion>
          )}
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            background: "#fff",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <FormControl fullWidth>
              <InputLabel id="final-assessment-label">
                Final Assessment
              </InputLabel>
              <Select
                style={{ width: "100%", borderRadius: "0px" }}
                labelId="final-assessment-label"
                id="final-assessment-select"
                label="Final Assessment"
                name="finalAssessment"
                disabled={
                  finalReviews?.find((e) => project?.paperId === e?.paperId)
                    ?.finalResult
                }
                value={finalAssessments[project.paperId]}
                onChange={(e) =>
                  handleFinalAssessmentChange(project.paperId, e)
                }
              >
                <MenuItem value="">Select...</MenuItem>
                <MenuItem value="Reject">Reject</MenuItem>
                <MenuItem value="Weak Accept">Weak Accept</MenuItem>
                <MenuItem value="Accept">Accept</MenuItem>
                <MenuItem value="Strong Accept">Strong Accept</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Button
            style={{ width: "100%", borderRadius: "0px" }}
            disabled={
              iDLoading === project?.projectId ||
              finalReviewsLoading ||
              finalReviews?.find((e) => project?.paperId === e?.paperId)
                ?.finalResult
                ? true
                : false
            }
            variant="contained"
            color="success"
            onClick={async () => {
              const finalResult = finalAssessments[project.paperId];
              console.log(
                "finalResult",
                finalResult,
                project?.paperId,
                project
              );
              createFinalReviews(project?.paperId, finalResult);

              await updateAuthorStatus(
                project?.correspondingAuthor,
                "paper result",
                5
              );
              setUpdateData((prev) => !prev);
              onClose();
            }}
          >
            {finalReviews?.find((e) => project?.paperId === e?.paperId)
              ?.finalResult
              ? "Sent"
              : "Send"}
          </Button>
        </div>

        <Button variant="contained" style={{ width: "100%" }} onClick={onClose}>
          close
        </Button>
      </div>
    </StyledAssesmentView>
  );
};

export default MoreInfo;
