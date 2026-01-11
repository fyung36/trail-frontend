// Mock API service to simulate API calls with delay for performance testing
import { getMockTaxonomyRules, getMockClassifications, getMockCarbonData, getMockPFISubmissions, getMockErrorLog, getMockPortfolioData, getMockProjects } from '@/utils/mockData';

// Simulate API delays
const simulateDelay = (delay: number = 300) => {
  return new Promise(resolve => setTimeout(resolve, delay));
};

// API service to handle data fetching
export const apiService = {
  // Get taxonomy rules
  async getTaxonomyRules() {
    await simulateDelay(200);
    return getMockTaxonomyRules();
  },

  // Get project classifications
  async getClassifications() {
    await simulateDelay(300);
    return getMockClassifications();
  },

  // Get carbon data
  async getCarbonData() {
    await simulateDelay(300);
    return getMockCarbonData();
  },

  // Get PFI submissions
  async getPFISubmissions() {
    await simulateDelay(400);
    return getMockPFISubmissions();
  },

  // Get error logs
  async getErrorLogs() {
    await simulateDelay(200);
    return getMockErrorLog();
  },

  // Get portfolio data
  async getPortfolioData() {
    await simulateDelay(150);
    return getMockPortfolioData();
  },

  // Get projects
  async getProjects() {
    await simulateDelay(250);
    return getMockProjects();
  },

  // Get a specific resource with filtering
  async getResource(resourceType: string, filters?: Record<string, any>) {
    await simulateDelay(300);
    
    switch (resourceType) {
      case 'taxonomy-rules':
        return getMockTaxonomyRules();
      case 'classifications':
        let classifications = getMockClassifications();
        if (filters) {
          if (filters.searchTerm) {
            const term = filters.searchTerm.toLowerCase();
            classifications = classifications.filter(item => 
              item.projectId.toLowerCase().includes(term) ||
              item.projectName.toLowerCase().includes(term) ||
              item.sector.toLowerCase().includes(term)
            );
          }
          if (filters.classification) {
            classifications = classifications.filter(item => 
              item.classification === filters.classification
            );
          }
        }
        return classifications;
      case 'carbon-data':
        return getMockCarbonData();
      case 'pfi-submissions':
        let submissions = getMockPFISubmissions();
        if (filters) {
          if (filters.searchTerm) {
            const term = filters.searchTerm.toLowerCase();
            submissions = submissions.filter(item => 
              item.pfiName.toLowerCase().includes(term) ||
              item.projectId.toLowerCase().includes(term)
            );
          }
          if (filters.status) {
            submissions = submissions.filter(item => 
              item.status === filters.status
            );
          }
        }
        return submissions;
      case 'error-logs':
        return getMockErrorLog();
      case 'portfolio-data':
        return getMockPortfolioData();
      case 'projects':
        return getMockProjects();
      default:
        return [];
    }
  }
};