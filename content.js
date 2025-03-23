// Function to extract main content from the webpage
function extractMainContent() {
  // Get the main content
  const article = document.querySelector('article');
  const main = document.querySelector('main');
  const content = article || main || document.body;

  // Remove unwanted elements
  const elementsToRemove = content.querySelectorAll('script, style, nav, header, footer, aside, iframe, img');
  elementsToRemove.forEach(element => element.remove());

  // Get text content
  let text = content.innerText;
  
  // Clean up the text
  text = text.replace(/\s+/g, ' ').trim();
  
  return {
    title: document.title,
    content: text,
    url: window.location.href
  };
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getContent') {
    const content = extractMainContent();
    sendResponse(content);
  }
}); 