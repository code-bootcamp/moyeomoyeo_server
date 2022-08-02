import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { ImageService } from '../image/image.service';

@Injectable()
export class FileService {
  constructor(private readonly imageService: ImageService) {}

  // 이미지 파일들 자체를 받고 저장 후 저장된 URL 반환
  async upload({ files }) {
    const waitedFiles = await Promise.all(files);
    const GCP_STORAGE_ID = process.env.GCP_STORAGE_ID;
    const GCP_BUCKET_ID = process.env.GCP_BUCKET_ID;
    // console.log(waitedFiles); // [file, file]

    const storage = new Storage({
      projectId: GCP_STORAGE_ID,
      keyFilename: '/my-secret/gcp-file-storage.json',
    }).bucket(GCP_BUCKET_ID);

    const urls = await Promise.all(
      waitedFiles.map((el) => {
        return new Promise((resolve, reject) => {
          el.createReadStream()
            .pipe(storage.file(el.filename).createWriteStream())
            .on('finish', () => {
              resolve(`${GCP_BUCKET_ID}/${el.filename}`);
            })
            .on('error', () => {
              reject('Error 404: 이미지 업로드에 실패하였습니다.');
            });
        });
      }),
    );

    return urls;
  }

  // 업로드 로직 실행 후 이미지 엔티티 만든 후 엔티티 배열 반환
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
