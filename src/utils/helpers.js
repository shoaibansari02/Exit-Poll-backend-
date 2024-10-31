// src/utils/helpers.js
export const handleApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  return "An error occurred. Please try again.";
};
