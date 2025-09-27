import { Sequelize } from 'sequelize-typescript';
import CreateProductUseCase from './create.product.usecase';
import { v4 as uuid } from 'uuid';
import ProductModel from '../../../infra/product/repository/sequelize/product.model';
import ProductRepository from '../../../infra/product/repository/sequelize/product-repository';

describe('Test Create product use case', () => {
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

  it('should create a product', async () => {
    const productRepository = new ProductRepository();
    const useCase = new CreateProductUseCase(productRepository);

    const input = {
      type: 'a',
      name: 'Product',
      price: 150,
    };

    const result = await useCase.execute(input);

    expect(result).toHaveProperty('id');
    expect(result.name).toBe('Product');
    expect(result.price).toBe(150);

    const productFromDb = await ProductModel.findByPk(result.id);

    expect(productFromDb.toJSON()).toEqual({
      id: result.id,
      name: 'Product',
      price: 150,
    });
  });
});
