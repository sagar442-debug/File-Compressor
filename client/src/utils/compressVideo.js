export const compressVideo = async (file, targetFileSizeBytes) => {
  await loadFFmpeg(); // Ensure FFmpeg is loaded

  // Write the input file into FFmpeg's file system
  await ffmpeg.writeFile("input.mkv", await fetchFile(file));

  // Calculate the desired bitrate
  const bitrate = Math.ceil(targetFileSizeBytes / (file.size / 1000)) + "k";

  // Run FFmpeg to compress the video
  await ffmpeg.exec([
    "-i",
    "input.mkv",
    "-b:v",
    bitrate, // Set the bitrate
    "output.mp4",
  ]);

  // Read the output file from FFmpeg's file system
  const data = await ffmpeg.readFile("output.mp4");
  const compressedBlob = new Blob([data.buffer], { type: "video/mp4" });

  // Clean up
  await ffmpeg.unlink("input.mkv");
  await ffmpeg.unlink("output.mp4");

  return compressedBlob;
};
