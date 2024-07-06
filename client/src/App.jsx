import CompressionComplete from "./component/CompressionComplete";
import MainBox from "./component/MainBox";
import { Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="font-montserrat flex h-screen items-center flex-col justify-center space-y-10">
      <div className="text-white text-5xl drop-shadow-lg font-semibold">
        Upload a File
      </div>
      <Routes>
        <Route path={"/"} element={<MainBox />} />
        <Route path={"/download"} element={<CompressionComplete />} />
      </Routes>
      {/* <CompressionComplete /> */}
    </div>
  );
}

export default App;
