import React, { useState } from "react";
import { FaRegQuestionCircle } from "react-icons/fa";
import { HiUpload } from "react-icons/hi";
import { IoMdCloseCircle } from "react-icons/io";
import { FFmpeg } from "@ffmpeg/ffmpeg";

const MainBox = () => {
  // State to hold the selected file
  const [file, setFile] = useState(null);
  // State to hold the compressed file
  const [compressedFile, setCompressedFile] = useState(null);
  // State to hold the type of the file (e.g., image/jpeg, video/mp4)
  const [fileType, setFileType] = useState("");
  // Create an instance of FFmpeg for video compression
  const ffmpeg = new FFmpeg({ log: true });
  // State to hold the user-input compressed size in MB
  const [compressedSize, setCompressedSize] = useState();

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

    if (fileType.startsWith("image/")) {
      // If the file is an image, compress it
      let targetQuality = 0.6; // Default quality (e.g., 60%)
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
      const compressedVideo = await compressVideo(file); // Compress the video
      setCompressedFile(compressedVideo); // Set the compressed video as the state
    } else if (fileType === "application/pdf") {
      // If the file is a PDF, handle PDF compression
      const compressedPDF = await compressPDF(file); // Implement compressPDF function
      setCompressedFile(compressedPDF); // Set the compressed PDF as the state
    }
  };

  // Function to compress an image to a target file size in bytes
  const compressImageToTargetSize = async (file, targetFileSizeBytes) => {
    let quality = 1.0; // Initial quality
    let lastCompressedSize = Infinity; // Initialize with a large number

    while (lastCompressedSize > targetFileSizeBytes && quality >= 0) {
      const compressedImage = await compressImage(file, quality); // Compress image with current quality
      lastCompressedSize = compressedImage.size; // Get size of the compressed image
      quality -= 0.1; // Decrease quality (adjust as needed)
    }

    return compressedImage;
  };

  // Function to compress an image with a specified quality
  const compressImage = (file, quality) => {
    return new Promise((resolve) => {
      const reader = new FileReader(); // Create a FileReader to read the file
      reader.readAsDataURL(file); // Read the file as a Data URL
      reader.onload = (event) => {
        const img = new Image(); // Create an Image object
        img.src = event.target.result; // Set the image source to the Data URL
        img.onload = () => {
          const canvas = document.createElement("canvas"); // Create a canvas element
          const ctx = canvas.getContext("2d"); // Get the 2D context of the canvas
          canvas.width = img.width; // Set the canvas width to the image width
          canvas.height = img.height; // Set the canvas height to the image height
          ctx.drawImage(img, 0, 0); // Draw the image on the canvas
          // Convert the canvas to a Blob (compressed image) and resolve the promise
          canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
        };
      };
    });
  };

  // Function to compress a video
  const compressVideo = async (file) => {
    await ffmpeg.load(); // Load FFmpeg
    ffmpeg.FS("writeFile", "input.mp4", await fetchFile(file)); // Write the video file to the FFmpeg filesystem
    // Run FFmpeg to compress the video
    await ffmpeg.run(
      "-i",
      "input.mp4",
      "-vcodec",
      "libx264",
      "-crf",
      "28",
      "output.mp4"
    );
    const data = ffmpeg.FS("readFile", "output.mp4"); // Read the compressed video file from the FFmpeg filesystem
    return new Blob([data.buffer], { type: "video/mp4" }); // Convert the compressed video to a Blob
  };

  // Function to compress a PDF file (placeholder implementation)
  const compressPDF = async (file) => {
    // Implement your PDF compression logic here
    console.log("PDF compression logic will be implemented here.");
    return null; // Placeholder return
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
      <div className=" p-10  bg-purple-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100 shadow-md">
        <div
          className="flex justify-center flex-col items-center space-y-5
        "
        >
          <div className="buttons space-x-4 flex items-center">
            <button className="btn btn-active btn-primary text-white px-7 hover:bg-blue-900 hover:border-blue-900">
              <HiUpload className="text-xl" />
              <span>Upload</span>
            </button>
            <button className="btn btn-active btn-neutral hover:bg-slate-700 x-7 hover:border-slate-700 text-white">
              <IoMdCloseCircle className="text-xl text-red-700" />

              <span>Cancel</span>
            </button>
          </div>
          <div>
            <input
              onChange={handleFileChange}
              type="file"
              className="file-input file-input-bordered file-input-success w-full max-w-xs shadow-lg"
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
