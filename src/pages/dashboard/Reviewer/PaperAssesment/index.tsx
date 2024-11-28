import React, { useEffect, useState } from "react";
import usePaperAssessment from "../../../../hooks/usePaperAssesment"; // Import your custom hook
import { PaperAssesmentFormProps } from "../../../../types/dashboard/Reviewer/props";
import { PaperAssesmentDataType } from "../../../../types/dashboard/Reviewer/types";
import { initialPaperAssesmentData } from "../../../../data/pages/dashboard/Reviewer/InitialPaperAssesmentData";
import Button from "@mui/material/Button";

import TextField from "@mui/material/TextField";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";
import toast from "react-hot-toast";
import useGetReviewerData from "../../../../hooks/useGetReviewerData";
import { useParams, useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";

import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const PaperAssessmentForm: React.FC<PaperAssesmentFormProps> = ({}) => {
  const {
    userData,
    loading: userDataLoading,
    setUpdateData,
  } = useGetReviewerData();
  const toBeReviewed = [
    ...(userData?.assessedPapers?.toBeReviewedPapers || []),
    ...(userData?.assessedPapers?.reviewedPapers || []),
  ];
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedPaper, setSelectedPaper] = useState({});
  console.log("id", id);
  useEffect(() => {
    const targetPaper = toBeReviewed?.find((e) => {
      console.log("e", e);
      return e?.id === parseInt(id);
    });
    setSelectedPaper(targetPaper);
    if (targetPaper?.review) {
      setFormData(targetPaper);
    }
  }, [id, toBeReviewed, userData]);
  const [disableButton, setDisableButton] = useState(false);
  const { submitAssessment, submitted, loading } = usePaperAssessment();
  const [formData, setFormData] = useState<PaperAssesmentDataType>(
    initialPaperAssesmentData
  );

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("formData", formData);

    try {
      await submitAssessment(
        formData,
        selectedPaper.correspondingAuthor,
        selectedPaper.projectId,
        selectedPaper?.id,
        selectedPaper?.paperUpdated
      );
      toast.success("Assessment Submitted");
      setDisableButton(true);
      setUpdateData((prev) => !prev);
      // Reset the form after submission...
    } catch (err) {
      console.error("Error submitting assessment:", err);
      // Handle error scenarios...
    }
  };

  useEffect(() => {
    if (submitted) {
      navigate("/reviewer-dashboard/assess-papers");
    }
  }, [submitted]);

  return (
    <form
      style={{
        margin: "2rem",
        flex: 1,
        background: "rgba(255,255,255,1)",
        padding: "1rem",
        borderRadius: "1rem",
        boxShadow: "5px 5px 20px rgba(0,0,0,0.3)",
        overflow: "hidden",
      }}
      onSubmit={handleFormSubmit}
    >
      <div
        style={{
          position: "relative",
          flex: 1,
          width: "100%",
          height: "100%",
          overflow: "auto",
        }}
      >
        <div
          style={{
            flex: 1,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.5rem",
            marginTop: "20px",
            marginBottom: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Tooltip title="Go Back">
            <IconButton
              onClick={() => {
                navigate("/reviewer-dashboard/assess-papers");
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          REVIEW FORM
        </div>

        {/* INPUT FIELDS */}
        <div
          style={{
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          {/* ____________________Topic_____________________________ */}

          <div
            style={{
              flex: 1,
              padding: "1rem 0rem",
              borderBottom: "5px dotted #ccc",
              paddingBottom: "2rem",
            }}
          >
            <h3 style={{ color: "#5e5e5e" }}>
              1) Asses the topic based on ...
            </h3>
            <div
              style={{
                padding: "0rem 1rem",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "1rem",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <FormControl fullWidth>
                  <InputLabel id="topic">Topic Score</InputLabel>
                  <Select
                    disabled={selectedPaper?.review}
                    value={formData?.topic}
                    labelId="topic"
                    required
                    id="demo-simple-select"
                    label="Topic Score"
                    name="topic"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        topic: parseInt(e.target.value),
                      })
                    }
                  >
                    {[...Array(11).keys()].map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <TextField
                disabled={selectedPaper?.review}
                required
                multiline
                value={formData.topicComment}
                rows={3}
                onChange={(e) =>
                  setFormData({ ...formData, topicComment: e.target.value })
                }
                label={"Reasoning for Topic assessment"}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* ____________________Contribution_____________________________ */}

          <div
            style={{
              flex: 1,
              padding: "1rem 0rem",
              borderBottom: "5px dotted #ccc",
              paddingBottom: "2rem",
            }}
          >
            <h3 style={{ color: "#5e5e5e" }}>
              2) Asses the contribution based on ...
            </h3>
            <div
              style={{
                padding: "0rem 1rem",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "1rem",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <FormControl fullWidth>
                  <InputLabel id="topic">Contribution Score</InputLabel>
                  <Select
                    disabled={selectedPaper?.review}
                    required
                    value={formData.contribution}
                    labelId="contribution"
                    id="demo-simple-select"
                    label="Contribution Score"
                    name="contribution"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contribution: parseInt(e.target.value),
                      })
                    }
                  >
                    {[...Array(11).keys()].map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <TextField
                disabled={selectedPaper?.review}
                required
                multiline
                value={formData.contributionComment}
                rows={3}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contributionComment: e.target.value,
                  })
                }
                label={"Reasoning for Contribution assessment"}
                style={{ width: "100%" }}
              />
            </div>
          </div>
          {/* ________________________Academic Quality______________________________ */}

          <div
            style={{
              flex: 1,
              padding: "1rem 0rem",
              borderBottom: "5px dotted #ccc",
              paddingBottom: "2rem",
            }}
          >
            <h3 style={{ color: "#5e5e5e" }}>
              3) Asses the academic quality based on ...
            </h3>
            <div
              style={{
                padding: "0rem 1rem",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "1rem",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <FormControl fullWidth>
                  <InputLabel id="topic">Academic Quality Score</InputLabel>
                  <Select
                    disabled={selectedPaper?.review}
                    required
                    value={formData.academicQuality}
                    labelId="contribution"
                    id="demo-simple-select"
                    label="Academic Quality Score"
                    name="contribution"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        academicQuality: parseInt(e.target.value),
                      })
                    }
                  >
                    {[...Array(11).keys()].map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <TextField
                disabled={selectedPaper?.review}
                required
                multiline
                value={formData.academicQualityComment}
                rows={3}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    academicQualityComment: e.target.value,
                  })
                }
                label={"Reasoning for Academic Quality assessment"}
                style={{ width: "100%" }}
              />
            </div>
          </div>
          {/* ________________________Verification of Results______________________________ */}

          <div
            style={{
              flex: 1,
              padding: "1rem 0rem",
              borderBottom: "5px dotted #ccc",
              paddingBottom: "2rem",
            }}
          >
            <h3 style={{ color: "#5e5e5e" }}>
              4) Asses the verification of results based on ...
            </h3>
            <div
              style={{
                padding: "0rem 1rem",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "1rem",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <FormControl fullWidth>
                  <InputLabel id="topic">
                    Verification of Results Score
                  </InputLabel>
                  <Select
                    disabled={selectedPaper?.review}
                    required
                    value={formData.verificationOfResults}
                    labelId="Verification of Results"
                    id="demo-simple-select"
                    label="Verification of Results Score"
                    name="Verification of Results"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        verificationOfResults: parseInt(e.target.value),
                      })
                    }
                  >
                    {[...Array(11).keys()].map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <TextField
                disabled={selectedPaper?.review}
                required
                multiline
                value={formData.verificationOfResultsComment}
                rows={3}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    verificationOfResultsComment: e.target.value,
                  })
                }
                label={"Reasoning for Verification of Results assessment"}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* ________________________Novelty______________________________ */}

          <div
            style={{
              flex: 1,
              padding: "1rem 0rem",
              borderBottom: "5px dotted #ccc",
              paddingBottom: "2rem",
            }}
          >
            <h3 style={{ color: "#5e5e5e" }}>
              5) Asses the novelty based on ...
            </h3>
            <div
              style={{
                padding: "0rem 1rem",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "1rem",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <FormControl fullWidth>
                  <InputLabel id="topic">Novelty Score</InputLabel>
                  <Select
                    disabled={selectedPaper?.review}
                    required
                    value={formData.novelty}
                    labelId="Novelty"
                    id="demo-simple-select"
                    label="Novelty Score"
                    name="Novelty"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        novelty: parseInt(e.target.value),
                      })
                    }
                  >
                    {[...Array(11).keys()].map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <TextField
                disabled={selectedPaper?.review}
                required
                multiline
                value={formData.noveltyComment}
                rows={3}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    noveltyComment: e.target.value,
                  })
                }
                label={"Reasoning for Novelty assessment"}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* ________________________Literature Review and Bibliography______________________________ */}

          <div
            style={{
              flex: 1,
              padding: "1rem 0rem",
              borderBottom: "5px dotted #ccc",
              paddingBottom: "2rem",
            }}
          >
            <h3 style={{ color: "#5e5e5e" }}>
              6) Asses the literature review and bibliography based on ...
            </h3>
            <div
              style={{
                padding: "0rem 1rem",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "1rem",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <FormControl fullWidth>
                  <InputLabel id="topic">
                    Literature Review and Bibliography Score
                  </InputLabel>
                  <Select
                    disabled={selectedPaper?.review}
                    required
                    labelId="Literature Review and Bibliography"
                    id="demo-simple-select"
                    label="Literature Review and Bibliography Score"
                    name="Literature Review and Bibliography"
                    value={formData.literatureReviewAndBibliography}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        literatureReviewAndBibliography: parseInt(
                          e.target.value
                        ),
                      })
                    }
                  >
                    {[...Array(11).keys()].map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <TextField
                disabled={selectedPaper?.review}
                required
                multiline
                rows={3}
                value={formData.literatureReviewAndBibliographyComment}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    literatureReviewAndBibliographyComment: e.target.value,
                  })
                }
                label={
                  "Reasoning for Literature Review and Bibliography assessment"
                }
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* ________________________Language______________________________ */}

          <div
            style={{
              flex: 1,
              padding: "1rem 0rem",
              borderBottom: "5px dotted #ccc",
              paddingBottom: "2rem",
            }}
          >
            <h3 style={{ color: "#5e5e5e" }}>
              7) Asses the language based on ...
            </h3>
            <div
              style={{
                padding: "0rem 1rem",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "1rem",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <FormControl fullWidth>
                  <InputLabel id="topic">Language Score</InputLabel>
                  <Select
                    disabled={selectedPaper?.review}
                    required
                    labelId="Language"
                    id="demo-simple-select"
                    label="Language Score"
                    name="Language"
                    value={formData.language}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        language: parseInt(e.target.value),
                      })
                    }
                  >
                    {[...Array(11).keys()].map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <TextField
                disabled={selectedPaper?.review}
                required
                multiline
                rows={3}
                value={formData.languageComment}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    languageComment: e.target.value,
                  })
                }
                label={"Reasoning for Language assessment"}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* ________________________Style and Format______________________________ */}

          <div
            style={{
              flex: 1,
              padding: "1rem 0rem",
              borderBottom: "5px dotted #ccc",
              paddingBottom: "2rem",
            }}
          >
            <h3 style={{ color: "#5e5e5e" }}>
              8) Asses the style and format based on ...
            </h3>
            <div
              style={{
                padding: "0rem 1rem",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "1rem",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <FormControl fullWidth>
                  <InputLabel id="topic">Style and Format Score</InputLabel>
                  <Select
                    disabled={selectedPaper?.review}
                    required
                    labelId="Style and Format"
                    id="demo-simple-select"
                    label="Style and Format Score"
                    name="Style and Format"
                    value={formData.styleAndFormat}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        styleAndFormat: parseInt(e.target.value),
                      })
                    }
                  >
                    {[...Array(11).keys()].map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <TextField
                disabled={selectedPaper?.review}
                required
                multiline
                rows={3}
                value={formData.styleAndFormatComment}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    styleAndFormatComment: e.target.value,
                  })
                }
                label={"Reasoning for Style and Format assessment"}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* ________________________Summary______________________________ */}

          <div
            style={{
              flex: 1,
              padding: "1rem 0rem",
              borderBottom: "5px dotted #ccc",
              paddingBottom: "2rem",
            }}
          >
            <h3 style={{ color: "#5e5e5e" }}>9) Write summary</h3>
            <div
              style={{
                padding: "0rem 1rem",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "1rem",
              }}
            >
              <TextField
                disabled={selectedPaper?.review}
                required
                multiline
                rows={3}
                value={formData.summary}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    summary: e.target.value,
                  })
                }
                label={"Summary"}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* ________________________Comments for Organizing Committee______________________________ */}

          <div
            style={{
              flex: 1,
              padding: "1rem 0rem",
              borderBottom: "5px dotted #ccc",
              paddingBottom: "2rem",
            }}
          >
            <h3 style={{ color: "#5e5e5e" }}>
              10) Provide comments for organizing committee
            </h3>
            <div
              style={{
                padding: "0rem 1rem",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "1rem",
              }}
            >
              <TextField
                disabled={selectedPaper?.review}
                required
                multiline
                rows={3}
                value={formData.commentsForOrganizingCommittee}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    commentsForOrganizingCommittee: e.target.value,
                  })
                }
                label={"Comments for Organizing Committee"}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* ________________________Recommendation______________________________ */}

          <div
            style={{
              flex: 1,
              padding: "1rem 0rem",
              paddingBottom: "2rem",
            }}
          >
            <h3 style={{ color: "#5e5e5e" }}>11) Recommendation to author</h3>
            <div
              style={{
                padding: "0rem 1rem",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "1rem",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <FormControl fullWidth>
                  <InputLabel id="topic">Recommendation</InputLabel>
                  <Select
                    disabled={selectedPaper?.review}
                    required
                    labelId="Recommendation"
                    id="demo-simple-select"
                    label="Recommendation"
                    name="Recommendation"
                    value={formData.recommendation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        recommendation: e.target.value,
                      })
                    }
                  >
                    {["Reject", "Weak Accept", "Accept", "Strong Accept"].map(
                      (option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              </Box>
            </div>
          </div>

          {/* {error && <p>Error: {error}</p>} */}
        </div>

        <div
          style={{
            padding: "1rem",
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          {selectedPaper?.review ? null : loading || userDataLoading ? (
            <LoadingButton
              color="secondary"
              loading={true}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
            >
              <span>Submitting</span>
            </LoadingButton>
          ) : (
            <Button
              // disabled={
              //   formData.topicComment === '' ||
              //   // !formData.topic ||
              //   formData.contributionComment === '' ||
              //   // !formData.contribution ||
              //   formData.academicQualityComment === '' ||
              //   // !formData.academicQuality ||
              //   formData.verificationOfResultsComment === '' ||
              //   // !formData.verificationOfResults ||
              //   formData.noveltyComment === '' ||
              //   // !formData.novelty ||
              //   formData.literatureReviewAndBibliographyComment === '' ||
              //   // !formData.literatureReviewAndBibliography ||
              //   formData.languageComment === '' ||
              //   // !formData.language ||
              //   formData.styleAndFormatComment === '' ||
              //   // !formData.styleAndFormat ||
              //   formData.summary === '' ||
              //   formData.commentsForOrganizingCommittee === '' ||
              //   formData.recommendation === ''
              // }
              disabled={disableButton}
              color="success"
              variant="contained"
              type="submit"
            >
              Submit Assessment
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

export default PaperAssessmentForm;
