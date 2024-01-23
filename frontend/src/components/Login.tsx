import { Link } from "react-router-dom";

export const Login = () => {
  return (
    <div className="flex" style={{ display: "flex", margin: "0" }}>
      <div
        style={{ height: "100vh", width: "60%", backgroundColor: "aliceblue" }}
      ></div>
      <div>Register</div>
      <div>
        Don't have an account? Please <Link to="/sign-up">Sign Up</Link>
      </div>
    </div>
  );
};
