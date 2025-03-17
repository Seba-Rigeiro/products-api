import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { Product } from '../products/product.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '@/products/dtos/create-product.dto';
import { UpdateStockDto } from '@/products/dtos/update-stock.dto';

const CREATE_PRODUCT: CreateProductDto = {
  title: 'New Product',
  price: 100,
  description: 'Test description',
  category: 'create test category',
  image: 'producto.jpg',
};

const EXISTING_PRODUCT: Product = {
  id: '1',
  title: 'Existing Product',
  price: 100,
  description: 'existing product description',
  category: 'existing category',
  image: 'producto.jpg',
  stock: 10,
};

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should create a new product', async () => {
    const mockProduct = { id: '1', ...CREATE_PRODUCT };

    jest.spyOn(repository, 'create').mockReturnValue(mockProduct as Product);
    jest.spyOn(repository, 'save').mockResolvedValue(mockProduct as Product);

    const result = await service.create(CREATE_PRODUCT);

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining(CREATE_PRODUCT),
    );
    expect(repository.save).toHaveBeenCalledWith(mockProduct);
    expect(result).toEqual(mockProduct);
  });

  it('should update the stock of an existing product', async () => {
    const updateStockDto: UpdateStockDto = { stock: 20 };

    jest.spyOn(repository, 'findOne').mockResolvedValue(EXISTING_PRODUCT);
    jest.spyOn(repository, 'save').mockResolvedValue({
      ...EXISTING_PRODUCT,
      stock: updateStockDto.stock,
    });

    const result = await service.updateStock('1', updateStockDto);

    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(repository.save).toHaveBeenCalledWith({
      ...EXISTING_PRODUCT,
      stock: updateStockDto.stock,
    });
    expect(result.stock).toBe(updateStockDto.stock);
  });

  it('should throw NotFoundException if the product doesnt exist', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    await expect(service.updateStock('1', { stock: 20 })).rejects.toThrow(
      NotFoundException,
    );

    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('should delete a product', async () => {
    const deleteResult: DeleteResult = { affected: 1 } as DeleteResult;
    jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);

    await expect(service.delete('1')).resolves.toBeUndefined();

    expect(repository.delete).toHaveBeenCalledWith('1');
  });

  it('should throw NotFoundException if the product doesnt exist', async () => {
    jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0 } as any);

    await expect(service.delete('1')).rejects.toThrow(NotFoundException);

    expect(repository.delete).toHaveBeenCalledWith('1');
  });
});
