import { useRef, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";

export const useVideoCompressor = () => {
  // Initialize FFmpeg instance using useRef to maintain its state between renders
  const ffmpegRef = useRef(new FFmpeg());

  // Define the compressVideo function using useCallback to ensure stability
  const compressVideo = useCallback(async (file, targetFileSizeBytes) => {
    const ffmpeg = ffmpegRef.current;
    const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm";

    try {
      console.log("Loading FFmpeg core...");

      // Load FFmpeg core and WASM
      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
        workerURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.worker.js`,
          "text/javascript"
        ),
      });

      console.log("FFmpeg loaded successfully.");

      // Write the input file into FFmpeg's file system
      await ffmpeg.writeFile("input.mkv", await fetchFile(file));

      // Calculate the desired bitrate
      const bitrate =
        Math.ceil((targetFileSizeBytes * 8) / (file.size / 1000)) + "k";

      // Run FFmpeg to compress the video
      console.log("Running FFmpeg to compress the video...");
      await ffmpeg.exec([
        "-i",
        "input.mkv",
        "-b:v",
        bitrate, // Set the bitrate
        "output.mp4",
      ]);

      console.log("Video compression completed.");

      // Read the output file from FFmpeg's file system
      const data = await ffmpeg.readFile("output.mp4");
      const compressedBlob = new Blob([data.buffer], { type: "video/mp4" });

      // Clean up
      await ffmpeg.unlink("input.mkv");
      await ffmpeg.unlink("output.mp4");

      return compressedBlob;
    } catch (error) {
      console.error("Error during video compression:", error);
      throw error;
    } finally {
      // Ensure any additional cleanup
      console.log("Cleaning up FFmpeg resources...");
      ffmpeg.terminate();
    }
  }, []);

  return { compressVideo };
};
