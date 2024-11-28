import React from "react";
import { Chart } from "react-google-charts";
import useGetProjects from "../../../../../hooks/useGetProjects";

const AllConferencesChart: React.FC = () => {
  const { projects, loading } = useGetProjects();

  // Prepare data for the chart
  const chartData = projects.map((project) => {
    return [project.title, 5];
  });

  const vibrantColors = ["#7047eb"];

  const options = {
    animation: {
      startup: true,
      easing: "linear",
      duration: 1500,
    },
    enableInteractivity: false,
    hAxis: {
      title: "Conferences",
    },
    vAxis: {
      title: "Who Can Apply",
      minValue: 0,
      ticks: [
        { v: 1, f: "BSc" },
        { v: 2, f: "MSc" },
        { v: 3, f: "PhD" },
        { v: 4, f: "Researcher" },
        { v: 5, f: "Other" },
      ],
    },
    colors: vibrantColors,
  };

  return (
    <div
      style={{
        flex: 1,
        background: "rgba(255,255,255,1)",
        padding: "1rem",
        borderRadius: "1rem",
        boxShadow: "5px 5px 20px rgba(0,0,0,0.2)",
        overflow: "hidden",
      }}
    >
      <>
        <div
          style={{
            width: "100%",
            fontWeight: "bolder",
            textAlign: "center",
            color: "#2e2e2e",
          }}
        >
          ALL CONFERENCES
        </div>
        {projects?.length > 0 ? (
          <Chart
            chartType="LineChart"
            data={[["Conference", "Who Can Apply"], ...chartData]}
            options={options}
            width="100%"
            height="200px"
            legendToggle
          />
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
      </>
    </div>
  );
};

export default AllConferencesChart;
