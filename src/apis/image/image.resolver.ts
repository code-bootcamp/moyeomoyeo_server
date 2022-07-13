import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Image } from './entities/image.entity';
import { ImageService } from './image.service';

@Resolver()
export class ImageResolver {
  constructor(private readonly imageService: ImageService) {}

  @Mutation(() => Image)
  createImage(@Args('src') src: string) {
    return this.imageService.create({ src });
  }

  @Mutation(() => Boolean)
  deleteImage(@Args('imageId') imageId: string) {
    return this.imageService.delete({ imageId });
  }
}
