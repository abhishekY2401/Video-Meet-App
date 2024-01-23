import { Link } from "react-router-dom";
// import VideoChat from "../assets/video-chat-connect.jpg";

export const Register = () => {
  return (
    <div className="flex" style={{ display: "flex", margin: "0" }}>
      <div>Register</div>
      <div>
        Already have an account? Please <Link to="/sign-in">Sign In</Link>
      </div>
    </div>
  );
};
