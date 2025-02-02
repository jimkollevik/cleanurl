// Function to clean the URL
function cleanURL(url) {
    const index = url.indexOf("/?");
    return index !== -1 ? url.substring(0, index) : url;
}

// Listener for the action button
chrome.action.onClicked.addListener((tab) => {
    if (tab.url) {
        // Clean the URL
        const cleanedURL = cleanURL(tab.url);

        // Copy the cleaned URL to the clipboard
        navigator.clipboard.writeText(cleanedURL).then(() => {
            console.log(`Copied cleaned URL: ${cleanedURL}`);
        }).catch((err) => {
            console.error("Failed to copy URL:", err);
        });
    }
});