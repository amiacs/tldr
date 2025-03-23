// Save options to chrome.storage
const saveOptions = async (e) => {
  e.preventDefault();
  const selectedModel = document.querySelector('input[name="model"]:checked').value;
  const openaiApiKey = document.getElementById('openaiApiKey').value.trim();
  const geminiApiKey = document.getElementById('geminiApiKey').value.trim();
  const status = document.getElementById('status');

  // Validate required API key based on selected model
  if (selectedModel === 'openai' && !openaiApiKey) {
    status.textContent = 'Please enter an OpenAI API key';
    status.className = 'status error';
    return;
  }

  if (selectedModel === 'gemini' && !geminiApiKey) {
    status.textContent = 'Please enter a Gemini API key';
    status.className = 'status error';
    return;
  }

  try {
    await chrome.storage.local.set({
      selected_model: selectedModel,
      openai_api_key: openaiApiKey,
      gemini_api_key: geminiApiKey
    });
    status.textContent = 'Options saved successfully!';
    status.className = 'status success';
  } catch (error) {
    status.textContent = 'Error saving options: ' + error.message;
    status.className = 'status error';
  }

  // Hide status message after 2 seconds
  setTimeout(() => {
    status.className = 'status';
  }, 2000);
};

// Restore options from chrome.storage
const restoreOptions = async () => {
  try {
    const result = await chrome.storage.local.get([
      'selected_model',
      'openai_api_key',
      'gemini_api_key'
    ]);

    if (result.selected_model) {
      document.querySelector(`input[name="model"][value="${result.selected_model}"]`).checked = true;
      updateActiveApiKey(result.selected_model);
    }

    if (result.openai_api_key) {
      document.getElementById('openaiApiKey').value = result.openai_api_key;
    }

    if (result.gemini_api_key) {
      document.getElementById('geminiApiKey').value = result.gemini_api_key;
    }
  } catch (error) {
    console.error('Error loading options:', error);
  }
};

// Update active API key section based on model selection
const updateActiveApiKey = (model) => {
  const openaiSection = document.getElementById('openaiKey');
  const geminiSection = document.getElementById('geminiKey');

  if (model === 'openai') {
    openaiSection.classList.add('active');
    geminiSection.classList.remove('active');
  } else {
    openaiSection.classList.remove('active');
    geminiSection.classList.add('active');
  }
};

// Event listeners
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('optionsForm').addEventListener('submit', saveOptions);
document.querySelectorAll('input[name="model"]').forEach(radio => {
  radio.addEventListener('change', (e) => updateActiveApiKey(e.target.value));
}); 