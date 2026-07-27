const validVideoExtensions = ["mp4", "webm", "ogg", "mov", "mkv", "avi", "m4v", "flv", "wmv", "mpg", "mpeg", "3gp",];
let currentVideoUrl = "";
const urlInput = document.getElementById("videoUrlInput");
const messageBox = document.getElementById("messageBox");
const videoPreviewContainer = document.getElementById(
    "videoPreviewContainer",
);
const videoPlayer = document.getElementById("videoPlayer");
const playButtonOverlay = document.querySelector(
    ".video-controls-overlay .play-btn",
);
const downloadButtonOverlay = document.querySelector(
    ".video-controls-overlay .download-btn",
);
function showMessage(text, type = "") {
    messageBox.textContent = text;
    messageBox.className = "message-box";
    if (type) messageBox.classList.add(type);
    messageBox.classList.add("visible");
    setTimeout(() => {
        messageBox.classList.remove("visible");
    }, 5000);
}
function hideVideoPreview() {
    videoPreviewContainer.style.display = "none";
    videoPlayer.removeAttribute("src");
    currentVideoUrl = "";
}
function getFileExtension(url) {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        const parts = pathname.split(".");
        if (parts.length < 2) return "";
        const ext = parts.pop().toLowerCase();
        return ext.split(/[?#]/)[0];
    } catch (e) {
        console.error("Error getting file extension:", e);
        return "";
    }
}
function processUrl() {
    const url = urlInput.value.trim();
    if (!url) {
        showMessage("Please enter a link.", "error");
        hideVideoPreview();
        return;
    }
    try {
        new URL(url);
    } catch (e) {
        showMessage("The link entered is incorrect.", "error");
        hideVideoPreview();
        return;
    }
    const extension = getFileExtension(url);
    if (validVideoExtensions.includes(extension)) {
        currentVideoUrl = url;
        videoPlayer.src = url;
        videoPreviewContainer.style.display = "block";
        showMessage("Succes. Wait a little", "success");
    } else {
        showMessage(
            `The ${extension || "unknown"} extension for video is not correct. Pay attention`,
            "error",
        );
        hideVideoPreview();
    }
}
document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
});
function enterFullScreen() {
    const video = videoPlayer;
    if (!video.src) {
        showMessage("Not found.", "error");
        return;
    }
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
    }
    video.play().catch((error) => {
        console.error("Autoplay failed:", error);
        showMessage("Sorry. Automatic playback did not work", "error");
    });
}
function initiateDownload() {
    if (!currentVideoUrl) {
        showMessage("The link is not correct.", "error");
        return;
    }
    const downloadLink = document.createElement("a");
    downloadLink.href = currentVideoUrl;
    const filename =
        currentVideoUrl.substring(currentVideoUrl.lastIndexOf("/") + 1) ||
        "downloaded_video.mp4";
    downloadLink.download = filename;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    try {
        downloadLink.click();
        showMessage("Start downloading.", "success");
    } catch (e) {
        console.error("Download initiation failed:", e);
        showMessage(
            "Host site does not allow downloading.",
            "error",
        );
    } finally {
        document.body.removeChild(downloadLink);
    }
}
urlInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        processUrl();
    }
});
hideVideoPreview();
