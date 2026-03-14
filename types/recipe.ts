export interface Recipe {
  id: string;
  title: string;
  image: string;
  duration: number; // in minutes
  servings: number;
  ingredients: string[];
  steps: CookingStep[];
}

export interface CookingStep {
  id: string;
  instruction: string;
  image?: string;
  tip?: string;
  duration?: number; // optional duration for this step
}