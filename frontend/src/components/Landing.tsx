import { useState, useEffect, useRef } from "react";
import { Room } from "./Room";
import { Register } from "./Register";

function Landing() {
  const [user, setUser] = useState(null);
  const [login, setLogin] = useState(false);
  const [name, setName] = useState("");

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
  }, [videoRef]);

  if (!joined) {
    return (
      <div className="h-[100vh] flex flex-col justify-center items-center gap-8">
        <video
          autoPlay
          width={600}
          height={400}
          style={{ borderRadius: "15px" }}
          ref={videoRef}
        ></video>
        <button
          onClick={() => {
            if (user === null) {
              setLogin(!login);
              console.log(login);
            } else {
              setJoined(true);
            }
          }}
          className="select-none rounded-lg bg-gray-900 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
          data-dialog-target="sign-in-dialog"
        >
          {user !== null ? (
            <div>join the room</div>
          ) : (
            <>
              <div>sign in to join the room</div>
            </>
          )}
        </button>
        {login && <Register setLogin={setLogin} />}
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
