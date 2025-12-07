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
          price: { type: Type.NUMBER, description: "Accurate current market price in Indian Rupees (INR). MUST be within the target range." },
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

// Define ideal spending ratios based on usage type
const getBudgetRatios = (usage: string): Record<ComponentType, number> => {
  const isWorkstation = usage.toLowerCase().includes('workstation');
  
  if (isWorkstation) {
      return {
          [ComponentType.CPU]: 0.25,
          [ComponentType.GPU]: 0.20,
          [ComponentType.MOBO]: 0.15,
          [ComponentType.RAM]: 0.15,
          [ComponentType.STORAGE]: 0.10,
          [ComponentType.PSU]: 0.08,
          [ComponentType.CASE]: 0.07
      };
  }

  // Default to Gaming & Streaming
  return {
      [ComponentType.CPU]: 0.18,
      [ComponentType.GPU]: 0.35,
      [ComponentType.MOBO]: 0.12,
      [ComponentType.RAM]: 0.08,
      [ComponentType.STORAGE]: 0.07,
      [ComponentType.PSU]: 0.10,
      [ComponentType.CASE]: 0.10
  };
};

export const getRecommendations = async (
  componentType: ComponentType,
  currentBuild: BuildState
): Promise<PCPart[]> => {
  const maxBudget = parseBudgetMax(currentBuild.budget);
  const currentTotal = currentBuild.totalCost;
  const remainingBudget = maxBudget - currentTotal;
  
  const ratios = getBudgetRatios(currentBuild.usage);
  
  // 1. Identify what we still need to buy (Future Components)
  const allComponents = Object.values(ComponentType);
  const selectedComponents = Object.keys(currentBuild.parts) as ComponentType[];
  // Filter out components already bought OR the one we are currently buying
  const futureComponents = allComponents.filter(c => !selectedComponents.includes(c) && c !== componentType);

  // 2. Reserve budget for future components based on ratios
  const futureEstimatedCost = futureComponents.reduce((acc, c) => acc + (maxBudget * (ratios[c] || 0.05)), 0);

  // 3. Determine strict budget for CURRENT component
  // It is the remaining cash minus what we must save for later.
  let availableForCurrent = remainingBudget - futureEstimatedCost;

  // Ideal allocation based on pure ratio
  const idealAllocation = maxBudget * (ratios[componentType] || 0.1);

  // Use the smaller of the two to ensure we don't overspend, but ensure a sane minimum
  let targetPrice = Math.min(idealAllocation, availableForCurrent);
  
  // If we have extra budget (saved from previous parts), allow spending a bit more up to ideal
  if (availableForCurrent > idealAllocation) {
     targetPrice = idealAllocation + (availableForCurrent - idealAllocation) * 0.5;
  }
  
  // Sanity check: prevent target from being impossible (e.g. negative or too low)
  targetPrice = Math.max(targetPrice, 1500); 

  const minTarget = Math.floor(targetPrice * 0.85);
  const maxTarget = Math.floor(targetPrice * 1.15);

  if (!apiKey) {
    console.warn("No API Key provided, returning mock data");
    return mockParts(componentType, targetPrice);
  }

  const prompt = `
    You are an expert PC Builder for the Indian market.
    
    STRICT BUDGET CONSTRAINTS:
    - **Total Project Budget**: ₹${maxBudget}
    - **Currently Spent**: ₹${currentTotal}
    - **Remaining Wallet**: ₹${remainingBudget}
    - **Target Price for ${componentType}**: ₹${minTarget} - ₹${maxTarget} ( STRICT LIMIT )
    
    CRITICAL INSTRUCTION:
    The user has a hard limit of ₹${maxBudget} for the entire PC. 
    We MUST reserve budget for these future components: ${futureComponents.join(', ')}.
    
    You MUST recommend 3 options for ${componentType} that fall STRICTLY within the **₹${minTarget} - ₹${maxTarget}** range.
    
    FAILURE CONDITION:
    Do NOT suggest parts above ₹${maxTarget}. If a part is slightly better but costs more, DO NOT SHOW IT. Strict adherence to budget is the priority.
    
    Current Build Context:
    - Usage: ${currentBuild.usage}
    - Selected Parts: ${JSON.stringify(currentBuild.parts)}

    Task: Recommend 3 compatible ${componentType} options available in India (Amazon.in availability preferred).
    
    Constraints:
    - Prices must be accurate Indian market estimates (INR).
    - STRICTLY check compatibility with selected parts.
    - If specific specs aren't relevant for the part, omit them.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: partSchema,
        systemInstruction: "You are a helpful PC building assistant. Always return valid JSON. You MUST prioritize strict budget adherence over performance. Do not hallucinate lower prices for premium parts."
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
    return mockParts(componentType, targetPrice);
  }
};

const getPlaceholderImage = (type: ComponentType, index: number) => {
  const seed = type.length + index;
  return `https://picsum.photos/seed/${seed}/300/300`;
};

// Fallback if API fails or no key
const mockParts = (type: ComponentType, targetPrice: number): PCPart[] => {
  const basePrice = targetPrice;

  const mocks = [
    {
      name: `Value ${type}`,
      price: Math.floor(basePrice * 0.9),
      specs: { info: "Budget Optimized" },
      compatibilityNote: "Fits budget perfectly"
    },
    {
      name: `Standard ${type}`,
      price: Math.floor(basePrice),
      specs: { info: "Balanced Choice" },
      compatibilityNote: "Recommended"
    },
    {
      name: `Premium ${type}`,
      price: Math.floor(basePrice * 1.1),
      specs: { info: "Performance Pick" },
      compatibilityNote: "Slightly higher performance"
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