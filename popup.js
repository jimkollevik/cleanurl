document.addEventListener("DOMContentLoaded", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab && tab.url) {
        const cleanedURL = tab.url.split("/?")[0]; // Remove everything after "/?"

        // Update button text with cleaned URL
        const copyBtn = document.getElementById("copy-btn");
        copyBtn.textContent = cleanedURL;

        // Copy URL when clicked
        copyBtn.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(cleanedURL);
                copyBtn.textContent = "Copied!";
                setTimeout(() => (copyBtn.textContent = cleanedURL), 1500);
            } catch (err) {
                console.error("Failed to copy:", err);
                copyBtn.textContent = "Error!";
            }
        });
    }
});