import axios from "axios";

// Configuração base da API
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para requisições (adicionar tokens, logs, etc.)
api.interceptors.request.use(
  (config) => {
    // Log apenas em desenvolvimento e para debug
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

// Interceptor para respostas (tratar erros globalmente)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Lista de status codes que são "esperados" e não devem gerar logs
      const expectedErrorStatuses = [
        409, // Conflict (telefone duplicado, etc.)
        404, // Not Found (quando esperado)
        400, // Bad Request (validação, etc.)
        422, // Unprocessable Entity (validação)
      ];

      // Lista de rotas onde erros são esperados
      const expectedErrorRoutes = [
        "/inscriptions", // Rotas de inscrição podem ter conflitos
        "/inscriptions/count", // Contagem pode dar 404
      ];

      const isExpectedError = expectedErrorStatuses.includes(
        error.response.status
      );
      const isExpectedRoute = expectedErrorRoutes.some((route) =>
        error.config?.url?.includes(route)
      );

      // Só fazer log para erros inesperados ou em desenvolvimento
      if (
        !isExpectedError ||
        !isExpectedRoute ||
        process.env.NODE_ENV === "development"
      ) {
        // Mesmo em desenvolvimento, suprimir logs de erros muito comuns
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
      // Erro de rede
      console.error("Erro de rede:", error.message);
    } else {
      // Outros erros
      console.error("Erro:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
