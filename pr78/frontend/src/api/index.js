import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const api = {
    // Products
    createProduct: async (product) => (await apiClient.post("/products", product)).data,
    getProducts: async () => (await apiClient.get("/products")).data,
    updateProduct: async (id, product) => (await apiClient.patch(`/products/${id}`, product)).data,
    deleteProduct: async (id) => (await apiClient.delete(`/products/${id}`)).data,

    // Auth
    register: async ({ email, password }) =>
        (await apiClient.post("/auth/register", { email, password })).data,

    login: async ({ email, password }) =>
        (await apiClient.post("/auth/login", { email, password })).data,
};