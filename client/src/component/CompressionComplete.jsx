import React from "react";
import { MdDownloadForOffline } from "react-icons/md";

const CompressionComplete = () => {
  return (
    <div className="flex justify-center items-center ">
      <div className=" p-10  bg-purple-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100 shadow-md">
        <div
          className="flex justify-center flex-col items-center space-y-5
        "
        >
          <div className="text-white"> Compression Completed</div>
          <div className="buttons space-x-4 ">
            <button className="btn btn-active btn-primary text-white px-7 hover:bg-blue-900 hover:border-blue-900">
              <MdDownloadForOffline className="text-2xl" />

              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompressionComplete;
