export interface PCPart {
  id: string;
  name: string;
  price: number; // In INR
  specs: Record<string, string>;
  image?: string;
  amazonLink?: string;
  compatibilityNote?: string;
}

export enum ComponentType {
  CPU = 'Processor',
  MOBO = 'Motherboard',
  RAM = 'Memory',
  GPU = 'Graphics Card',
  STORAGE = 'Storage',
  PSU = 'Power Supply',
  CASE = 'Cabinet'
}

export interface BuildState {
  budget: string;
  usage: string;
  parts: Partial<Record<ComponentType, PCPart>>;
  totalCost: number;
}

export interface WizardStep {
  type: ComponentType | 'Intro' | 'Summary';
  title: string;
  description: string;
}
