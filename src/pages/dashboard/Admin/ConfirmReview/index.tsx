/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { StyledConfirmReview } from "../../../../styles/pages/dashboard/Admin/ConfirmReview/index.styled";
import useGetToBeReviewed from "../../../../hooks/useGetToBeReviewed";
import useDownloadPDF from "../../../../hooks/useDownloadPdf";
import { StyledConferencePopupContainer } from "../../../../styles/pages/dashboard/Author/AllConferences/ConferencePopupContainer.styled";
import Backdrop from "../../../../components/dashboard/mutual/Backdrop";
import AssesmentView from "./AssesmentView";

import Button from "@mui/material/Button";

import useGetFinalReviews from "../../../../hooks/useGetFinalReviews";
import useGetProjects from "../../../../hooks/useGetProjects";
import useGetAuthorsData from "../../../../hooks/useGetAuthorsData";
import useGetReviewersList from "../../../../hooks/useGetReviewersList";
import MoreInfo from "./MoreInfo";
import Tooltip from "@mui/material/Tooltip";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import UserInformationOnly from "../ApprovaAbstract/UserInformationOnly";

const Papers = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserInfo, setShowUserInfo] = useState(false);

  const [isAssesmentViewOpen, setIsAssesmentViewOpen] =
    useState<boolean>(false);
  const [selectedPaper, setSelectedPaper] = useState<any | null>(null);

  const [showInfoModal, setShowInfoModal] = useState(false);
  const { toBeReviewed, loading, setUpdateData } = useGetToBeReviewed();
  const reviews = toBeReviewed;
  const { downloadLastPdf, downloadLoading } = useDownloadPDF();

  const handleDownload = (
    correspondingAuthorId: string,
    projectId: string,
    paperId: string
  ) => {
    downloadLastPdf(correspondingAuthorId, projectId, paperId);
  };
  const handleCloseAssesmentView = () => {
    setIsAssesmentViewOpen(false);
  };

  const handleOpenOtherModal = (paper: any) => {
    setShowInfoModal(false);
    setSelectedPaper(paper);
    setIsAssesmentViewOpen(true);
  };

  const handleOpenAssesmentView = (paper: any) => {
    setSelectedPaper(paper);
    setIsAssesmentViewOpen(true);
  };
  const maxTableContentLength = 9;
  const handleOverflowedText = (givenText: string) => {
    if (givenText.length > maxTableContentLength) {
      return `${givenText.substring(0, maxTableContentLength)}...`;
    } else {
      return givenText;
    }
  };

  const { projects } = useGetProjects();
  const { authorsData } = useGetAuthorsData();
  const { reviewersList } = useGetReviewersList();
  const [type, setType] = useState("New");

  const uniqueRows = toBeReviewed?.filter(
    (row, index, self) =>
      index === self.findIndex((r) => r.paperId === row.paperId)
  );

  const [finalRevs, setFinalRevs] = useState([]);

  const {
    finalReviews,
    finalReviewsLoading,
    setUpdateData: setUpdateFinalReviews,
  } = useGetFinalReviews();

  useEffect(() => {
    setFinalRevs(finalReviews);
  }, [finalReviews]);

  function downloadAllFiles() {
    uniqueRows?.forEach((project) =>
      handleDownload(
        project.correspondingAuthor,
        project.projectId,
        project.paperId
      )
    );
  }

  return (
    <StyledConfirmReview>
      <div
        style={{
          overflow: "auto",
          width: "100%",
          height: "100%",
          padding: "1rem",
        }}
      >
        <>
          <div
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
                flex: 1,
                width: "100%",
                height: "100%",
                overflow: "auto",
              }}
            >
              <Button
                variant="outlined"
                disabled={downloadLoading !== ""}
                style={{ width: "100%" }}
                onClick={() => {
                  downloadAllFiles();
                }}
              >
                Download All PDFs
              </Button>

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

              {uniqueRows?.filter((row) =>
                type === "Archived"
                  ? finalReviews?.some((e) => row?.paperId === e?.paperId)
                  : !finalReviews?.some((e) => row?.paperId === e?.paperId)
              )?.length > 0 ? (
                <table style={{ color: "#5e5e5e", border: "1px solid #ccc" }}>
                  <thead>
                    <tr>
                      <th style={{ border: "1px solid #ccc" }}>
                        Project Title
                      </th>
                      <th style={{ border: "1px solid #ccc" }}>Corr Author</th>
                      <th style={{ border: "1px solid #ccc" }}>Co-authors</th>
                      <th style={{ border: "1px solid #ccc" }}>
                        Assigned Reviewers
                      </th>
                      {/* <th style={{ border: "1px solid #ccc" }}>Abstract</th> */}
                      {/* <th style={{ border: "1px solid #ccc" }}>File</th> */}
                      {/* <th style={{ border: "1px solid #ccc" }}>Download File</th> */}
                      {/* <th style={{ border: "1px solid #ccc" }}>Final Assesment</th>
                      <th style={{ border: "1px solid #ccc" }}>Send</th> */}
                      <th style={{ border: "1px solid #ccc" }}>More Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uniqueRows
                      ?.filter((row) =>
                        type === "Archived"
                          ? finalReviews?.some(
                              (e) => row?.paperId === e?.paperId
                            )
                          : !finalReviews?.some(
                              (e) => row?.paperId === e?.paperId
                            )
                      )
                      .map((row: any, dataIndex) => {
                        console.log("reviewsreviews", reviews);
                        const paperReviewerIds: any[] = [];
                        reviews.forEach((rev: any) => {
                          console.log("ssssrev", rev);
                          paperReviewerIds.push(
                            ...(rev?.assignedReviewers ?? [])
                          );
                        });
                        console.log("paperReviewerIds", paperReviewerIds);
                        const paperReviews = reviews.filter(
                          (rev) => rev.paperId === row.paperId
                        );

                        // if(finalReviews?.find((e) => row?.paperId === e?.paperId)?.finalResult)
                        // {
                        //   setFinalAssessments((prevState) => ({
                        //     ...prevState,
                        //     [row.paperId]: finalReviews?.find((e) => row?.paperId === e?.paperId)?.finalResult
                        //   }));
                        // }

                        // console.log("AAFASF")

                        return (
                          <tr key={dataIndex}>
                            <td style={{ border: "1px solid #ccc" }}>
                              {row?.paperUpdated && (
                                <Tooltip title="This paper was updated by the author">
                                  <FontAwesomeIcon
                                    icon={faFlag}
                                    style={{
                                      color: "green",
                                      marginRight: "10px",
                                      cursor: "pointer",
                                    }}
                                  />
                                </Tooltip>
                              )}

                              {
                                projects?.find((e) => e?.id === row?.projectId)
                                  ?.title
                              }
                            </td>
                            <td style={{ border: "1px solid #ccc" }}>
                              <Button
                                style={{
                                  padding: "3px 10px",
                                  height: "25px",
                                  color: "#5e5e5e",
                                }}
                                onClick={() => {
                                  setSelectedUser(row.correspondingAuthor);
                                  setShowUserInfo(true);
                                }}
                              >
                                {
                                  authorsData?.find(
                                    (e) =>
                                      e?.authorId === row.correspondingAuthor
                                  )?.firstName
                                }{" "}
                                {
                                  authorsData?.find(
                                    (e) =>
                                      e?.authorId === row.correspondingAuthor
                                  )?.lastName
                                }
                              </Button>
                            </td>
                            <td
                              style={{ border: "1px solid #ccc" }}
                              className="co-authors"
                            >
                              {row.authors.map((author: any, index: any) => {
                                return (
                                  <div key={index}>
                                    <Button
                                      style={{
                                        padding: "3px 10px",
                                        height: "25px",
                                        color: "#5e5e5e",
                                      }}
                                      onClick={() => {
                                        setSelectedUser(author);
                                        setShowUserInfo(true);
                                      }}
                                    >
                                      <p style={{ margin: "5px" }}>
                                        {authorsData?.find(
                                          (e) => e?.authorId === author
                                        ) ? (
                                          <>
                                            {
                                              authorsData?.find(
                                                (e) => e?.authorId === author
                                              )?.firstName
                                            }{" "}
                                            {
                                              authorsData?.find(
                                                (e) => e?.authorId === author
                                              )?.lastName
                                            }
                                          </>
                                        ) : (
                                          author
                                        )}
                                      </p>
                                    </Button>
                                  </div>
                                );
                              })}

                              {row.authors?.length === 0 && (
                                <span
                                  style={{ color: "#ccc", fontSize: "15px" }}
                                >
                                  No Co-author(s)
                                </span>
                              )}
                            </td>
                            <td
                              style={{ border: "1px solid #ccc" }}
                              className="co-authors"
                            >
                              {row.assignedReviewers.map((reviewer: any) => {
                                console.log(
                                  "reviewer",
                                  reviewer,
                                  paperReviewerIds
                                );
                                return (
                                  <p key={reviewer}>
                                    <Button
                                      variant="outlined"
                                      style={{
                                        width: "100%",
                                        borderRadius: "0px",
                                        margin: "2px 0px",
                                      }}
                                      disabled={
                                        !paperReviews.find(
                                          (review) =>
                                            review.reviewerId === reviewer
                                        )
                                      }
                                      onClick={() => {
                                        const paperReview = paperReviews.find(
                                          (review) =>
                                            review.reviewerId === reviewer
                                        );
                                        if (paperReview)
                                          handleOpenAssesmentView(paperReview);
                                      }}
                                    >
                                      {
                                        reviewersList?.find(
                                          (e) => e?.reviewerId === reviewer
                                        )?.firstName
                                      }{" "}
                                      {
                                        reviewersList?.find(
                                          (e) => e?.reviewerId === reviewer
                                        )?.lastName
                                      }
                                    </Button>
                                  </p>
                                );
                              })}
                            </td>
                            {/* <td style={{ border: "1px solid #ccc" }}>

                    {
                      finalRevs?.find((e) => row?.paperId === e?.paperId)?.finalResult &&
                  
                      <div  style={{
                background:
                finalRevs?.find((e) => row?.paperId === e?.paperId)?.finalResult === "Strong Accept"
                    ? "#28a745"
                    : finalRevs?.find((e) => row?.paperId === e?.paperId)?.finalResult === "Accept"
                    ? "#6f42c1"
                    : finalRevs?.find((e) => row?.paperId === e?.paperId)?.finalResult === "Weak Accept"
                    ? "#fd7e14"
                    : "#dc3545",
                color: "#fff",
                padding: '10px 5px',
                margin: '5px 0px',
                marginBottom: '10px'
              }}
              >Current Result: {finalRevs?.find((e) => row?.paperId === e?.paperId)?.finalResult}</div>
            }
            
                    <>
  <Box sx={{ width: "100%" }}>
    <FormControl fullWidth>
      <InputLabel id="final-assessment-label">Final Assessment</InputLabel>
      <Select
        style={{ width: '100%', borderRadius: '0px' }}
        labelId="final-assessment-label"
        // defaultValue={
        //   finalReviews?.find((e) => row?.paperId === e?.paperId)?.finalResult
        // }
        id="final-assessment-select"
        label="Final Assessment"
        name="finalAssessment"
        value={finalAssessments[row.paperId]}
        onChange={(e) => handleFinalAssessmentChange(row.paperId, e)}
      >
        <MenuItem value="">Select...</MenuItem>
        <MenuItem value="Reject">Reject</MenuItem>
        <MenuItem value="Weak Accept">Weak Accept</MenuItem>
        <MenuItem value="Accept">Accept</MenuItem>
        <MenuItem value="Strong Accept">Strong Accept</MenuItem>
      </Select>
    </FormControl>
  </Box>
</>

                    </td>
                    <td style={{ border: "1px solid #ccc" }}>
                      {
                        finalReviews?.find((e) => row?.paperId === e?.paperId)?.finalResult ?
                        
                        <Button
                        
                              style={{width: '100%', borderRadius: '0px'}}
                              disabled={!finalAssessments[row.paperId] || updating}
                        // disabled={iDLoading===row?.projectId || finalReviewsLoading || finalReviews?.some((e) => row?.paperId === e?.paperId)}
                        variant="contained"
                        color="success"
                          onClick={() => {
                            const finalReviewData = {
                              ...row,
                              reviews: paperReviews,
                              finalResult: finalAssessments[row.paperId],
                            };
                            updateFinalReview(finalReviewData, "finalReviews", row.id);
                          }}
                        >
                            Update
                        </Button>
                        :
                        <Button
                        
                              style={{width: '100%', borderRadius: '0px'}}
                        disabled={iDLoading===row?.projectId || finalReviewsLoading || finalReviews?.some((e) => row?.paperId === e?.paperId)}
                        variant="contained"
                        color="success"
                          onClick={() => {
                            const finalReviewData = {
                              ...row,
                              reviews: paperReviews,
                              finalResult: finalAssessments[row.paperId],
                            };
                            createFinalReviews(finalReviewData, "finalReviews", row.id);
                          }}
                        >
                          {
                            (finalReviews?.some((e) => row?.paperId === e?.paperId))
                            ?
                            "Sent"
                            :
                            "Send"
                          }
                        </Button>

                      }
                    </td> */}
                            <td style={{ border: "1px solid #ccc" }}>
                              <Button
                                onClick={() => {
                                  setSelectedPaper(row);
                                  setShowInfoModal(true);
                                }}
                                style={{ width: "100%", borderRadius: "0px" }}
                                variant="contained"
                              >
                                More Actions
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              ) : (
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
                  {loading ? "Loading Data" : "No Data"}
                </div>
              )}
            </div>
          </div>
          {isAssesmentViewOpen && (
            <>
              <StyledConferencePopupContainer>
                <Backdrop onClick={handleCloseAssesmentView} />
                <AssesmentView
                  paperAssesment={selectedPaper}
                  onClose={handleCloseAssesmentView}
                />
              </StyledConferencePopupContainer>
            </>
          )}

          {showUserInfo && (
            <>
              <StyledConferencePopupContainer>
                <Backdrop onClick={() => setShowUserInfo(false)} />
                <UserInformationOnly
                  userId={selectedUser}
                  onClose={() => setShowUserInfo(false)}
                />
              </StyledConferencePopupContainer>
            </>
          )}

          {showInfoModal && (
            <>
              <StyledConferencePopupContainer>
                <Backdrop
                  onClick={() => {
                    setShowInfoModal(false);
                  }}
                />
                <MoreInfo
                  handleOpenOtherModal={handleOpenOtherModal}
                  project={selectedPaper}
                  onClose={() => {
                    setShowInfoModal(false);
                  }}
                  setUpdateData={(val) => {
                    setUpdateData(val);
                    setUpdateFinalReviews(val);
                  }}
                />
              </StyledConferencePopupContainer>
            </>
          )}
        </>
      </div>
    </StyledConfirmReview>
  );
};

export default Papers;
