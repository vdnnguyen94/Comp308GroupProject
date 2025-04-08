const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateDiscussionSummary(discussion, comments) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 600,
      topK: 40,
      topP: 0.95,
      stopSequences: []
    }
  });

  const prompt = `
You are a helpful assistant summarizing a community discussion.

**Discussion Title:**
${discussion.title}

**Discussion Content:**
${discussion.content}

**Comments:**
${comments.map((c, i) => `Comment ${i + 1}: ${c.content}`).join('\n')}

Please return a JSON object like this:

{
  "summary": "A concise summary of the discussion and comments."
}
`;

  const result = await model.generateContent(prompt);
  let text = result.response.text().trim();

  // Remove triple backticks if present
  if (text.startsWith("```")) {
    text = text.replace(/^```[a-z]*\n/, "").replace(/```$/, "").trim();
  }

  try {
    const parsed = JSON.parse(text);
    return { summary: parsed.summary };
  } catch (err) {
    console.error("❌ Failed to parse Gemini response:", text);
    throw new Error("Invalid AI response format");
  }
};

async function generateHelpRequestAnalysis(request, volunteers) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 600,
      topK: 40,
      topP: 0.95
    }
  });

  const prompt = `
You are an AI assistant matching a help request with available volunteers.

**Help Request Details:**
- Category: ${request.category}
- City: ${request.city}
- Description: ${request.description}

**Volunteers:**
${JSON.stringify(volunteers, null, 2)}

Instructions:
1. Infer the preferred time/day from the description if possible.
2. Compare volunteers' interests and availability to the request.
3. Return a brief summary of match quality.
4. Return an array of matching volunteer user IDs (by 'id').

Respond with:
{
  "analysis": "Summary text",
  "bestMatches": ["userId1", "userId2"]
}
`;

  const result = await model.generateContent(prompt);
  let text = result.response.text().trim();

  if (text.startsWith("```")) {
    text = text.replace(/^```[a-z]*\n/, "").replace(/```$/, "").trim();
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("❌ Failed to parse Gemini response:", text);
    throw new Error("Invalid AI response format");
  }
};

  
module.exports = {
    generateDiscussionSummary,
    generateHelpRequestAnalysis
};
  
