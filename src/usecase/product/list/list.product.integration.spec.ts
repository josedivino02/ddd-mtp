import { Sequelize } from 'sequelize-typescript';
import ListProductUseCase from './list.product.usecase';
import ProductModel from '../../../infra/product/repository/sequelize/product.model';
import ProductRepository from '../../../infra/product/repository/sequelize/product-repository';
import Product from '../../../domain/product/entity/product';

describe('Test List product use case', () => {
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

  it('should return a list of products', async () => {
    const productRepository = new ProductRepository();
    const useCase = new ListProductUseCase(productRepository);

    // Cria alguns produtos diretamente pelo repositório
    const product1 = new Product('1', 'Product 1', 100);
    const product2 = new Product('2', 'Product 2', 200);

    await productRepository.create(product1);
    await productRepository.create(product2);

    const result = await useCase.execute({});

    expect(result.products).toHaveLength(2);
    expect(result.products).toEqual([
      { id: '1', name: 'Product 1', price: 100 },
      { id: '2', name: 'Product 2', price: 200 },
    ]);

    // Verifica persistência real no banco
    const productsFromDb = await ProductModel.findAll();
    expect(productsFromDb).toHaveLength(2);
    expect(productsFromDb.map(p => p.toJSON())).toEqual([
      { id: '1', name: 'Product 1', price: 100 },
      { id: '2', name: 'Product 2', price: 200 },
    ]);
  });

  it('should return an empty list when no products exist', async () => {
    const productRepository = new ProductRepository();
    const useCase = new ListProductUseCase(productRepository);

    const result = await useCase.execute({});
    expect(result.products).toHaveLength(0);
    expect(result.products).toEqual([]);
  });
});
