document.addEventListener("DOMContentLoaded", async () => {
    // Listen for cleaned URL from background script
    chrome.runtime.onMessage.addListener((message) => {
        if (message.type === "setCleanedURL") {
            const cleanedURL = message.cleanedURL;

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

    // Handle the active tab and its URL when popup is loaded
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
