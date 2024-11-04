import axios from "axios";

// const API_URL = "http://localhost:5000/api";
const API_URL = "https://exit-poll-backend-ooax.onrender.com/api";

export const getCities = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/cities`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
};

export const getZonesByCity = async (cityId) => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/getZonesByCity/${cityId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching zones:", error);
    throw error;
  }
};

export const getCandidatesByZone = async (zoneId) => {
  try {
    const response = await axios.get(`${API_URL}/votes/zone/${zoneId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching candidates:", error);
    throw error;
  }
};

export const castVote = async (candidateId, deviceId) => {
  try {
    const response = await axios.post(`${API_URL}/votes`, {
      candidateId,
      deviceId,
    });
    return response.data;
  } catch (error) {
    console.error("Error casting vote:", error);
    throw error;
  }
};

export const getAdminMedia = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/get-media`);
    return response.data;
  } catch (error) {
    console.error("Error fetching admin media:", error);
    throw error;
  }
};

export const getAllNews = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/get-news`);
    return response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};
