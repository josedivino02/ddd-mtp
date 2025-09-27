import CreateProductUseCase from './create.product.usecase';
import ProductFactory from '../../../domain/product/factory/product.factory';
import ProductRepositoryInterface from '../../../domain/product/repository/product-repository.interface';

describe('Unit test create product use case', () => {
  let createProductUseCase: CreateProductUseCase;
  let productRepository: jest.Mocked<ProductRepositoryInterface>;

  beforeEach(() => {
    productRepository = {
      create: jest.fn(),
      find: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
    };

    createProductUseCase = new CreateProductUseCase(productRepository);
  });

  it('should create a product', async () => {
    const input = {
      type: 'a',
      name: 'Produto Teste',
      price: 150,
    };

    const result = await createProductUseCase.execute(input);

    expect(result).toHaveProperty('id');
    expect(result.name).toBe(input.name);
    expect(result.price).toBe(input.price);

    expect(productRepository.create).toHaveBeenCalledTimes(1);
    expect(productRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: result.id,
        name: input.name,
        price: input.price,
      }),
    );
  });

  it('should throw an error if the price is invalid', async () => {
    const input = {
      type: 'a',
      name: 'Produto Inválido',
      price: -100,
    };

    await expect(createProductUseCase.execute(input)).rejects.toThrow();
    expect(productRepository.create).not.toHaveBeenCalled();
  });

  it('should thrown an error when name is missing', async () => {
    const input = {
      type: 'a',
      name: '',
      price: 100,
    };

    await expect(createProductUseCase.execute(input)).rejects.toThrow(
      'Name is required',
    );
  });
});
