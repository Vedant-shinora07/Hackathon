import axiosInstance from './axiosInstance';

export const getJourney = (batchId) =>
  axiosInstance.get(`/public/batch/${batchId}/journey`);
