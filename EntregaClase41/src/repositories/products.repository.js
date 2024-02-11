//import PorductsDto from '../DTOs/products.dto.js';

// Definir la clase del repositorio de productos
export default class ProductsRepository {
  constructor(dao) {
    // Inicializar el repositorio con el DAO proporcionado
    this.dao = dao;
  }

  // Método para obtener todos los productos
  getAllRepository = async () => {
    // Llamar al método getAll del DAO y devolver el resultado
    const products = await this.dao.getAll();
    return products;
  };

  // Método para obtener un producto por su ID
  getProductByIdRepository = async (id) => {
    // Llamar al método getProductById del DAO y devolver el resultado
    const product = await this.dao.getProductById(id);
    return product;
  };

  // Método para actualizar un producto
  updateRepository = async (pid, product) => {
    // Llamar al método update del DAO con el ID y el producto actualizado y devolver el resultado
    const result = await this.dao.update(pid, product);
    return result;
  };

  // Método para eliminar un producto
  deleteRepository = async (pid) => {
    // Llamar al método delete del DAO con el ID del producto a eliminar y devolver el resultado
    const result = await this.dao.delete(pid);
    return result;
  };

  // Método para guardar un nuevo producto
  saveRepository = async (product) => {
    // Llamar al método save del DAO con el nuevo producto y devolver el resultado
    const result = await this.dao.save(product);
    return result;
  };

  // Método para crear un nuevo producto
  createRepository = async (product) => {
    // Llamar al método create del DAO con el nuevo producto y devolver el resultado
    const result = await this.dao.create(product);
    return result;
  };
}
