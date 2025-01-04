document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("pdfFiles");
    const mergeBtn = document.getElementById("mergeBtn");
    const progressSection = document.getElementById("progress-section");
    const progressBar = document.getElementById("progress-bar");
    const resultSection = document.getElementById("result-section");
    const pdfViewer = document.getElementById("pdfViewer");
    const downloadLink = document.getElementById("downloadLink");
    const chooseMergeBtn = document.getElementById("chooseMergeBtn");


    let pdfFiles = [];

    // Enable the merge button when files are selected
    fileInput.addEventListener("change", (event) => {
        pdfFiles = Array.from(event.target.files);
        mergeBtn.disabled = pdfFiles.length === 0;
    });

    // Handle the choose merge button click
    chooseMergeBtn.addEventListener("click", () => {
        if (pdfFiles.length === 0) {
            alert("Please upload at least two PDF files to merge.");
            return;
        }
        mergeBtn.disabled = false;
    });


    

    mergeBtn.addEventListener("click", async () => {
        if (pdfFiles.length === 0) {
            alert("Please upload at least two PDF files to merge.");
            return;
        }

        mergeBtn.disabled = true;
        progressSection.style.display = "block";

        try {
            const mergedPdf = await PDFLib.PDFDocument.create();

            // Load and add each PDF to the merged document
            for (let i = 0; i < pdfFiles.length; i++) {
                const arrayBuffer = await pdfFiles[i].arrayBuffer();
                const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

                copiedPages.forEach((page) => mergedPdf.addPage(page));

                // Update progress bar
                progressBar.value = ((i + 1) / pdfFiles.length) * 100;
            }

            const mergedPdfBytes = await mergedPdf.save();

            // Display the merged PDF in an iframe
            const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            pdfViewer.src = url;

            // Provide a download link
            downloadLink.href = url;
            downloadLink.download = "merged.pdf";
            downloadLink.style.display = "inline-block";

            resultSection.style.display = "block";
        } catch (error) {
            console.error("Error merging PDFs:", error);
            alert("An error occurred while merging the PDFs. Please try again.");
        } finally {
            progressSection.style.display = "none";
            mergeBtn.disabled = false;
        }
    });
});
