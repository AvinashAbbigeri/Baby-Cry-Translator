function classifyImage() {
    let fileInput = document.getElementById("imageFile"); // Ensure correct ID
    let file = fileInput.files[0];

    if (!file) {
        alert("Please upload an image file!");
        return;
    }

    let formData = new FormData();
    formData.append("file", file);

    // Show a loading message before the delay
    document.getElementById("result").innerHTML = "Processing... Please wait.";

    // Delay execution of the fetch request by 2 seconds
    setTimeout(() => {
        fetch("/predict", {
            method: "POST",
            body: formData
        })
        .then(response => response.text())  // Read response as text first
        .then(text => {
            console.log("Raw Response:", text);  // Debugging

            try {
                let data = JSON.parse(text);  // Try to parse JSON
                if (data.error) {
                    alert("Error: " + data.error);
                } else {
                    document.getElementById("result").innerHTML = "Prediction: " + data.prediction;
                }
            } catch (error) {
                console.error("Parsing Error:", error);
                alert("Unexpected response from server.");
            }
        })
        .catch(error => {
            console.error("Fetch Error:", error);
            alert("Something went wrong!");
        });
    }, 2000); // 2-second delay
}
