# tl;dr Chrome Extension

A Chrome extension that provides concise summaries of webpage content in a convenient side panel.

## Features

- Summarizes webpage content using OpenAI's GPT-3.5 model
- Clean and modern user interface
- Side panel integration for easy access
- Refresh functionality to update summaries

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Configuration

Before using the extension, you need to set up your OpenAI API key:

1. Get your API key from [OpenAI](https://platform.openai.com/api-keys)
2. Right-click the extension icon and select "Options"
3. Enter your API key in the settings page

## Usage

1. Click the extension icon in your Chrome toolbar
2. Click "Open Summary Panel" to open the side panel
3. The extension will automatically generate a summary of the current webpage
4. Click the "Refresh" button to generate a new summary

## Development

The extension is built using vanilla JavaScript and uses the following Chrome APIs:
- chrome.sidePanel
- chrome.runtime
- chrome.storage
- chrome.tabs

## License

MIT License 