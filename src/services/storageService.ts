
import type { TherapyPlanData } from "@/types";

const STORAGE_KEY = 'therapy_plans';

export const saveTherapyPlan = (plan: TherapyPlanData): void => {
  try {
    const existingPlans = getTherapyPlans();
    const updatedPlans = [plan, ...existingPlans].slice(0, 50); // Keep last 50 plans
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlans));
  } catch (error) {
    console.error('Error saving therapy plan:', error);
  }
};

export const getTherapyPlans = (): TherapyPlanData[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading therapy plans:', error);
    return [];
  }
};

export const deleteTherapyPlan = (planId: string): void => {
  try {
    const plans = getTherapyPlans();
    const updatedPlans = plans.filter(plan => plan.id !== planId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlans));
  } catch (error) {
    console.error('Error deleting therapy plan:', error);
  }
};
