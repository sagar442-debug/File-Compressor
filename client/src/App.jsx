import CompressionComplete from "./component/CompressionComplete";
import MainBox from "./component/MainBox";

function App() {
  return (
    <div className="font-montserrat flex h-screen items-center flex-col justify-center space-y-10">
      <div className="text-white text-4xl font-semibold">Upload a File</div>
      <MainBox />
      {/* <CompressionComplete /> */}
    </div>
  );
}

export default App;
