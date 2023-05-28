import logo from "./logo.svg";
import "./App.css";
import { useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import { drawMesh } from "./utilities";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [checked, setChecked] = useState(false);

  const runFacemesh = async () => {
    const net = await faceLandmarksDetection.load(
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
    );

    setInterval(() => {
      detect(net);
    }, 300);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const face = await net.estimateFaces({ input: video });
      const ctx = canvasRef.current.getContext("2d");
      drawMesh(face, ctx);
    }
  };

  runFacemesh();
  return (
    <>
      <div className="App">
        <div className="info-bar">
          <h4>Reza Alaedini & Amir Mohammad Babaei - IT Students - Shamsipour University</h4>
        </div>
        <Webcam
          ref={webcamRef}
          className="webcamStyle"
          style={{ filter: checked ? "grayscale(100%)" : "grayscale(0)" }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            width: 640,
            height: 400,
          }}
        />
        <br />
        <div style={{ marginTop: 20 }}>
          <label>Are You in Bright place?</label>
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
          />
        </div>
      </div>
    </>
  );
}

export default App;
