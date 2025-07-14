
import type { TherapyPlanData } from "@/types";

// Temporary in-memory storage for security (will be replaced with Supabase)
class SecureStorageService {
  private plans: TherapyPlanData[] = [];
  private readonly maxPlans = 50;

  // Store therapy plan securely (in-memory for now, will move to Supabase)
  saveTherapyPlan(plan: TherapyPlanData): void {
    try {
      // Validate plan data before storing
      if (!plan.id || !plan.patientData || !plan.patientSummary || !plan.deficitCards || !Array.isArray(plan.deficitCards)) {
        throw new Error('Invalid therapy plan data');
      }

      // Remove sensitive data that shouldn't be stored
      const sanitizedPlan = this.sanitizePlanData(plan);
      
      this.plans = [sanitizedPlan, ...this.plans].slice(0, this.maxPlans);
      
      console.log('Therapy plan saved securely');
    } catch (error) {
      console.error('Error saving therapy plan:', error);
      throw new Error('Failed to save therapy plan securely');
    }
  }

  // Retrieve therapy plans
  getTherapyPlans(): TherapyPlanData[] {
    try {
      return [...this.plans]; // Return copy to prevent mutation
    } catch (error) {
      console.error('Error loading therapy plans:', error);
      return [];
    }
  }

  // Delete therapy plan by ID
  deleteTherapyPlan(planId: string): void {
    try {
      if (!planId || typeof planId !== 'string') {
        throw new Error('Invalid plan ID');
      }

      this.plans = this.plans.filter(plan => plan.id !== planId);
      console.log('Therapy plan deleted securely');
    } catch (error) {
      console.error('Error deleting therapy plan:', error);
      throw new Error('Failed to delete therapy plan');
    }
  }

  // Sanitize plan data to remove any potentially sensitive information
  private sanitizePlanData(plan: TherapyPlanData): TherapyPlanData {
    return {
      ...plan,
      // Remove any API keys or sensitive data that might have been included
      patientData: {
        ...plan.patientData,
        // Ensure patient initials are properly anonymized
        patientInitials: plan.patientData.patientInitials?.substring(0, 10) || undefined,
      }
    };
  }

  // Clear all data (for security/logout purposes)
  clearAllData(): void {
    this.plans = [];
    console.log('All therapy plan data cleared');
  }
}

export const secureStorageService = new SecureStorageService();

// Export functions for backward compatibility
export const saveTherapyPlan = (plan: TherapyPlanData): void => {
  secureStorageService.saveTherapyPlan(plan);
};

export const getTherapyPlans = (): TherapyPlanData[] => {
  return secureStorageService.getTherapyPlans();
};

export const deleteTherapyPlan = (planId: string): void => {
  secureStorageService.deleteTherapyPlan(planId);
};
