import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { TargetUser } from 'src/commons/auth/gql-user.param';
import { User } from '../user/entities/user.entity';
import { ProductInput } from './dto/product.input';
import { UpdateProductInput } from './dto/updateProduct.input';
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
  fetchProducts(
    @Args('page', { nullable: true }) page: number,
    @Args('pageSize', { nullable: true }) pageSize: number,
  ) {
    return this.productService.findAll({ page, pageSize });
  }

  @UseGuards(GqlAccessGuard)
  @Mutation(() => Product)
  createProduct(
    @TargetUser() targetUser: any,
    @Args('productInput') productInput: ProductInput,
  ) {
    return this.productService.create({ targetUser, productInput });
  }

  @UseGuards(GqlAccessGuard)
  @Mutation(() => Product)
  updateProduct(
    @Args('productId') productId: string,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    return this.productService.update({ productId, updateProductInput });
  }

  @Mutation(() => Boolean)
  deleteProduct(@Args('productId') productId: string) {
    return this.productService.delete({ productId });
  }

  @UseGuards(GqlAccessGuard)
  @Mutation(() => [User])
  dibsProduct(
    @TargetUser('targetUser') targetUser: any,
    @Args('productId') productId: string,
  ) {
    return this.productService.dibs({ targetUser, productId });
  }

  @UseGuards(GqlAccessGuard)
  @Mutation(() => [User])
  undibsProduct(
    @TargetUser('targetUser') targetUser: any,
    @Args('productId') productId: string,
  ) {
    return this.productService.cancelDibs({ targetUser, productId });
  }
}
