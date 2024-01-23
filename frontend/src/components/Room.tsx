import { useState, useEffect, useRef } from "react";
import { Socket, io } from "socket.io-client";

const URL = "http://localhost:4000";

export const Room = ({
  name,
  localAudioTrack,
  localVideoTrack,
}: {
  name: string;
  localAudioTrack: MediaStreamTrack | null;
  localVideoTrack: MediaStreamTrack | null;
}) => {
  const [socket, setSocket] = useState<null | Socket>(null);
  const [lobby, setLobby] = useState(true);
  const [sendingPc, setSendingPc] = useState<null | RTCPeerConnection>(null);
  const [receivingPc, setReceivingPc] = useState<null | RTCPeerConnection>(
    null
  );
  const [remoteVideoTrack, setRemoteVideoTrack] =
    useState<MediaStreamTrack | null>(null);

  const [remoteAudioTrack, setRemoteAudioTrack] =
    useState<MediaStreamTrack | null>(null);

  const [remoteMediaStream, setRemoteMediaStream] =
    useState<MediaStream | null>(null);

  const remoteVideoRef = useRef<HTMLVideoElement | undefined>();
  const localVideoRef = useRef<HTMLVideoElement | undefined>();

  useEffect(() => {
    // logic to initialize user to the room

    const socket = io(URL);
    socket.on("send-offer", async ({ roomId }) => {
      console.log("send offer please");
      setLobby(false);

      const pc = new RTCPeerConnection();

      setSendingPc(pc);

      if (localAudioTrack) {
        console.error("added track");
        console.log(localAudioTrack);
        pc.addTrack(localAudioTrack);
      }

      if (localVideoTrack) {
        console.error("added track");
        console.log(localVideoTrack);
        pc.addTrack(localVideoTrack);
      }

      pc.onicecandidate = async (e) => {
        console.log("receiving ice candidate locally");
        if (e.candidate) {
          socket.emit("add-ice-candidate", {
            candidate: e.candidate,
            type: "sender",
            roomId,
          });
        }
      };

      pc.onnegotiationneeded = async () => {
        console.log("on negotiation needed, sending offer");
        const sdp = await pc.createOffer();
        pc.setLocalDescription(sdp);
        socket.emit("offer", {
          sdp,
          roomId,
        });
      };
    });

    socket.on("offer", async ({ roomId, sdp: remoteSdp }) => {
      console.log("received offer");
      setLobby(false);
      const pc = new RTCPeerConnection();
      pc.setRemoteDescription(remoteSdp);

      const sdp = await pc.createAnswer();

      pc.setLocalDescription(sdp);
      const stream = new MediaStream();
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
      setRemoteMediaStream(stream);
      // trickle ice
      setReceivingPc(pc);

      pc.ontrack = (e) => {
        alert("on track");
        // const { track, type } = e;

        // if (type === "audio") {
        //   //   setRemoteAudioTrack(track);
        //   // @ts-expect-error nodesc
        //   remoteVideoRef.current.srcObject.addTrack(track);
        // } else {
        //   //   setRemoteVideoTrack(track);
        //   // @ts-expect-error nodesc
        //   remoteVideoRef.current.srcObject.addTrack(track);
        // }
        // // @ts-expect-error nodesc
        // remoteVideoRef.current.play();
      };

      pc.onicecandidate = async (e) => {
        console.log("on ice candidate on receiving side");
        if (e.candidate) {
          socket.emit("add-ice-candidate", {
            candidate: e.candidate,
            type: "receiver",
            roomId,
          });
        }
      };

      socket.emit("answer", {
        roomId,
        sdp: sdp,
      });

      setTimeout(() => {
        const track1 = pc.getTransceivers()[0].receiver.track;
        const track2 = pc.getTransceivers()[1].receiver.track;

        console.log(track1);
        console.log(track2);

        if (track1.kind === "video") {
          setRemoteAudioTrack(track2);
          setRemoteVideoTrack(track1);
        } else {
          setRemoteAudioTrack(track1);
          setRemoteVideoTrack(track2);
        }

        // @ts-expect-error  necessary for adding peer's video
        remoteVideoRef.current.srcObject.addTrack(track1);

        // @ts-expect-error  necessary for adding peer's video
        remoteVideoRef.current.srcObject.addTrack(track2);

        // @ts-expect-error  necessary for adding peer's video
        remoteVideoRef.current.play();
      }, 5000);
    });

    socket.on("answer", ({ roomId, sdp: remoteSdp }) => {
      setLobby(false);
      setSendingPc((pc) => {
        pc?.setRemoteDescription(remoteSdp);
        return pc;
      });
      console.log("loop closed");
    });

    socket.on("lobby", () => {
      setLobby(true);
    });

    socket.on("add-ice-candidate", ({ candidate, type }) => {
      console.log("add ice candidate from remote");
      console.log({ candidate, type });
      if (type == "sender") {
        setReceivingPc((pc) => {
          pc?.addIceCandidate(candidate);
          return pc;
        });
      } else {
        setSendingPc((pc) => {
          pc?.addIceCandidate(candidate);
          return pc;
        });
      }
    });
    setSocket(socket);
  }, [name]);

  useEffect(() => {
    if (localVideoRef.current) {
      if (localVideoTrack) {
        localVideoRef.current.srcObject = new MediaStream([localVideoTrack]);
        localVideoRef.current.play();
      }
    }
  }, [localVideoRef]);

  return (
    <>
      <div>Hi {name}</div>
      <video
        autoPlay
        width={600}
        height={400}
        ref={localVideoRef}
        style={{ borderRadius: "20px" }}
      />
      {lobby ? "Waiting you to connect to someone" : ""}

      <video
        autoPlay
        width={600}
        height={400}
        ref={remoteVideoRef}
        style={{ borderRadius: "20px" }}
      />
    </>
  );
};
