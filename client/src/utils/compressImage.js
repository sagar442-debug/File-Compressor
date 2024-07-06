// Function to compress an image with a specified quality

export const compressImage = (file, quality) => {
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
