//import PorductsDto from '../DTOs/products.dto.js';

export default class ProductsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAllRepository = async () => {
    const products = await this.dao.getAll();
    return products;
  };

  getProductByIdRepository = async (id) => {
    const product = await this.dao.getProductById(id);
    return product;
  };

  updateRepository = async (pid, product) => {
    const result = await this.dao.update(pid, product);
    return result;
  };

  deleteRepository = async (pid) => {
    const result = await this.dao.delete(pid);
    return result;
  };

  saveRepository = async (product) => {
    const result = await this.dao.save(product);
    return result;
  };
}
