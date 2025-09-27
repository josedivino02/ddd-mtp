import UpdateProductUseCase from './update.product.usecase';
import ProductRepositoryInterface from '../../../domain/product/repository/product-repository.interface';
import Product from '../../../domain/product/entity/product';

describe('Unit test for product update use case', () => {
  let productRepository: jest.Mocked<ProductRepositoryInterface>;
  let updateProductUseCase: UpdateProductUseCase;

  beforeEach(() => {
    productRepository = {
      create: jest.fn(),
      find: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
    };

    updateProductUseCase = new UpdateProductUseCase(productRepository);
  });

  it('should successfully update an existing product', async () => {
    const product = new Product('1', 'Product', 100);

    productRepository.find.mockResolvedValue(product);

    const input = { id: '1', name: 'updated Product', price: 200 };

    const result = await updateProductUseCase.execute(input);

    expect(result).toEqual({
      id: '1',
      name: 'updated Product',
      price: 200,
    });

    expect(productRepository.find).toHaveBeenCalledTimes(1);
    expect(productRepository.find).toHaveBeenCalledWith('1');
    expect(productRepository.update).toHaveBeenCalledTimes(1);
    expect(productRepository.update).toHaveBeenCalledWith(product);
  });

  it('should throw an error if product is not found', async () => {
    productRepository.find.mockRejectedValue(new Error('Product not found'));

    const input = { id: '999', name: 'Product X', price: 50 };

    await expect(updateProductUseCase.execute(input)).rejects.toThrow(
      'Product not found',
    );

    expect(productRepository.find).toHaveBeenCalledTimes(1);
    expect(productRepository.update).not.toHaveBeenCalled();
  });
});
