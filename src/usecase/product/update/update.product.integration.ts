import { Sequelize } from 'sequelize-typescript';
import UpdateProductUseCase from './update.product.usecase';
import ProductModel from '../../../infra/product/repository/sequelize/product.model';
import ProductRepository from '../../../infra/product/repository/sequelize/product-repository';
import Product from '../../../domain/product/entity/product';

describe('UpdateProductUseCase Integration Test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should update an existing product', async () => {
    const productRepository = new ProductRepository();
    const useCase = new UpdateProductUseCase(productRepository);

    const product = new Product('1', 'Product', 100);
    await productRepository.create(product);

    const input = { id: '1', name: 'updated Product', price: 200 };

    const result = await useCase.execute(input);

    expect(result).toEqual({
      id: '1',
      name: 'updated Product',
      price: 200,
    });

    // Valida persistência no banco
    const productFromDb = await ProductModel.findByPk('1');
    expect(productFromDb.toJSON()).toEqual({
      id: '1',
      name: 'updated Product',
      price: 200,
    });
  });

  it('should throw error if product does not exist', async () => {
    const productRepository = new ProductRepository();
    const useCase = new UpdateProductUseCase(productRepository);

    const input = { id: '999', name: 'Product X', price: 50 };

    await expect(useCase.execute(input)).rejects.toThrow('Product not found');
  });
});
