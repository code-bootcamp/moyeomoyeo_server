import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { ImageService } from '../image/image.service';

@Injectable()
export class FileService {
  constructor(private readonly imageService: ImageService) {}

  async upload({ files }) {
    const waitedFiles = await Promise.all(files);
    // console.log(waitedFiles); // [file, file]

    const storage = new Storage({
      projectId: 'rare-gist-352601',
      keyFilename: './key/gcp-file-storage.json',
    }).bucket('moyeo-data');

    const urls = await Promise.all(
      waitedFiles.map((el) => {
        return new Promise((resolve, reject) => {
          el.createReadStream()
            .pipe(storage.file(el.filename).createWriteStream())
            .on('finish', () => {
              resolve(`moyeo-data/${el.filename}`);
            })
            .on('error', () => {
              reject('Error 404: 이미지 업로드에 실패하였습니다.');
            });
        });
      }),
    );

    return urls;
  }

  async uploadImages({ files }) {
    const urls: any = this.upload({ files });
    await Promise.all(
      urls.map((el: string) => {
        return this.imageService.create({ src: el });
      }),
    );
    return urls;
  }
}
