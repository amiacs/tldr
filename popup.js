document.getElementById('openSidePanel').addEventListener('click', async () => {
  await chrome.sidePanel.open();
  window.close();
}); 