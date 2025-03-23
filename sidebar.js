// API endpoints and SDK imports
const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function getPageContent() {
  const tab = await getCurrentTab();
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tab.id, { action: 'getContent' }, resolve);
  });
}

async function generateSummaryWithOpenAI(content, apiKey) {
  const response = await fetch(OPENAI_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that provides concise summaries of web content.'
        },
        {
          role: 'user',
          content: `Please provide a concise summary of the following webpage content. Title: ${content.title}\n\nContent: ${content.content}`
        }
      ],
      max_tokens: 300
    })
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message);
  }
  return data.choices[0].message.content;
}

async function generateSummaryWithGemini(content, apiKey) {
  const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `Please provide a concise summary of the following webpage content. Title: ${content.title}\n\nContent: ${content.content}`
        }]
      }],
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.7
      }
    })
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message);
  }
  return data.candidates[0].content.parts[0].text;
}

async function generateSummary(content) {
  const result = await chrome.storage.local.get(['selected_model', 'openai_api_key', 'gemini_api_key']);
  
  if (!result.selected_model) {
    throw new Error('No model selected. Please configure the extension settings.');
  }

  if (result.selected_model === 'openai') {
    if (!result.openai_api_key) {
      throw new Error('OpenAI API key not found. Please set it in the extension options.');
    }
    return generateSummaryWithOpenAI(content, result.openai_api_key);
  } else {
    if (!result.gemini_api_key) {
      throw new Error('Gemini API key not found. Please set it in the extension options.');
    }
    return generateSummaryWithGemini(content, result.gemini_api_key);
  }
}

async function updateSummary() {
  const loadingElement = document.getElementById('loading');
  const summaryElement = document.getElementById('summary');
  const errorElement = document.getElementById('error');

  loadingElement.classList.remove('hidden');
  summaryElement.classList.add('hidden');
  errorElement.classList.add('hidden');

  try {
    const content = await getPageContent();
    const summary = await generateSummary(content);
    
    summaryElement.innerHTML = `
      <h2>${content.title}</h2>
      <p>${summary}</p>
      <div class="source">
        <a href="${content.url}" target="_blank">View Original Page</a>
      </div>
    `;
    
    summaryElement.classList.remove('hidden');
  } catch (error) {
    console.error('Error generating summary:', error);
    errorElement.querySelector('p').textContent = error.message;
    errorElement.classList.remove('hidden');
  } finally {
    loadingElement.classList.add('hidden');
  }
}

// Event listeners
document.getElementById('refreshSummary').addEventListener('click', updateSummary);

// Initial summary generation
updateSummary(); 