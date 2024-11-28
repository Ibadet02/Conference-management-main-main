import { useEffect, useState } from "react";
import useGetSubmittedPapers from "../../../../hooks/useGetPapersSubmissions";
import { StyledPapers } from "../../../../styles/pages/dashboard/Admin/Papers/index.styled";
import useGetUsers from "../../../../hooks/useGetUsers";
import useCreatePapersToBeReviewed from "../../../../hooks/useCreatePapersToBeReviewed";
import conferenceImage from "../../../../assets/images/thirdConference.jpg";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import Button from "@mui/material/Button";

import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import useGetPapersToBeReviewed from "../../../../hooks/useGetPapersToBeReviewed";
import useGetProjects from "../../../../hooks/useGetProjects";
import useGetAuthorsData from "../../../../hooks/useGetAuthorsData";
import { StyledConferencePopupContainer } from "../../../../styles/pages/dashboard/Author/AllConferences/ConferencePopupContainer.styled";
import Backdrop from "../../../../components/dashboard/mutual/Backdrop";
import MoreInfo from "./MoreInfo";
import useUpdatePapersToBeReviewed from "../../../../hooks/useUpdatePapersToBeReviewed";
import useDownloadPDF from "../../../../hooks/useDownloadPdf";
import AbstractOnly from "../ApprovaAbstract/AbstractOnly";
import UserInformationOnly from "../ApprovaAbstract/UserInformationOnly";
import useGetToBeReviewed from "../../../../hooks/useGetToBeReviewed";

const Papers = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserInfo, setShowUserInfo] = useState(false);

  const { loading, submittedPapers, setUpdateData } = useGetSubmittedPapers();
  const [openAbstract, setOpenAbstract] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [submitting, setSubmitting] = useState("");

  const [assignedReviewers, setAssignedReviewers] = useState<string[][]>([]);
  const [assignedReviewerNames, setAssignedReviewerNames] = useState<
    string[][]
  >([]);
  const collectionName = "reviewerUsers";
  const { users } = useGetUsers(collectionName);
  const createPapersToBeReviewed = useUpdatePapersToBeReviewed();
  // const updatePapersToBe = useCreatePapersToBeReviewed();
  const handleAssignedReviewerChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    dataIndex: number
  ) => {
    const assignedReviewerId = e.target.value;
    const assignedReviewer = users.find(
      (user: any) => user.id === assignedReviewerId
    );

    if (assignedReviewer) {
      setAssignedReviewers((prevData) => {
        const updatedAssignedReviewers = [...prevData];
        const set = new Set(updatedAssignedReviewers[dataIndex]); // Convert to Set
        set.add(assignedReviewerId); // Add the new value
        updatedAssignedReviewers[dataIndex] = Array.from(set); // Convert back to array
        return updatedAssignedReviewers;
      });

      setAssignedReviewerNames((prevData) => {
        const updatedAssignedReviewerNames = [...prevData];
        const set = new Set(updatedAssignedReviewerNames[dataIndex]); // Convert to Set
        set.add(`${assignedReviewer.firstName} ${assignedReviewer.lastName}`); // Add the new value
        updatedAssignedReviewerNames[dataIndex] = Array.from(set); // Convert back to array
        return updatedAssignedReviewerNames;
      });
    }
  };

  const removeAssignedReviewer = (index: number, dataIndex: number) => {
    // Create copies of assignedReviewers and assignedReviewerNames arrays
    const updatedAssignedReviewers = [...assignedReviewers];
    const updatedAssignedReviewerNames = [...assignedReviewerNames];

    // Remove the selected element at the specified index from both arrays
    updatedAssignedReviewers[dataIndex].splice(index, 1);
    updatedAssignedReviewerNames[dataIndex].splice(index, 1);

    // Update the state with the updated arrays
    setAssignedReviewers(updatedAssignedReviewers);
    setAssignedReviewerNames(updatedAssignedReviewerNames);
  };

  const maxTableContentLength = 9;
  const handleOverflowedText = (givenText: string) => {
    if (givenText.length > maxTableContentLength) {
      return `${givenText.substring(0, maxTableContentLength)}...`;
    } else {
      return givenText;
    }
  };
  const handleSendForReview = async (
    paperData: any,
    assignedReviewersData: any
  ) => {
    setSubmitting(paperData?.projectId);
    try {
      const dataToSend = {
        ...paperData,
        assignedReviewers: assignedReviewersData,
      };
      await createPapersToBeReviewed(
        dataToSend,
        "toBeReviewed",
        paperData?.paperId
      );
      console.log("Paper sent for review successfully!");
      setSubmitting("");
    } catch (error) {
      console.error("Error sending paper for review: ", error);
      setSubmitting("");
    }
  };

  const {
    toBeReviewed,
    loading: toBeReviewedData,
    setUpdateData: setToBeReviewed,
  } = useGetToBeReviewed();
  const { projects } = useGetProjects();
  const { authorsData } = useGetAuthorsData();

  const [type, setType] = useState("New");
  const [shownData, setShownData] = useState([]);
  const [archivedData, setArchivedData] = useState([]);

  const { downloadLastPdf, downloadUrl, error, downloadLoading } =
    useDownloadPDF();

  const handleDownload = (
    correspondingAuthorId: string,
    projectId: string,
    paperId: string
  ) => {
    downloadLastPdf(correspondingAuthorId, projectId, paperId);
  };

  function downloadAllFiles() {
    submittedPapers?.forEach((project) =>
      handleDownload(project.userId, project.projectId, project.paperId)
    );
  }

  useEffect(() => {
    const uniqueRows = submittedPapers;
    console.log("uniqueRows", uniqueRows);
    setShownData(
      uniqueRows?.filter(
        (row) =>
          row.abstractApproved &&
          row?.fileId &&
          !toBeReviewed?.some((e) => row.id === e.paperId)
      )
    );
    setArchivedData(
      uniqueRows?.filter(
        (row) =>
          row.abstractApproved &&
          row?.fileId &&
          toBeReviewed?.some((e) => row.id === e.paperId)
      )
    );
  }, [submittedPapers]);

  return (
    <StyledPapers>
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

              {type === "New" ? (
                shownData?.length > 0 ? (
                  <table style={{ color: "#5e5e5e", border: "1px solid #ccc" }}>
                    <thead>
                      <tr>
                        <th style={{ border: "1px solid #ccc" }}>
                          Conference Title
                        </th>
                        <th style={{ border: "1px solid #ccc" }}>
                          Corr Author
                        </th>
                        <th style={{ border: "1px solid #ccc" }}>Co-authors</th>
                        <th style={{ border: "1px solid #ccc" }}>Abstract</th>
                        {/* <th style={{ border: "1px solid #ccc" }}>File</th> */}
                        {/* <th style={{ border: "1px solid #ccc" }}>
                      Assign Reviewer
                    </th>
                    <th style={{ border: "1px solid #ccc" }}>
                      Send for review
                    </th> */}
                        <th style={{ border: "1px solid #ccc" }}>
                          More Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {shownData?.map((row: any, dataIndex) => {
                        const thisItemInDatabase = toBeReviewed?.find(
                          (e) => row?.paperId === e?.paperId
                        );
                        return (
                          <tr key={dataIndex}>
                            <td
                              style={{
                                border: "1px solid #ccc",
                                pointerEvents: "none",
                              }}
                            >
                              {
                                projects?.find((e) => e?.id === row.projectId)
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
                              // title={row.authors}
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
                              title={row.abstract}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: "5px",
                                }}
                              >
                                {handleOverflowedText(row.abstract)}
                                <IconButton
                                  onClick={() => {
                                    setSelectedPaper(row);
                                    setOpenAbstract(true);
                                  }}
                                  aria-label="delete"
                                  size="large"
                                  color="primary"
                                >
                                  <RemoveRedEyeIcon />
                                </IconButton>
                              </div>
                            </td>
                            {/* <td style={{ border: "1px solid #ccc" }}>
                            {row.fileId}
                          </td> */}
                            {/* <td style={{ border: "1px solid #ccc" }}>
                              <>
                                <div>
                                  <Box sx={{ width: "100%" }}>
                                    <FormControl fullWidth>
                                      <InputLabel id="authors">
                                        Assign reviewer(s)
                                      </InputLabel>
                                      <Select
                                        labelId="assignedReviewers"
                                        id="demo-simple-select"
                                        label="Assign reviewer(s)"
                                        name="assignedReviewers"
                                        disabled={toBeReviewedLoading}
                                        style={{
                                          borderRadius: "0px",
                                          width: "100%",
                                        }}
                                        value={
                                          assignedReviewers[dataIndex]?.[
                                            assignedReviewers[dataIndex]
                                              ?.length - 1
                                          ]
                                            ? assignedReviewers[dataIndex]?.[
                                                assignedReviewers[dataIndex]
                                                  ?.length - 1
                                              ]
                                            : thisItemInDatabase?.assignedReviewers?.map(
                                                (item, index) => {
                                                  const val = {
                                                    target: {
                                                      value: item,
                                                    },
                                                  };
                                                  handleAssignedReviewerChange(
                                                    val,
                                                    dataIndex
                                                  );
                                                }
                                              )
                                        } 
                                        onChange={(e) =>
                                          handleAssignedReviewerChange(
                                            e,
                                            dataIndex
                                          )
                                        }
                                      >
                                        <MenuItem value="">Select...</MenuItem>
                                        {users.map((user: any) => (
                                          <MenuItem
                                            key={user.id}
                                            value={user.id}
                                          >
                                            {`${user.firstName} ${user.lastName}`}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </Box>
                                </div>
                                <div className="selectedUserNames">
                                  {assignedReviewerNames[dataIndex]?.map(
                                    (reviewerName, index) => (
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
                                        }}
                                        key={index}
                                      >
                                        {reviewerName}{" "}
                                        <IconButton
                                          type="button"
                                          onClick={() =>
                                            removeAssignedReviewer(
                                              index,
                                              dataIndex
                                            )
                                          }
                                          aria-label="delete"
                                          size="small"
                                        >
                                          <DeleteIcon fontSize="inherit" />
                                        </IconButton>
                                      </div>
                                    )
                                  )}
                                </div>
                              </>
                            </td>
                            <td style={{ border: "1px solid #ccc" }}>
                              <Button
                                variant="contained"
                                style={{ borderRadius: "0px", width: "100%" }}
                                disabled={
                                  submitting === row?.paperId ||
                                  toBeReviewedLoading
                                  // ||
                                  // toBeReviewed?.some(
                                  //   (e) => row?.paperId === e?.paperId
                                  // )
                                }
                                onClick={() =>
                                  handleSendForReview(
                                    row,
                                    assignedReviewers[dataIndex]
                                  )
                                }
                              >
                                {toBeReviewed?.some(
                                  (e) => row?.paperId === e?.paperId
                                )
                                  ? "Update"
                                  : "Send for review"}
                              </Button>
                            </td> */}

                            <td style={{ border: "1px solid #ccc" }}>
                              <Button
                                onClick={() => {
                                  setSelectedPaper(row);
                                  setShowModal(true);
                                }}
                                style={{ width: "100%", borderRadius: "0px" }}
                                variant="contained"
                              >
                                More Actions{" "}
                                {row?.paperUpdateRequest
                                  ? `(Update Requested)`
                                  : ""}
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
                )
              ) : archivedData?.length > 0 ? (
                <table style={{ color: "#5e5e5e", border: "1px solid #ccc" }}>
                  <thead>
                    <tr>
                      <th style={{ border: "1px solid #ccc" }}>
                        Conference Title
                      </th>
                      <th style={{ border: "1px solid #ccc" }}>Corr Author</th>
                      <th style={{ border: "1px solid #ccc" }}>Co-authors</th>
                      <th style={{ border: "1px solid #ccc" }}>Abstract</th>
                      {/* <th style={{ border: "1px solid #ccc" }}>File</th> */}
                      {/* <th style={{ border: "1px solid #ccc" }}>
                      Assign Reviewer
                    </th>
                    <th style={{ border: "1px solid #ccc" }}>
                      Send for review
                    </th> */}
                      <th style={{ border: "1px solid #ccc" }}>More Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {archivedData?.map((row: any, dataIndex) => {
                      const thisItemInDatabase = toBeReviewed?.find(
                        (e) => row?.paperId === e?.paperId
                      );
                      return (
                        <tr key={dataIndex}>
                          <td style={{ border: "1px solid #ccc" }}>
                            {
                              projects?.find((e) => e?.id === row.projectId)
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
                                  (e) => e?.authorId === row.correspondingAuthor
                                )?.firstName
                              }{" "}
                              {
                                authorsData?.find(
                                  (e) => e?.authorId === row.correspondingAuthor
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
                              <span style={{ color: "#ccc", fontSize: "15px" }}>
                                No Co-author(s)
                              </span>
                            )}
                          </td>
                          <td
                            style={{ border: "1px solid #ccc" }}
                            title={row.abstract}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "5px",
                              }}
                            >
                              {handleOverflowedText(row.abstract)}
                              <IconButton
                                onClick={() => {
                                  setSelectedPaper(row);
                                  setOpenAbstract(true);
                                }}
                                aria-label="delete"
                                size="large"
                                color="primary"
                              >
                                <RemoveRedEyeIcon />
                              </IconButton>
                            </div>
                          </td>
                          {/* <td style={{ border: "1px solid #ccc" }}>
                            {row.fileId}
                          </td> */}
                          {/* <td style={{ border: "1px solid #ccc" }}>
                              <>
                                <div>
                                  <Box sx={{ width: "100%" }}>
                                    <FormControl fullWidth>
                                      <InputLabel id="authors">
                                        Assign reviewer(s)
                                      </InputLabel>
                                      <Select
                                        labelId="assignedReviewers"
                                        id="demo-simple-select"
                                        label="Assign reviewer(s)"
                                        name="assignedReviewers"
                                        disabled={toBeReviewedLoading}
                                        style={{
                                          borderRadius: "0px",
                                          width: "100%",
                                        }}
                                        value={
                                          assignedReviewers[dataIndex]?.[
                                            assignedReviewers[dataIndex]
                                              ?.length - 1
                                          ]
                                            ? assignedReviewers[dataIndex]?.[
                                                assignedReviewers[dataIndex]
                                                  ?.length - 1
                                              ]
                                            : thisItemInDatabase?.assignedReviewers?.map(
                                                (item, index) => {
                                                  const val = {
                                                    target: {
                                                      value: item,
                                                    },
                                                  };
                                                  handleAssignedReviewerChange(
                                                    val,
                                                    dataIndex
                                                  );
                                                }
                                              )
                                        } // Set value to the last selected author ID or an empty string if no author is selected
                                        onChange={(e) =>
                                          handleAssignedReviewerChange(
                                            e,
                                            dataIndex
                                          )
                                        }
                                      >
                                        <MenuItem value="">Select...</MenuItem>
                                        {users.map((user: any) => (
                                          <MenuItem
                                            key={user.id}
                                            value={user.id}
                                          >
                                            {`${user.firstName} ${user.lastName}`}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </Box>
                                </div>
                                <div className="selectedUserNames">
                                  {assignedReviewerNames[dataIndex]?.map(
                                    (reviewerName, index) => (
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
                                        }}
                                        key={index}
                                      >
                                        {reviewerName}{" "}
                                        <IconButton
                                          type="button"
                                          onClick={() =>
                                            removeAssignedReviewer(
                                              index,
                                              dataIndex
                                            )
                                          }
                                          aria-label="delete"
                                          size="small"
                                        >
                                          <DeleteIcon fontSize="inherit" />
                                        </IconButton>
                                      </div>
                                    )
                                  )}
                                </div>
                              </>
                            </td>
                            <td style={{ border: "1px solid #ccc" }}>
                              <Button
                                variant="contained"
                                style={{ borderRadius: "0px", width: "100%" }}
                                disabled={
                                  submitting === row?.paperId ||
                                  toBeReviewedLoading
                                  // ||
                                  // toBeReviewed?.some(
                                  //   (e) => row?.paperId === e?.paperId
                                  // )
                                }
                                onClick={() =>
                                  handleSendForReview(
                                    row,
                                    assignedReviewers[dataIndex]
                                  )
                                }
                              >
                                {toBeReviewed?.some(
                                  (e) => row?.paperId === e?.paperId
                                )
                                  ? "Update"
                                  : "Send for review"}
                              </Button>
                            </td> */}

                          <td style={{ border: "1px solid #ccc" }}>
                            <Button
                              onClick={() => {
                                setSelectedPaper(row);
                                setShowModal(true);
                              }}
                              style={{ width: "100%", borderRadius: "0px" }}
                              variant="contained"
                            >
                              More Actions <br />
                              {row?.paperUpdateRequest
                                ? `(Update Requested)`
                                : ""}
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

          {openAbstract && (
            <>
              <StyledConferencePopupContainer>
                <Backdrop onClick={() => setOpenAbstract(false)} />
                <AbstractOnly
                  project={selectedPaper}
                  onClose={() => setOpenAbstract(false)}
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

          {showModal && (
            <>
              <StyledConferencePopupContainer>
                <Backdrop onClick={() => setShowModal(false)} />
                <MoreInfo
                  setUpdateData={(val: boolean) => {
                    setUpdateData(val);
                    setToBeReviewed(val);
                  }}
                  project={selectedPaper}
                  onClose={() => setShowModal(false)}
                />
              </StyledConferencePopupContainer>
            </>
          )}
        </>
      </div>
    </StyledPapers>
  );
};

export default Papers;
