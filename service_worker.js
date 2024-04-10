import crawlAPI from "./services/crawl.js";

const showNotification = (title, message, priority = 0, requireInteraction = false) => {

    chrome.notifications.create('', {
        type: 'basic',
        iconUrl: './assets/icon.png', // Replace 'icon.png' with your icon file path
        title,
        message,
        priority: 2, // Set high priority
        requireInteraction // Ensure the notification stays visible until dismissed by the user
    });
}


// calls ananlysing method
chrome.webNavigation.onCompleted.addListener((details) => {

    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {

        try {
            if (tabs && tabs.length > 0) {
                let url = tabs[0].url
                const title = tabs[0].title
                const response = await crawlAPI(url)

                if (response.securityScore < 7 && response.securityScore >= 5) {

                    const message = 'Security might be compromised on the webpage: ' + title
                    showNotification("Possible Threat", message)

                } else if (response.securityScore < 5) {
                    const message = 'A security vulnerability found on the webpage: ' + title

                    showNotification("Vulnerability Detected", message, 2, true)
                }
            }
        } catch (e) {
            

        }

    })

})


// Listen for clipboard change


function analyzeClipboard() {

    chrome.clipboard.readText((clipboardContent) => {

        if (isValidURL(clipboardContent)) {
            crawlAPI(clipboardContent);
        }
    });
}

// Function to check if the clipboard content is a valid URL
function isValidURL(url) {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
}




