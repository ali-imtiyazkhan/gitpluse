import { CONFIG } from "./config";

export const fetchTotalQueries = async (): Promise<bigint> => {
  try {
    const response = await fetch(`${CONFIG.BASE_URL}/api/total_queries`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Convert the string representation to BigInt
    const totalCount =
      typeof data.totalQueries === "string"
        ? BigInt(data.totalQueries)
        : BigInt(Number(data.totalQueries));

    return totalCount;
  } catch (error) {
    console.error("Error fetching the API:", error);
    return BigInt(713);
  }
};
