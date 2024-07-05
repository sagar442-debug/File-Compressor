import React, { useEffect } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import useCompressedFile from "../zustand/useCompressedFile";
import { Link, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const CompressionComplete = () => {
  const { setCompressedFile, compressedFile } = useCompressedFile();
  const navigate = useNavigate();
  const handleDownload = () => {
    if (compressedFile) {
      const url = URL.createObjectURL(compressedFile);
      const a = document.createElement("a");
      a.href = url;
      a.download = "compressed_file"; // Set the default file name here
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  useEffect(() => {
    if (!compressedFile) {
      navigate("/");
    }
  }, []);

  const goBack = () => {
    navigate("/");
    setCompressedFile(null);
  };

  return (
    <div className="flex justify-center items-center ">
      <div className=" p-10  bg-purple-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100 shadow-md">
        <div
          className="flex justify-center flex-col items-center space-y-5
        "
        >
          <div className="text-white"> Compression Completed</div>
          <div className="buttons space-x-4 ">
            <button
              onClick={handleDownload}
              className="btn btn-active btn-primary text-white px-7 hover:bg-blue-900 hover:border-blue-900"
            >
              <MdDownloadForOffline className="text-2xl" />

              <span>Download</span>
            </button>
          </div>
          <div>
            <button onClick={goBack} className="btn btn-success text-white">
              <IoMdArrowRoundBack />
              <span>Compress new File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompressionComplete;
