const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function callGemini(systemInstruction, userPrompt) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(
      systemInstruction + "\n\nUser: " + userPrompt
    );

    const response = await result.response;
    return response.text();
  } catch (err) {
    console.error("Gemini error:", err);
    return "AI service unavailable";
  }
}

module.exports = { callGemini };