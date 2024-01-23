import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Room } from "./Room";

function Landing() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [localAudioTrack, setLocalAudioTrack] =
    useState<MediaStreamTrack | null>(null);

  const [localVideoTrack, setLocalVideoTrack] =
    useState<MediaStreamTrack | null>(null);

  const [joined, setJoined] = useState(false);

  const getCam = async () => {
    await window.navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        const audioTrack = stream.getAudioTracks()[0];
        const videoTrack = stream.getVideoTracks()[0];

        setLocalAudioTrack(audioTrack);
        setLocalVideoTrack(videoTrack);

        if (!videoRef.current) {
          return;
        }

        videoRef.current.srcObject = new MediaStream([videoTrack]);
        videoRef.current.play();
        // MediaStream
      });
  };

  useEffect(() => {
    if (videoRef && videoRef.current) {
      getCam();
    }
    getCam();
  }, [videoRef]);

  if (!joined) {
    return (
      <div>
        <video autoPlay ref={videoRef}></video>
        <button
          onClick={() => {
            if (user === null) {
              // setShowRegister(true);
              navigate("/sign-up");
            } else {
              setJoined(true);
            }
          }}
        >
          {user !== null ? (
            <div>join the room</div>
          ) : (
            <div>sign in / sign up to join the room</div>
          )}
        </button>
      </div>
    );
  }

  return (
    <Room
      name={name}
      localAudioTrack={localAudioTrack}
      localVideoTrack={localVideoTrack}
    />
  );
}

export default Landing;
