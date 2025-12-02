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
          reason: { type: Type.STRING, description: "Why this fits the build/compatibility and BUDGET" }
        },
        required: ["name", "price", "specs", "reason"]
      }
    }
  }
};

const generateAmazonLink = (productName: string) => {
  return `https://www.amazon.in/s?k=${encodeURIComponent(productName)}&tag=geminipcarchitect-21`;
};

const parseBudgetMax = (budgetStr: string): number => {
  // Extract max numeric value based on the specific strings in PCBuilder
  if (budgetStr.includes('50k')) return 50000;
  if (budgetStr.includes('1L')) return 100000;
  if (budgetStr.includes('2.5L')) return 250000;
  if (budgetStr.includes('3L+')) return 500000;
  return 100000; // Default fallback
};

export const getRecommendations = async (
  componentType: ComponentType,
  currentBuild: BuildState
): Promise<PCPart[]> => {
  const maxBudget = parseBudgetMax(currentBuild.budget);
  const remainingBudget = maxBudget - currentBuild.totalCost;
  
  // Identify missing parts to inform the model about future expenses
  const allComponents = Object.values(ComponentType);
  const selectedComponents = Object.keys(currentBuild.parts).map(k => k as ComponentType);
  const missingComponents = allComponents.filter(c => !selectedComponents.includes(c) && c !== componentType);

  if (!apiKey) {
    console.warn("No API Key provided, returning mock data");
    return mockParts(componentType, maxBudget);
  }

  const prompt = `
    You are an expert PC Builder for the Indian market.
    
    STRICT BUDGET CONTRAINTS:
    - **Total Target Budget**: ₹${maxBudget}
    - **Currently Spent**: ₹${currentBuild.totalCost}
    - **Remaining Budget**: ₹${remainingBudget}
    - **Remaining Components to Buy**: ${missingComponents.join(', ')}
    
    CRITICAL INSTRUCTION:
    The user wants the FINAL TOTAL PRICE of the PC to be under ₹${maxBudget}.
    You are recommending ${componentType}.
    Suggest 3 options where the price of this ${componentType} is proportional to the total budget, ensuring enough money is left for the remaining components (${missingComponents.join(', ')}).
    
    Current Build Context:
    - Usage: ${currentBuild.usage}
    - Selected Parts: ${JSON.stringify(currentBuild.parts)}

    Task: Recommend 3 compatible ${componentType} options available in India.
    
    Constraints:
    - Prices must be in INR (₹).
    - STRICTLY check compatibility with selected parts.
    - If specific specs aren't relevant for the part, omit them or leave empty.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: partSchema,
        systemInstruction: "You are a helpful PC building assistant. Always return valid JSON. Respect budget limits strictly."
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
    return mockParts(componentType, maxBudget);
  }
};

const getPlaceholderImage = (type: ComponentType, index: number) => {
  const seed = type.length + index;
  return `https://picsum.photos/seed/${seed}/300/300`;
};

// Fallback if API fails or no key
const mockParts = (type: ComponentType, maxBudget: number): PCPart[] => {
  // Approximate allocation ratios for components
  const ratios: Record<string, number> = {
    [ComponentType.CPU]: 0.20,
    [ComponentType.MOBO]: 0.12,
    [ComponentType.RAM]: 0.08,
    [ComponentType.GPU]: 0.35,
    [ComponentType.STORAGE]: 0.08,
    [ComponentType.PSU]: 0.08,
    [ComponentType.CASE]: 0.09
  };

  const ratio = ratios[type] || 0.1;
  const basePrice = maxBudget * ratio;

  const mocks = [
    {
      name: `Budget-Friendly ${type}`,
      price: Math.floor(basePrice * 0.8),
      specs: { info: "Value Pick" },
      compatibilityNote: "Fits budget well"
    },
    {
      name: `Balanced ${type}`,
      price: Math.floor(basePrice),
      specs: { info: "Standard Spec" },
      compatibilityNote: "Good balance"
    },
    {
      name: `Performance ${type}`,
      price: Math.floor(basePrice * 1.2),
      specs: { info: "Higher Performance" },
      compatibilityNote: "Slightly premium"
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
