import type { ExtractedSkills } from "./skill-extractor.service.js";

export const aiService = {
  async extractSkillsWithAI(text: string): Promise<ExtractedSkills> {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn("⚠️ GEMINI_API_KEY not found. Using local skill-extractor fallback.");
      const { skillExtractorService } = await import("./skill-extractor.service.js");
      return skillExtractorService.extractSkills(text);
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Extract technical skills from this resume text. 
              Output ONLY a raw JSON object with arrays: languages, frameworks, tools, technical, soft.
              
              Text: ${text.substring(0, 10000)}`
            }]
          }]
        })
      });

      const data = await response.json();
      const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (rawJson) {
        // Find JSON block if AI included markdown markers
        const jsonMatch = rawJson.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }

      throw new Error("AI did not return a valid JSON structure");
    } catch (error) {
      console.error("❌ AI Analysis Error:", error);
      const { skillExtractorService } = await import("./skill-extractor.service.js");
      return skillExtractorService.extractSkills(text);
    }
  }
};
