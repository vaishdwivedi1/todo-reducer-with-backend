import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Routing from "./Routing";
function App() {
  return (
    <>
      <Routing />{" "}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />{" "}
    </>
  );
}

export default App;
