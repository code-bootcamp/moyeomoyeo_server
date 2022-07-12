import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ProductInput } from './dto/product.input';
import { ProductService } from './product.service';

@Resolver()
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}
  @Mutation()
  createProduct(@Args('productInput') productInput: ProductInput) {
    return this.productService.create({ productInput });
  }
}
