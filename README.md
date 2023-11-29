# HTML to Contentful using ChatGPT

Example code to use ChatGPT to migrate articles from HTML to Contentful 

## Prerequesites

To use this example, you'll need:

- A contentful account
- An openAI account
- Node.js version 16 or above.

## Installation

```bash
npm install
```

## Usage

Need to configure `.env` file to be like this:

```
OPENAI_API_KEY=YOUR-OWN-OPENAI-TOKEN
CONTENTFUL_MANAGEMENT_TOKEN=YOUR-OWN-CMA-TOKEN
CONTENTFUL_SPACE_ID=YOUR-OWN-SPACE-ID
CONTENTFUL_ENVIRONMENT_ID=YOUR-OWN-SPACE
```

Next run:

```bash
npm start
```