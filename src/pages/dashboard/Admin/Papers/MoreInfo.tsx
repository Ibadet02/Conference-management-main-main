/* eslint-disable @typescript-eslint/no-explicit-any */
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
import useGetPapersToBeReviewed from "../../../../hooks/useGetPapersToBeReviewed";
import useGetProjects from "../../../../hooks/useGetProjects";
import useGetAuthorsData from "../../../../hooks/useGetAuthorsData";
import useGetSubmittedPapers from "../../../../hooks/useGetPapersSubmissions";
import { useEffect, useState } from "react";
import useGetUsers from "../../../../hooks/useGetUsers";

import {
  collection,
  doc,
  setDoc,
  query,
  where,
  updateDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { db } from "../../../../firebase/index";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";

import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import useUpdatePapersToBeReviewed from "../../../../hooks/useUpdatePapersToBeReviewed";
import useDownloadPDF from "../../../../hooks/useDownloadPdf";
import useNotifyAuthor from "../../../../notify/notifyAuthor";
import useNotifyReviewer from "../../../../notify/notifyReviewer";
import { addReviewersToPaper } from "../../../../hooks/usePaperUpdate";
import { useUpdateAuthorStatus } from "../../../../hooks/usePaperAbstractApproval";
import toast from "react-hot-toast";
import useGetToBeReviewed from "../../../../hooks/useGetToBeReviewed";

const MoreInfo: React.FC<MoreInfoProps> = ({
  onClose,
  project,
  setUpdateData,
}) => {
  const { toBeReviewed, loading: toBeReviewedLoading } = useGetToBeReviewed();
  const { projects } = useGetProjects();
  const { authorsData } = useGetAuthorsData();
  const [paperUpdateRequest, setPaperUpdateRequest] = useState(
    project?.paperUpdateRequest ? project?.paperUpdateRequest : false
  );
  const [prevData, setPrevData] = useState(
    project.prevData ? project.prevData : {}
  );

  function getColor(value) {
    if (value >= 8) {
      return "#28a745"; // green
    } else if (value >= 5) {
      return "#fd7e14"; // orange
    } else {
      return "#dc3545"; // red
    }
  }

  // Function to check if two arrays are equal
  const arraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  };

  // Function to check if two strings are equal
  const stringsEqual = (str1, str2) => str1 === str2;

  const { downloadLastPdf, downloadUrl, error, downloadLoading } =
    useDownloadPDF();

  const handleDownload = (
    correspondingAuthorId: string,
    projectId: string,
    paperId: string
  ) => {
    downloadLastPdf(correspondingAuthorId, projectId, paperId);
  };

  // ____________________________________________________________

  const { loading, submittedPapers } = useGetSubmittedPapers();
  const [submitting, setSubmitting] = useState("");

  const [assignedReviewers, setAssignedReviewers] = useState<string[][]>([]);

  const collectionName = "reviewerUsers";
  const { reviewers } = useGetUsers(collectionName);
  console.log("reviewers", reviewers);
  const { updateAuthorStatus } = useUpdateAuthorStatus();
  const handleSendForReview = async (
    paperData: any,
    assignedReviewersData: any
  ) => {
    setSubmitting(paperData?.projectId);
    try {
      // Extract only the IDs from assignedReviewersData
      const assignedReviewersIds = assignedReviewersData.map(
        (reviewer: any) => reviewer.reviewerId
      );

      await addReviewersToPaper(project?.id, assignedReviewersIds);
      const author: any = authorsData.find(
        (e: any) => e.authorId === project?.correspondingAuthor
      );
      await updateAuthorStatus(
        project?.correspondingAuthor,
        author?.myStatus,
        4
      );

      setPrevData({});
      setPaperUpdateRequest(false);
      toast.success("Paper sent for review successfully!");
      console.log("Paper sent for review successfully!");
      setUpdateData((prev) => !prev);
      setSubmitting("");
    } catch (error) {
      console.error("Error sending paper for review: ", error);
      setSubmitting("");
      toast.error("Error sending paper for review");
    } finally {
      onClose();
    }
  };

  useEffect(() => {
    const item = submittedPapers?.find((e) => project?.id === e?.id);
    setAssignedReviewers(
      reviewers?.filter((e) =>
        item?.assignedReviewers?.some((f) => e?.reviewerId === f)
      )
    );
  }, [submittedPapers, reviewers]);

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
                {projects?.find((e) => e?.id === project.projectId)?.title}
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
                Corresponding Author
                {prevData?.correspondingAuthor &&
                  !stringsEqual(
                    project.correspondingAuthor,
                    prevData?.correspondingAuthor
                  ) && (
                    <span style={{ marginLeft: "5px", color: "red" }}>*</span>
                  )}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {prevData?.correspondingAuthor &&
                  !stringsEqual(
                    project.correspondingAuthor,
                    prevData?.correspondingAuthor
                  ) && (
                    <span>
                      <span style={{ color: "red" }}>
                        <b>Previous: </b>
                        {
                          authorsData?.find(
                            (e) => e?.authorId === prevData?.correspondingAuthor
                          )?.firstName
                        }{" "}
                        {
                          authorsData?.find(
                            (e) => e?.authorId === prevData?.correspondingAuthor
                          )?.lastName
                        }
                      </span>
                      <br />
                      <br />

                      <b>New: </b>
                    </span>
                  )}
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

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography sx={{ width: "100%", flexShrink: 0 }}>
                Co Author(s){" "}
                {prevData?.authors &&
                  !arraysEqual(project.authors, prevData?.authors) && (
                    <span style={{ marginLeft: "5px", color: "red" }}>*</span>
                  )}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {prevData?.authors &&
                  !arraysEqual(project.authors, prevData?.authors) && (
                    <span>
                      <span style={{ color: "red" }}>
                        <b>Previous: </b>
                        {prevData?.authors.map((author: any, index) => {
                          return (
                            <div key={index} style={{ margin: "5px" }}>
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
                      </span>
                      <br />

                      <b>New: </b>
                    </span>
                  )}

                {project.authors.map((author: any, index) => {
                  return (
                    <div key={index} style={{ margin: "5px" }}>
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

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography sx={{ width: "100%", flexShrink: 0 }}>
                Abstract{" "}
                {prevData?.abstract &&
                  !stringsEqual(project.abstract, prevData?.abstract) && (
                    <span style={{ marginLeft: "5px", color: "red" }}>*</span>
                  )}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {prevData?.correspondingAuthor &&
                  !stringsEqual(project.abstract, prevData?.abstract) && (
                    <span>
                      <span style={{ color: "red" }}>
                        <b>Previous: </b>
                        {prevData?.abstract}
                      </span>
                      <br />
                      <br />

                      <b>New: </b>
                    </span>
                  )}
                {project?.abstract}
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            style={{
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
                {prevData?.abstract &&
                  !stringsEqual(project.fileId, prevData?.fileId) && (
                    <span style={{ marginLeft: "5px", color: "red" }}>*</span>
                  )}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {/* {
                  (prevData?.correspondingAuthor && !stringsEqual(project.fileId, prevData?.fileId)) &&
                  <span >
                    <span style={{color: 'red'}}><b>Previous: </b>
                    <Button
                  variant="contained"
                  disabled={downloadLoading === project.paperId}
                  color="error"
                  style={{ width: "100%", borderRadius: "0px" }}
                  onClick={() =>
                    handleDownload(
                      project.userId,
                      project.projectId,
                      project.paperId
                    )
                  }
                >
                  {downloadLoading === project.paperId
                    ? "Downloading"
                    : "Download"}
                </Button>
                </span>
                <br/> 
                <br/> 

                <b>New: </b>
                </span>
                } */}

                <Button
                  variant="contained"
                  disabled={downloadLoading === project.id}
                  style={{ width: "100%", borderRadius: "0px" }}
                  onClick={() =>
                    handleDownload(
                      project.correspondingAuthor,
                      project.projectId,
                      project.id
                    )
                  }
                >
                  {downloadLoading === project.id ? "Downloading" : "Download"}
                </Button>
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
                Supervisor(s)
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {project.authors.map((author: any, index) => {
                  return (
                    <div key={index}>
                      {
                        authorsData?.find((e) => e?.authorId === author)
                          ?.supervisor
                      }
                    </div>
                  );
                })}
              </Typography>
            </AccordionDetails>
          </Accordion>
          {/* <Accordion
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon  />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography sx={{ width: "100%", flexShrink: 0 }}>
                 File
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography >
                <div>{project?.fileId}</div>
                <Button style={{marginTop: '10px'}} variant="contained">Download</Button>
                </Typography>
              </AccordionDetails>
            </Accordion> */}
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginBottom: "20px",
            padding: "20px 10px",
            background: "#fff",
          }}
        >
          <>
            <div>
              <Box sx={{ width: "100%" }}>
                <FormControl fullWidth>
                  <InputLabel
                    disabled={
                      toBeReviewedLoading ||
                      reviewers?.filter(
                        (e) =>
                          !assignedReviewers?.some(
                            (f) => e?.reviewerId === f?.reviewerId
                          )
                      )?.length <= 0
                    }
                    id="authors"
                  >
                    Assign reviewer(s)
                  </InputLabel>
                  <Select
                    labelId="assignedReviewers"
                    id="demo-simple-select"
                    label="Assign reviewer(s)"
                    disabled={
                      toBeReviewedLoading ||
                      reviewers?.filter(
                        (e) =>
                          !assignedReviewers?.some(
                            (f) => e?.reviewerId === f?.reviewerId
                          )
                      )?.length <= 0
                    }
                    name="assignedReviewers"
                    style={{
                      borderRadius: "0px",
                      width: "100%",
                    }}
                    onChange={(e) => {
                      const assignedReviewer = reviewers.find(
                        (user: any) => user.reviewerId === e.target.value
                      );

                      setAssignedReviewers((prev) => [
                        ...prev,
                        assignedReviewer,
                      ]);
                    }}
                  >
                    {reviewers
                      ?.filter((e) => {
                        return !assignedReviewers?.some((f) => {
                          console.log("holaa", f, e);
                          return e?.reviewerId === f?.reviewerId;
                        });
                      })
                      .map((user: any) => {
                        const supervisors = [];
                        supervisors.push(
                          authorsData?.find(
                            (e) => e?.authorId === project.correspondingAuthor
                          )?.supervisor
                        );

                        {
                          project.authors.map((author: any, index) => {
                            supervisors.push(
                              authorsData?.find((e) => e?.authorId === author)
                                ?.supervisor
                            );
                          });
                        }

                        return (
                          <MenuItem
                            style={{
                              color: supervisors.some(
                                (e) =>
                                  `${user.firstName} ${user.lastName}` === e
                              )
                                ? "red"
                                : "#4e4e4e",
                            }}
                            key={user.reviewerId}
                            value={user.reviewerId}
                          >
                            {`${user.firstName} ${user.lastName}`}{" "}
                            {supervisors.some(
                              (e) => `${user.firstName} ${user.lastName}` === e
                            ) && "(COI)"}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
                {reviewers?.filter(
                  (e) =>
                    !assignedReviewers?.some(
                      (f) => e?.reviewerId === f?.reviewerId
                    )
                )?.length <= 0 && (
                  <div
                    style={{
                      color: "red",
                      marginTop: "5px",
                      fontSize: "small",
                    }}
                  >
                    No reviewers left
                  </div>
                )}
              </Box>
            </div>
            <div className="selectedUserNames">
              {assignedReviewers?.map((reviewer, index) => {
                const supervisors = [];
                supervisors.push(
                  authorsData?.find(
                    (e) => e?.authorId === project.correspondingAuthor
                  )?.supervisor
                );

                {
                  project.authors.map((author: any, index) => {
                    supervisors.push(
                      authorsData?.find((e) => e?.authorId === author)
                        ?.supervisor
                    );
                  });
                }
                return (
                  <div
                    style={{
                      display: "flex",
                      flex: 1,
                      justifyContent: "space-between",
                      margin: "10px 5px",
                      background: "#ccc",
                      borderRadius: "5px",
                      padding: "5px",
                      alignItems: "center",
                      gap: "5px",
                      color: supervisors.some(
                        (e) =>
                          `${reviewer.firstName} ${reviewer.lastName}` === e
                      )
                        ? "red"
                        : "#4e4e4e",
                    }}
                    key={index}
                  >
                    {reviewer?.firstName} {reviewer?.lastName}{" "}
                    {supervisors.some(
                      (e) => `${reviewer.firstName} ${reviewer.lastName}` === e
                    ) && "(COI)"}
                    <IconButton
                      type="button"
                      aria-label="delete"
                      size="small"
                      onClick={() => {
                        setAssignedReviewers((prev) =>
                          prev?.filter(
                            (e) => e?.reviewerId !== reviewer?.reviewerId
                          )
                        );
                      }}
                    >
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </div>
                );
              })}
            </div>
            {toBeReviewed?.find((e) => project?.id === e?.id)?.finalResult ? (
              <div
                style={{
                  color: "red",
                  marginTop: "5px",
                  fontSize: "small",
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                  display: "flex",
                }}
              >
                Paper has already been reviewed and cannot be updated
              </div>
            ) : submitting ? (
              <LoadingButton
                color="secondary"
                loading={true}
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="contained"
                style={{ width: "100%", borderRadius: "0px" }}
              >
                <span>Submitting</span>
              </LoadingButton>
            ) : (
              <Button
                color="success"
                variant="contained"
                style={{ borderRadius: "0px", width: "100%" }}
                disabled={
                  submitting === project?.id ||
                  toBeReviewedLoading ||
                  assignedReviewers?.length === 0

                  // ||
                  // toBeReviewed?.some(
                  //   (e) => project?.paperId === e?.paperId
                  // )
                }
                onClick={() => handleSendForReview(project, assignedReviewers)}
              >
                {toBeReviewed?.some((e) => project?.id === e?.id)
                  ? paperUpdateRequest
                    ? "Click here to update as requested"
                    : "Update"
                  : "Send for review"}
              </Button>
            )}
          </>
        </div>

        <Button variant="contained" style={{ width: "100%" }} onClick={onClose}>
          close
        </Button>
      </div>
    </StyledAssesmentView>
  );
};

export default MoreInfo;
