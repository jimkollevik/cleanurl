// Firebase setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
// Wait for Firebase to load
window.onload = async function () {
    // Firebase v8 (simpler to use)
    const firebaseConfig = {
        apiKey: "AIzaSyCWgtB7Ev9SEieGG56mcezK9vYyBcFaiFs",
        authDomain: "clean-url-5aefd.firebaseapp.com",
        databaseURL: "https://clean-url-5aefd-default-rtdb.firebaseio.com/",
        projectId: "clean-url-5aefd",
    };

    // Initialize Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.database();

    // Get the active tab
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab && tab.url) {
        const cleanedURL = tab.url.split("/?")[0];

        // Update button text
        const copyBtn = document.getElementById("copy-btn");
        copyBtn.textContent = cleanedURL;

        // Fetch current count from Firebase
        db.ref("cleanedCount").once("value").then((snapshot) => {
            let count = snapshot.val() || 0;
            document.getElementById("counter").textContent = `URLs Cleaned: ${count}`;
        });

        // Copy URL when clicked
        copyBtn.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(cleanedURL);

                // Increment count in Firebase
                db.ref("cleanedCount").transaction((count) => (count || 0) + 1);

                // Fetch and update count
                db.ref("cleanedCount").once("value").then((snapshot) => {
                    document.getElementById("counter").textContent = `URLs Cleaned: ${snapshot.val()}`;
                });

                copyBtn.textContent = "Copied!";
                setTimeout(() => (copyBtn.textContent = cleanedURL), 1500);
            } catch (err) {
                console.error("Failed to copy:", err);
                copyBtn.textContent = "Error!";
            }
        });
    }
};