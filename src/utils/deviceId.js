export const generateDeviceId = () => {
  // Generate a unique device ID
  return localStorage.getItem("deviceId") || createAndStoreDeviceId();
};

const createAndStoreDeviceId = () => {
  const deviceId = `device_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  localStorage.setItem("deviceId", deviceId);
  return deviceId;
};
