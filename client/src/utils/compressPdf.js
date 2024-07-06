export const compressPDF = async (file, targetFileSizeMB) => {
  try {
    // Load the PDF file
    const pdfBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Calculate the current file size
    const currentFileSizeMB = pdfBytes.byteLength / (1024 * 1024);

    // Calculate the scaling factor based on the target file size
    const scale = Math.sqrt(targetFileSizeMB / currentFileSizeMB);

    // Iterate through pages and perform any optimizations
    const pages = pdfDoc.getPages();
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];

      // Example optimization: Rotating text by 45 degrees and adding watermark
      const rotationInDegrees = 45;
      page.drawText("Optimized", {
        x: 50,
        y: 50,
        size: 50,
        color: rgb(0.95, 0.1, 0.1),
        opacity: 0.3,
        rotate: degrees(rotationInDegrees),
      });

      // Scale the content based on the calculated scale factor
      const { width, height } = page.getSize();
      page.setSize(width * scale, height * scale); // Adjust page size

      // Handle annotations (if available)
      if (page.getAnnotations) {
        const annotations = page.getAnnotations();
        annotations.forEach((annotation) => {
          const annotationRect = annotation.rect;
          annotationRect.x *= scale;
          annotationRect.y *= scale;
          annotationRect.width *= scale;
          annotationRect.height *= scale;
          annotation.rect = annotationRect;
        });
      }
    }

    // Save the optimized PDF
    const compressedPdfBytes = await pdfDoc.save();

    // Create a Blob from the compressed PDF bytes
    const compressedPdfBlob = new Blob([compressedPdfBytes], {
      type: "application/pdf",
    });

    return compressedPdfBlob;
  } catch (error) {
    console.error("Error compressing PDF:", error);
    return null;
  }
};
