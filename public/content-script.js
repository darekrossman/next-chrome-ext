// Content script to access the current tab URL and send it to the side panel
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "getTabUrl") {
    sendResponse({ url: window.location.href });
  }
});
