/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyledAssesmentView } from "../../../../styles/pages/dashboard/Admin/ConfirmReview/AssesmentView.styled";
import { MoreInfoProps } from "../../../../types/dashboard/Admin/props";
import Button from "@mui/material/Button";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useGetPapersToBeReviewed from "../../../../hooks/useGetPapersToBeReviewed";
import useGetProjects from "../../../../hooks/useGetProjects";
import useGetAuthorsData from "../../../../hooks/useGetAuthorsData";
import { useEffect, useState } from "react";
import useGetUsers from "../../../../hooks/useGetUsers";

import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";

import useUpdatePapersToBeReviewed from "../../../../hooks/useUpdatePapersToBeReviewed";
import useDownloadPDF from "../../../../hooks/useDownloadPdf";
import TextField from "@mui/material/TextField";

import toast from "react-hot-toast";

import {
  approveOrRejectAbstract,
  useUpdateAuthorStatus,
} from "../../../../hooks/usePaperAbstractApproval";

const MoreInfo: React.FC<MoreInfoProps> = ({
  onClose,
  project,
  setUpdateData,
}) => {
  const { toBeReviewed, toBeReviewedLoading } = useGetPapersToBeReviewed();
  const { projects } = useGetProjects();
  const { authorsData } = useGetAuthorsData();
  const [note, setNote] = useState(project?.note ? project?.note : "");
  const [paperUpdateRequest, setPaperUpdateRequest] = useState(
    project?.paperUpdateRequest ? project?.paperUpdateRequest : false
  );
  const [prevData, setPrevData] = useState(project ? project : {});

  console.log("project", project);
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

  const [submitting, setSubmitting] = useState(false);
  const [rejectSubmitting, setRejectSubmitting] = useState(false);
  const { updateAuthorStatus } = useUpdateAuthorStatus();
  const [assignedReviewers, setAssignedReviewers] = useState<string[][]>([]);
  const [assignedReviewerNames, setAssignedReviewerNames] = useState<
    string[][]
  >([]);
  const collectionName = "reviewerUsers";
  const { users } = useGetUsers(collectionName);
  const createPapersToBeReviewed = useUpdatePapersToBeReviewed();

  const handleSendForReview = async (
    paperData: any,
    assignedReviewersData: any
  ) => {
    setSubmitting(paperData?.projectId);
    try {
      // Extract only the IDs from assignedReviewersData
      const assignedReviewersIds = assignedReviewersData.map(
        (reviewer: any) => reviewer.id
      );

      // Construct the data to send
      const dataToSend = {
        ...paperData,
        assignedReviewers: assignedReviewersIds, // Assign only the IDs
      };

      // Call the function to create papers to be reviewed
      await createPapersToBeReviewed(
        dataToSend,
        "toBeReviewed",
        project?.paperId
      );
      setPrevData({});
      setPaperUpdateRequest(false);
      console.log("Paper sent for review successfully!");
      setSubmitting("");
    } catch (error) {
      console.error("Error sending paper for review: ", error);
      setSubmitting("");
    }
  };

  const handleApprove = async () => {
    setSubmitting(true);
    try {
      console.log("project.paperId", project);
      const adminResponse = {
        abstractApproved: true,
        adminResponseMade: true,
        abstractUpdated: false,
        note: note,
      };
      await approveOrRejectAbstract(project?.id, adminResponse);

      await updateAuthorStatus(
        project?.correspondingAuthor,
        "abstract approved",
        2
      );

      toast.success("Abstract Approved");
      setUpdateData((prev:boolean) => !prev);
      setSubmitting(false);
    } catch (e) {
      console.error(e);
      setSubmitting(false);
    } finally {
      onClose();
    }
  };

  const handleReject = async () => {
    setRejectSubmitting(true);
    try {
      const adminResponse = {
        abstractApproved: false,
        adminResponseMade: true,
        abstractUpdated: false,
        note: note,
      };
      await approveOrRejectAbstract(project?.id, adminResponse);

      await updateAuthorStatus(
        project?.correspondingAuthor,
        "abstract rejected",
        1
      );

      toast("Abstract Rejected");
      setUpdateData((prev) => !prev);

      setRejectSubmitting(false);
    } catch (e) {
      console.error(e);
      setRejectSubmitting(false);
    } finally {
      onClose();
    }
  };

  const [blocking, setBlocking] = useState(false);
  const [blockingReason, setBlockingReason] = useState(
    project?.blockingReason ? project?.blockingReason : ""
  );

  const [type, setType] = useState("New");
  const [shownData, setShownData] = useState([]);
  const [archivedData, setArchivedData] = useState([]);

  useEffect(() => {
    const item = toBeReviewed?.find((e) => project?.paperId === e?.paperId);
    setAssignedReviewers(
      users?.filter((e) => item?.assignedReviewers?.some((f) => e?.id === f))
    );
  }, [toBeReviewed, users]);

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
                {project.authors.map((author: any, index: number) => {
                  console.log("author", author, authorsData);
                  return (
                    <div key={index} style={{ margin: "5px" }}>
                      {
                        authorsData?.find((e: any) => e?.authorId === author)
                          ?.firstName
                      }{" "}
                      {
                        authorsData?.find((e: any) => e?.authorId === author)
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
                Academic Selection{" "}
                {prevData?.academicInterest &&
                  !stringsEqual(
                    project.academicInterest,
                    prevData?.academicInterest
                  ) && (
                    <span style={{ marginLeft: "5px", color: "red" }}>*</span>
                  )}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {prevData?.academicInterest &&
                  !stringsEqual(
                    project.academicInterest,
                    prevData?.academicInterest
                  ) && (
                    <span>
                      <span style={{ color: "red" }}>
                        <b>Previous: </b>
                        {prevData?.academicInterest}
                      </span>
                      <br />
                      <br />

                      <b>New: </b>
                    </span>
                  )}
                {project?.academicInterest}
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
                {prevData?.abstract &&
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
          <TextField
            label="Note to author"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ width: "100%" }}
            multiline={true}
            rows={2}
          />
          <div style={{ display: "flex", gap: "10px", width: "100%" }}>
            <div style={{ flex: 1 }}>
              {rejectSubmitting ? (
                <LoadingButton
                  color="secondary"
                  loading={true}
                  loadingPosition="start"
                  startIcon={<SaveIcon />}
                  variant="contained"
                  style={{ width: "100%", borderRadius: "0px" }}
                >
                  <span>Rejecting</span>
                </LoadingButton>
              ) : (
                <Button
                  disabled={
                    (project?.adminResponseMade &&
                      !project?.abstractApproved &&
                      !project?.abstractUpdated) ||
                    project?.blocked
                  }
                  color="error"
                  variant="contained"
                  style={{ borderRadius: "0px", width: "100%" }}
                  onClick={() => handleReject()}
                >
                  {project?.adminResponseMade && !project?.abstractApproved
                    ? "Rejected"
                    : "Reject"}
                </Button>
              )}
            </div>
            <div style={{ flex: 1 }}>
              {submitting ? (
                <LoadingButton
                  color="secondary"
                  loading={true}
                  loadingPosition="start"
                  startIcon={<SaveIcon />}
                  variant="contained"
                  style={{ width: "100%", borderRadius: "0px" }}
                >
                  <span>Approving</span>
                </LoadingButton>
              ) : (
                <Button
                  color="success"
                  disabled={
                    (project?.adminResponseMade &&
                      project?.abstractApproved &&
                      !project?.abstractUpdated) ||
                    project?.blocked
                  }
                  variant="contained"
                  style={{ borderRadius: "0px", width: "100%" }}
                  onClick={() => handleApprove()}
                >
                  {project?.adminResponseMade && project?.abstractApproved
                    ? "Approved"
                    : "Approve"}
                </Button>
              )}
            </div>
          </div>
        </div>

        <Button variant="contained" style={{ width: "100%" }} onClick={onClose}>
          close
        </Button>
      </div>
    </StyledAssesmentView>
  );
};

export default MoreInfo;
