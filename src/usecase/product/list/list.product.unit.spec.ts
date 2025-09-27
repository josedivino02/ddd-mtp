import ListProductUseCase from './list.product.usecase';
import ProductRepositoryInterface from '../../../domain/product/repository/product-repository.interface';
import Product from '../../../domain/product/entity/product';
import ProductB from '../../../domain/product/entity/product-b';

describe('ListProductUseCase Unit Tests', () => {
  let productRepository: jest.Mocked<ProductRepositoryInterface>;
  let listProductUseCase: ListProductUseCase;

  beforeEach(() => {
    productRepository = {
      create: jest.fn(),
      find: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
    };

    listProductUseCase = new ListProductUseCase(productRepository);
  });

  it('should return the list of products', async () => {
    const product1 = new Product('1', 'product 1', 100);
    const product2 = new ProductB('2', 'product 2', 200);

    productRepository.findAll.mockResolvedValue([product1, product2]);

    const result = await listProductUseCase.execute({});

    expect(result.products).toHaveLength(2);
    expect(result.products).toEqual([
      { id: '1', name: 'product 1', price: 100 },
      { id: '2', name: 'product 2', price: 400 },
    ]);

    expect(productRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return an empty list when there are no products', async () => {
    productRepository.findAll.mockResolvedValue([]);

    const result = await listProductUseCase.execute({});

    expect(result.products).toHaveLength(0);
    expect(result.products).toEqual([]);
    expect(productRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
