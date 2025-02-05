document.addEventListener("DOMContentLoaded", async () => {
    const copyBtn = document.getElementById("copy-btn");
    
    // Reference to the div with the class 'wrapper' in popup.html
    const wrapperDiv = document.querySelector(".content");
    
    // Create the history list element inside the wrapper
    const historyList = document.createElement("ul");
    historyList.style.listStyle = "none";
    historyList.style.padding = "0";
    wrapperDiv.appendChild(historyList);

    // Function to clean the URL (removes everything after "?")
    function cleanURL(url) {
        return url.split("?")[0];
    }

    // Function to update button and handle copying
    function updateAndCopy(url) {
        copyBtn.textContent = url;

        copyBtn.onclick = async () => {
            try {
                await navigator.clipboard.writeText(url);
                copyBtn.textContent = "Copied!";
                await saveToHistory(url);
                renderHistory();
                setTimeout(() => (copyBtn.textContent = url), 1500);
            } catch (err) {
                console.error("Failed to copy:", err);
                copyBtn.textContent = "Error!";
            }
        };
    }

    // Function to save copied URL in session storage (max 5 items)
    async function saveToHistory(url) {
        chrome.storage.local.get(["copiedURLs"], (data) => {
            let history = data.copiedURLs || [];

            if (!history.includes(url)) {
                if (history.length >= 5) {
                    history.shift(); // Remove the oldest entry if at limit
                }
                history.push(url);
                chrome.storage.local.set({ copiedURLs: history });
            }
        });
    }

    // Function to render history list
    function renderHistory() {
        chrome.storage.local.get(["copiedURLs"], (data) => {
            let history = data.copiedURLs || [];
            historyList.innerHTML = ""; // Clear previous entries

            history.forEach((url) => {
                let listItem = document.createElement("li");
                listItem.textContent = url;

                listItem.onclick = async () => {
                    await navigator.clipboard.writeText(url);
                    listItem.textContent = "Copied!";
                    setTimeout(() => (listItem.textContent = url), 1500);
                };

                historyList.appendChild(listItem);
            });
        });
    }

    // Listen for cleaned URL from background script
    chrome.runtime.onMessage.addListener((message) => {
        if (message.type === "setCleanedURL") {
            updateAndCopy(cleanURL(message.cleanedURL));
        }
    });

    // Handle the active tab and its URL when popup is loaded
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab && tab.url) {
        updateAndCopy(cleanURL(tab.url));
    }

    // Load history on popup open
    renderHistory();
});
