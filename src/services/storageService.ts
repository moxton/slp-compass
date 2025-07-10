
// DEPRECATED: This file is kept for backward compatibility only
// All new code should use secureStorageService.ts

import { 
  saveTherapyPlan as secureStorageServiceSave,
  getTherapyPlans as secureStorageServiceGet,
  deleteTherapyPlan as secureStorageServiceDelete
} from './secureStorageService';
import type { TherapyPlanData } from "@/types";

console.warn('DEPRECATED: storageService.ts is deprecated. Use secureStorageService.ts instead.');

// Redirect all calls to the secure storage service
export const saveTherapyPlan = (plan: TherapyPlanData): void => {
  console.warn('Using deprecated storageService. Please migrate to secureStorageService.');
  secureStorageServiceSave(plan);
};

export const getTherapyPlans = (): TherapyPlanData[] => {
  console.warn('Using deprecated storageService. Please migrate to secureStorageService.');
  return secureStorageServiceGet();
};

export const deleteTherapyPlan = (planId: string): void => {
  console.warn('Using deprecated storageService. Please migrate to secureStorageService.');
  secureStorageServiceDelete(planId);
};
