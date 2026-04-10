import type { ExtractedSkills } from "./skill-extractor.service.js";

export const aiService = {
  async extractSkillsWithAI(text: string): Promise<ExtractedSkills> {
    const apiKey = process.env.AI_API_KEY;
    
    // If no API key is provided, we fall back to a mock AI response 
    // that uses the rule-based extractor to avoid breaking the app
    if (!apiKey) {
      console.warn("AI_API_KEY not found. Falling back to rule-based extraction.");
      const { skillExtractorService } = await import("./skill-extractor.service.js");
      return skillExtractorService.extractSkills(text);
    }

    try {
      // Placeholder for actual LLM call (e.g. Claude, OpenAI, Gemini)
      // This is a generic implementation using fetch
      const prompt = `
        You are a technical recruiter. Extract professional skills from the following resume text.
        Return ONLY a JSON object with these keys: 
        "languages", "frameworks", "tools", "technical", "soft".
        Each key should map to an array of strings.
        
        Text: ${text.substring(0, 10000)}
      `;

      // Example for a generic REST AI endpoint
      // const response = await fetch("https://api.your-ai-provider.com/v1/chat/completions", { ... });
      
      // For now, we return the fallback since we don't know the exact provider the user wants
      const { skillExtractorService } = await import("./skill-extractor.service.js");
      return skillExtractorService.extractSkills(text);
    } catch (error) {
      console.error("AI extraction error:", error);
      const { skillExtractorService } = await import("./skill-extractor.service.js");
      return skillExtractorService.extractSkills(text);
    }
  }
};
