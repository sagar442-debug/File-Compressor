import React, { useEffect, useState } from "react";
import { FaRegQuestionCircle } from "react-icons/fa";
import { HiUpload } from "react-icons/hi";
import { IoMdCloseCircle } from "react-icons/io";

import { PDFDocument, rgb, degrees } from "pdf-lib";
import useCompressedFile from "../zustand/useCompressedFile";
import { useNavigate } from "react-router-dom";
import { compressImage } from "../utils/compressImage";
import { compressPDF } from "../utils/compressPdf";
import { useVideoCompressor } from "../utils/useCompressVideo";

const MainBox = () => {
  const { setCompressedFile, compressedFile, loading, setLoading } =
    useCompressedFile();
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const { compressVideo } = useVideoCompressor();

  // State to hold the user-input compressed size in MB

  const [compressedSize, setCompressedSize] = useState();
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileType(selectedFile.type); // Set the file type
    }
  };

  // Function to handle file compression
  const handleCompress = async () => {
    if (!file) return; // If no file is selected, do nothing

    setLoading(true);

    if (fileType.startsWith("image/")) {
      // If the file is an image, compress it

      let targetQuality = 0.7; // Default quality (e.g., 60%)
      if (compressedSize) {
        // Calculate the target file size in bytes from MB
        const targetFileSizeBytes = compressedSize * 1024 * 1024;
        // Compress the image to meet the target file size
        const compressedImage = await compressImageToTargetSize(
          file,
          targetFileSizeBytes
        );
        setCompressedFile(compressedImage); // Set the compressed image as the state
      } else {
        // Compress the image with default quality
        const compressedImage = await compressImage(file, targetQuality);
        setCompressedFile(compressedImage); // Set the compressed image as the state
      }
    } else if (fileType.startsWith("video/")) {
      // If the file is a video, compress it
      alert(
        "As of current time I have disabled compression of video and am working on fixing a bug for video compression. Please behold this service will be soon opened."
      );

      // let targetSizeBytes = 0;
      // if (compressedSize > 0) {
      //   // converting to bytes

      //   targetSizeBytes = compressedSize * 1024 * 1024;
      // } else {
      //   targetSizeBytes = 0.7 * file.size;
      // }
      // const compressedVideo = await compressVideo(file, targetSizeBytes);
      // setCompressedFile(compressedVideo);

      // Set the compressed video as the state
    } else if (fileType === "application/pdf") {
      // If the file is a PDF, handle PDF compression
      const compressedPDF = await compressPDF(file, compressedSize); // Implement compressPDF function
      setCompressedFile(compressedPDF); // Set the compressed PDF as the state
    } else {
      alert("File not recognized");
    }
    setLoading(false);
    navigate("/download");
  };

  // Function to compress an image to a target file size in bytes

  const compressImageToTargetSize = async (file, targetFileSizeBytes) => {
    let quality = 1.0; // Initial quality
    let lastCompressedSize = Infinity; // Initialize with a large number
    let compressedImage = null; // Declare outside the loop

    while (lastCompressedSize > targetFileSizeBytes && quality >= 0) {
      compressedImage = await compressImage(file, quality); // Compress image with current quality
      lastCompressedSize = compressedImage.size; // Get size of the compressed image
      quality -= 0.01; // Decrease quality (adjust as needed)
    }

    return compressedImage;
  };

  const onCancel = () => {
    setLoading(false);
    setCompressedFile(null);
  };

  return (
    <div className="flex justify-center  items-center ">
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">What does this mean?</h3>
          <p className="py-4">
            Pick the file size in megabytes you want to shrink your file down
            to.
            <br /> <br /> Heads up: <br />
            If you go too low, your file might end up looking pretty bad! So,
            aim for a sensible number.
            <br />
            <br /> Our suggestions:
            <br />
            61% for decent quality.
            <br /> 71% for good quality.
            <br /> <br />
            Anything higher? Even better! Want a specific size in mind? No
            problem. Go for it! It's all up to you. Thanks!
          </p>
        </div>
      </dialog>
      <div className=" p-10  bg-purple-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100 shadow-md">
        <div
          className="flex justify-center flex-col items-center space-y-5
        "
        >
          <div className="buttons space-x-4 flex items-center">
            <button
              onClick={handleCompress}
              className="btn btn-active btn-primary text-white px-7 hover:bg-blue-900 hover:border-blue-900"
            >
              <HiUpload className="text-xl" />
              <span>
                {loading ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  "Compress"
                )}
              </span>
            </button>
            <button
              onClick={onCancel}
              className="btn btn-active btn-neutral hover:bg-slate-700 x-7 hover:border-slate-700 text-white"
            >
              <IoMdCloseCircle className="text-xl text-red-700" />

              <span>Cancel</span>
            </button>
          </div>
          <div>
            <input
              onChange={handleFileChange}
              type="file"
              className="file-input file-input-bordered file-input-success w-full max-w-xs shadow-lg hover:text-white duration-100"
            />
          </div>
          <div className=" flex items-center">
            <label
              className="text-white mr-5 space-x-2 flex items-center justify-between"
              htmlFor=""
            >
              {" "}
              <span>How much Mb</span>
              <button
                className=""
                onClick={() =>
                  document.getElementById("my_modal_3").showModal()
                }
              >
                <FaRegQuestionCircle />
              </button>
            </label>

            <input
              placeholder="20mb"
              type="number"
              className="text-white border-none outline-none text-center bg-[#252a33] rounded-full px-3 py-1 w-24"
              onChange={(e) => setCompressedSize(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainBox;
