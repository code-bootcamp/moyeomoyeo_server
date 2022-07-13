import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductInput } from './dto/product.input';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

@Resolver()
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => Product)
  fetchProduct(@Args('productId') productId: string) {
    return this.productService.findOne({ productId });
  }

  @Query(() => [Product])
  fetchProducts() {
    return this.productService.findAll();
  }

  @Mutation(() => Product)
  createProduct(@Args('productInput') productInput: ProductInput) {
    return this.productService.create({ productInput });
  }

  @Mutation(() => Boolean)
  deleteProduct(@Args('productId') productId: string) {
    return this.productService.delete({ productId });
  }
}
