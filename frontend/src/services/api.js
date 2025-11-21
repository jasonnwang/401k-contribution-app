import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3010';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage =
        error.response.data?.error?.message ||
        error.response.data?.message ||
        'An error occurred';
      throw new Error(errorMessage);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check if the backend is running.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

/**
 * Get contribution settings for a user
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} The contribution settings
 */
export const getContributionSettings = async (userId) => {
  const response = await apiClient.get(`/api/users/${userId}/contribution/settings`);
  return response.data;
};

/**
 * Update contribution settings for a user
 * @param {string} userId - The user ID
 * @param {Object} settings - The contribution settings
 * @param {string} settings.contributionType - The contribution type ('percentage' or 'fixed')
 * @param {number} settings.contributionValue - The contribution value
 * @returns {Promise<Object>} The updated contribution settings
 */
export const updateContributionSettings = async (userId, settings) => {
  const response = await apiClient.put(
    `/api/users/${userId}/contribution/settings`,
    settings
  );
  return response.data;
};

/**
 * Get year-to-date contribution data for a user
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} The YTD contribution data
 */
export const getContributionYTD = async (userId) => {
  const response = await apiClient.get(`/api/users/${userId}/contribution/ytd`);
  return response.data;
};

export default apiClient;