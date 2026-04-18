const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
// Ensure you have GEMINI_API_KEY in your .env or process environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy-key');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Compare student skills against job required skills using Gemini API
 * @param {Array} studentSkills - E.g. [{name: "React", level: "Beginner"}]
 * @param {Array} jobSkills - E.g. [{name: "React", level: "Intermediate"}]
 * @returns {Object} JSON result containing match_percentage, missing_skills, strengths, recommendation, explanation
 */
const compareCandidateWithJob = async (studentSkills, jobSkills) => {
    try {
        const prompt = `
You are an AI hiring assistant.
Compare the following student and job.

Student Skills:
${studentSkills.map(s => `- ${s.name} (${s.level})`).join('\n')}

Job Requirements:
${jobSkills.map(s => `- ${s.name} (${s.level})`).join('\n')}

Ensure:
* Response is STRICT JSON
* No extra text, no markdown formatting (like \`\`\`json)
* Provide an accurate match_percentage (0 - 100)
* Evaluate based on both skill name matches and proficiency levels. A lower proficiency than required should affect the score.

Return ONLY valid JSON in this format:
{
  "match_percentage": number,
  "missing_skills": string[],
  "strengths": string[],
  "recommendation": "High Fit" | "Medium Fit" | "Low Fit",
  "explanation": "string"
}
`;
        
        // Timeout handling for fetch requests inside the SDK can be complex,
        // so we wrap the API call in a Promise.race with a timeout.
        const timeoutMs = 15000; // 15 seconds timeout
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Gemini API timeout')), timeoutMs)
        );

        const aiWorker = model.generateContent(prompt);
        const result = await Promise.race([aiWorker, timeoutPromise]);
        
        const responseText = result.response.text().trim();
        
        // Sometimes the AI wraps JSON in markdown despite instructions. Clean it:
        const cleanJson = responseText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();

        const jsonResult = JSON.parse(cleanJson);
        
        // Basic validation
        if (typeof jsonResult.match_percentage !== 'number') {
            throw new Error('Invalid JSON response format: match_percentage is missing or invalid.');
        }

        return jsonResult;

    } catch (error) {
        console.error("Gemini API Error:", error.message);
        // Fallback response so the application doesn't completely fail
        return {
            match_percentage: 0,
            missing_skills: ["Analysis Failed"],
            strengths: [],
            recommendation: "Low Fit",
            explanation: `Failed to analyze via AI. Error: ${error.message}`
        };
    }
};

module.exports = { compareCandidateWithJob };
