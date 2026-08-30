import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1";

export const generateReport = async ({
  reportType,
  dateRange,
  status,
}) => {

  const response = await axios.get(
    `${API_BASE_URL}/reports`,
    {
      params: {
        reportType,
        dateRange,
        status,
      },
    }
  );

  return response.data;
};