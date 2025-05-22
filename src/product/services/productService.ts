import api from "../../api/axios";

export type ProductInputDto = {
  name: string;
  price: number;
};
export type ProductOutputDto = {
  id: string;
  name: string;
  price: number;
};

export const productService = {
  create: async (data: ProductInputDto) => {
    const response = await api.post(`/products/`, data);
    return response.data;
  },

  list: async () => {
    const response = await api.get(`/products/`);
    return response.data.products;
  },

  findOne: async (productId: string) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },

  update: async (productId: string, data: ProductInputDto) => {
    const response = await api.put(`/products/${productId}`, data);
    return response.data.products;
  },

  delete: async (productId: string) => {
    const response = await api.delete(`/products/${productId}`);
    return response.data.products;
  },
};
