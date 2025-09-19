import axios from "axios";

// Configuração base da API
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === "development") {
      console.log("Fazendo requisição para:", config.url);
    }
    return config;
  },
  (error) => {
    console.error("Erro na requisição:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const expectedErrorStatuses = [409, 404, 400, 422];

      const expectedErrorRoutes = ["/inscriptions", "/inscriptions/count"];

      const isExpectedError = expectedErrorStatuses.includes(
        error.response.status
      );
      const isExpectedRoute = expectedErrorRoutes.some((route) =>
        error.config?.url?.includes(route)
      );

      if (
        !isExpectedError ||
        !isExpectedRoute ||
        process.env.NODE_ENV === "development"
      ) {
        if (
          !(
            error.response.status === 409 &&
            error.config?.url?.includes("/inscriptions")
          )
        ) {
          console.error("Erro da API:", {
            status: error.response.status,
            statusText: error.response.statusText,
            url: error.config?.url,
            data: error.response.data || "Sem dados de resposta",
          });
        }
      }
    } else if (error.request) {
      console.error("Erro de rede:", error.message);
    } else {
      console.error("Erro:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
