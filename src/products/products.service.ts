import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import axios from 'axios';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateStockDto } from './dtos/update-stock.dto';

@Injectable()
export class ProductsService {
  private readonly FAKESTORE_URL = 'https://fakestoreapi.com/products';

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    const { data } = await axios.get<Product[]>(this.FAKESTORE_URL);
    return data.map((product) => ({
      ...product,
      stock: Math.floor(Math.random() * 100),
    }));
  }

  async findOne(id: string): Promise<Product> {
    const { data } = await axios.get<Product>(`${this.FAKESTORE_URL}/${id}`);
    return { ...data, stock: Math.floor(Math.random() * 100) };
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = this.productRepository.create({
      ...createProductDto,
      stock: createProductDto.stock ?? Math.floor(Math.random() * 100),
    });

    return this.productRepository.save(newProduct);
  }

  async updateStock(
    id: string,
    updateStockDto: UpdateStockDto,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    product.stock = updateStockDto.stock;
    return this.productRepository.save(product);
  }

  async delete(id: string): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Producto no encontrado');
  }
}
