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

        // Send cleaned URL to popup for copying
        chrome.runtime.sendMessage({ type: "setCleanedURL", cleanedURL: cleanedURL });
    }
});
