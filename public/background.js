// Set the behavior to open the side panel when the extension's action icon is clicked
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

// Add a listener to open the side panel when the extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});

// Handle message passing between content script and side panel
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  // If the side panel is requesting the current tab URL
  if (request.action === "getCurrentTabUrl") {
    // Get active tab in current window
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs.length > 0) {
        const currentTab = tabs[0];
        sendResponse({ url: currentTab.url });
      } else {
        sendResponse({ url: "" });
      }
    });
    return true; // Required for async response
  }
});
