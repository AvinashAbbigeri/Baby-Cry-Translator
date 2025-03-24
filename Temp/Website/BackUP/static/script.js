function classifyImage() {
    let fileInput = document.getElementById("imageFile");
    let file = fileInput.files[0];
    let resultDiv = document.getElementById("result");
    let uploadButton = document.getElementById(".btn"); 

    if (!file) {
        alert("Please upload an image file!");
        return;
    }

    if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed!");
        return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File size exceeds 5MB! Please upload a smaller image.");
        return;
    }

    let formData = new FormData();
    formData.append("file", file);

    // Show a loading message before the delay
    resultDiv.innerHTML = `<p><img src="/static/loading.gif" alt="Loading..." width="30"> Processing...</p>`;

    // Disable button to prevent multiple clicks
    uploadButton.disabled = true;

    // Delay execution of the fetch request by 2 seconds
    setTimeout(() => {
        fetch("/predict", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())  // Expect JSON directly
        .then(data => {
            if (data.error) {
                resultDiv.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
            } else {
                resultDiv.innerHTML = `<p><strong>Prediction:</strong> ${data.prediction}</p>`;
            }
        })
        .catch(error => {
            console.error("Fetch Error:", error);
            resultDiv.innerHTML = `<p style="color: red;">Something went wrong!</p>`;
        })
        .finally(() => {
            uploadButton.disabled = false; // Re-enable button after process completes
        });
    }, 2000); // 2-second delay
}
