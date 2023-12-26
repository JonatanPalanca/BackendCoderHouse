export default class Products {
  constructor() {
    this.data = [];
  }

  //CRUD

  //CREATE

  create = async (product) => {
    this.data.push(product);
    return product;
  };

  //READ

  get = async () => {
    return this.data;
  };

  getProductById = async (id) => {
    return this.data[{ _id: id }];
  };

  //UPDATE

  update = async (pid, updatedFields) => {
    const index = this.products.findIndex((product) => product._id === pid);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedFields };
      return this.products[index];
    }
  };

  //DELETE

  delete = async (pid) => {
    const index = this.products.findIndex((product) => product._id === pid);
    if (index !== -1) {
      this.products.splice(index, 1);
      return { message: "Producto eliminado correctamente" };
    }
  };

  ///////////////////////////////////
  async save(product) {
    const productAlreadyExists = this.products.some(
      (existingProduct) => existingProduct.code === product.code
    );
    if (productAlreadyExists) {
      throw new Error("Product with this code already exists");
    }

    this.products.push(product);
    return product;
  }
}
////////////////////////////////
