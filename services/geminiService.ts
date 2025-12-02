import { GoogleGenAI, Type } from "@google/genai";
import { ComponentType, PCPart, BuildState } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Schema for structured output
const partSchema = {
  type: Type.OBJECT,
  properties: {
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          price: { type: Type.NUMBER, description: "Estimated price in Indian Rupees (INR)" },
          specs: { 
            type: Type.OBJECT,
            properties: {
               core_count: { type: Type.STRING },
               clock_speed: { type: Type.STRING },
               socket: { type: Type.STRING },
               vram: { type: Type.STRING },
               capacity: { type: Type.STRING },
               wattage: { type: Type.STRING },
               form_factor: { type: Type.STRING },
               chipset: { type: Type.STRING }
            }
          },
          reason: { type: Type.STRING, description: "Why this fits the build/compatibility" }
        },
        required: ["name", "price", "specs", "reason"]
      }
    }
  }
};

const generateAmazonLink = (productName: string) => {
  // Generates a search link with an affiliate tag placeholder
  return `https://www.amazon.in/s?k=${encodeURIComponent(productName)}&tag=geminipcarchitect-21`;
};

export const getRecommendations = async (
  componentType: ComponentType,
  currentBuild: BuildState
): Promise<PCPart[]> => {
  if (!apiKey) {
    console.warn("No API Key provided, returning mock data");
    return mockParts(componentType);
  }

  const prompt = `
    You are an expert PC Builder for the Indian market.
    Current Build Context:
    - Usage: ${currentBuild.usage}
    - Budget Level: ${currentBuild.budget}
    - Selected Parts: ${JSON.stringify(currentBuild.parts)}

    Task: Recommend 3 compatible ${componentType} options available in India.
    
    Constraints:
    - Prices must be in INR (₹).
    - STRICTLY check compatibility with selected parts (e.g., CPU socket vs Motherboard, Case size vs GPU).
    - If specific specs aren't relevant for the part, omit them or leave empty.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: partSchema,
        systemInstruction: "You are a helpful PC building assistant. Always return valid JSON."
      }
    });

    const json = JSON.parse(response.text || '{}');
    
    return (json.recommendations || []).map((rec: any, index: number) => ({
      id: `${componentType}-${index}`,
      name: rec.name,
      price: rec.price,
      specs: rec.specs,
      compatibilityNote: rec.reason,
      image: getPlaceholderImage(componentType, index),
      amazonLink: generateAmazonLink(rec.name)
    }));

  } catch (error) {
    console.error("Gemini API Error:", error);
    return mockParts(componentType);
  }
};

const getPlaceholderImage = (type: ComponentType, index: number) => {
  // Using picsum as requested, seeded to be consistent
  const seed = type.length + index;
  return `https://picsum.photos/seed/${seed}/300/300`;
};

// Fallback if API fails or no key
const mockParts = (type: ComponentType): PCPart[] => {
  const mocks = [
    {
      name: `Generic ${type} Standard`,
      price: 15000,
      specs: { info: "Standard Spec" },
      compatibilityNote: "Good all-rounder"
    },
    {
      name: `High-End ${type} Pro`,
      price: 25000,
      specs: { info: "Performance Spec" },
      compatibilityNote: "Best for performance"
    }
  ];

  return mocks.map((m, i) => ({
    id: `mock-${i}`,
    name: m.name,
    price: m.price,
    specs: m.specs,
    compatibilityNote: m.compatibilityNote,
    image: getPlaceholderImage(type, i),
    amazonLink: generateAmazonLink(m.name)
  }));
};