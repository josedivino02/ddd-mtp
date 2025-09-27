import FindProductUseCase from './find.product.usecase';
import ProductRepositoryInterface from '../../../domain/product/repository/product-repository.interface';
import Product from '../../../domain/product/entity/product';

describe('Unit Test find product use case', () => {
  let productRepository: jest.Mocked<ProductRepositoryInterface>;
  let findProductUseCase: FindProductUseCase;

  beforeEach(() => {
    productRepository = {
      create: jest.fn(),
      find: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
    };

    findProductUseCase = new FindProductUseCase(productRepository);
  });

  it('should find a product', async () => {
    const product = new Product('1', 'Produto Teste', 100);

    productRepository.find.mockResolvedValue(product);

    const input = { id: '1' };
    const result = await findProductUseCase.execute(input);

    expect(result).toEqual({
      id: '1',
      name: 'Produto Teste',
      price: 100,
    });

    expect(productRepository.find).toHaveBeenCalledTimes(1);
    expect(productRepository.find).toHaveBeenCalledWith('1');
  });

  it('should not find a product', async () => {
    productRepository.find.mockRejectedValue(new Error('Product not found'));

    const input = { id: '999' };

    await expect(findProductUseCase.execute(input)).rejects.toThrow(
      'Product not found',
    );

    expect(productRepository.find).toHaveBeenCalledTimes(1);
    expect(productRepository.find).toHaveBeenCalledWith('999');
  });
});
