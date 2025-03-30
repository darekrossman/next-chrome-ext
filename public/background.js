// Set the behavior to open the side panel when the extension's action icon is clicked
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

// Add a listener to open the side panel when the extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
	chrome.sidePanel.open({ tabId: tab.id });
});
