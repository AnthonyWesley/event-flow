import partnerApi from "../../api/axios";

export type ProductInputDto = {
  name: string;
  price: number;
};
export type ProductOutputDto = {
  id: string;
  name: string;
  price: number;
  photo: string;
  photoPublicId: string;
};

export const productService = {
  create: async (data: ProductInputDto) => {
    const response = await partnerApi.post(`/products/`, data);
    return response.data;
  },

  list: async (search?: string) => {
    const response = await partnerApi.get(`/products`, { params: { search } });
    return response.data.products;
  },

  findOne: async (productId: string) => {
    const response = await partnerApi.get(`/products/${productId}`);
    return response.data;
  },

  update: async (productId: string, data: ProductInputDto) => {
    const response = await partnerApi.patch(`/products/${productId}`, data);
    return response.data.products;
  },

  delete: async (productId: string) => {
    const response = await partnerApi.delete(`/products/${productId}`);
    return response.data.products;
  },
};
