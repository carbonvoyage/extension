import React from "react";
import ReactDOM from "react-dom/client";
import { SkeletonTheme } from "react-loading-skeleton";

import { DEFAULT_SKELETON_THEME } from "../constants";
import App from "./App";
import "../styles/global.css";
import "react-loading-skeleton/dist/skeleton.css";

const pluginTagId = "__carbonvoyage";
const existingInstance = document.getElementById("__carbonvoyage");
if (existingInstance) {
    console.warn("existing instance found, removing");
    existingInstance.remove();
}

const index = document.createElement("div");
index.id = pluginTagId;

// Make sure the element that you want to mount the app to has loaded. You can
// also use `append` or insert the app using another method:
// https://developer.mozilla.org/en-US/docs/Web/API/Element#methods
//
// Also control when the content script is injected from the manifest.json:
// https://developer.chrome.com/docs/extensions/mv3/content_scripts/#run_time
const body = document.querySelector("body");
if (body) {
    body.append(index);
}

// Load the Typekit font
const head = document.querySelector("head");
if (head) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://use.typekit.net/zkr2bhm.css";
    head.append(link);
}

ReactDOM.createRoot(index).render(
    <React.StrictMode>
        <SkeletonTheme {...DEFAULT_SKELETON_THEME}>
            <App />
        </SkeletonTheme>
    </React.StrictMode>
);
