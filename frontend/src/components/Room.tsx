import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

function Room() {
  const [searchParams, setSearchParams] = useSearchParams();
  const name = searchParams.get("name");

  useEffect(() => {
    // logic to initialize user to the room
  }, [name]);
  return <div>Hi {name}</div>;
}

export default Room;
