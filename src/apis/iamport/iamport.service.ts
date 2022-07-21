import axios from 'axios';
import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class IamportService {
  // 외부 Iamport API에서 Access Token 발급 받아오기
  async getToken() {
    const rsp = await axios({
      url: 'https://api.iamport.kr/users/getToken',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: {
        imp_key: process.env.IMP_CLIENT_KEY,
        imp_secret: process.env.IMP_CLIENT_SECRET,
      },
    });
    return rsp.data.response.access_token;
  }

  // Iamport API에서 해당 결제내역 불러오기 (발급 받은 토큰 사용)
  async getPaymentData({ access_token, impUid }) {
    console.log(access_token);
    console.log(impUid);
    try {
      const rsp = await axios({
        url: `https://api.iamport.kr/payments/${impUid}`,
        method: 'get',
        headers: { Authorization: access_token },
      });
      console.log(rsp);
      return rsp.data.response;
    } catch (error) {
      throw new UnprocessableEntityException(
        'Error 422: 처리되지 않은 결제입니다. 다시 시도해주세요.',
      );
    }
  }

  // Iamport 환불 API 요청 보내기
  async requestCancel({ access_token, impUid: imp_uid, price }) {
    try {
      const rsp = await axios({
        url: 'https://api.iamport.kr/payments/cancel',
        method: 'post',
        headers: {
          Authorization: access_token,
          'Content-Type': 'application/json',
        },
        data: {
          imp_uid,
          amount: price,
        },
      });
      return rsp.data;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error 500: 처리 과정에서 알 수 없는 문제가 발생했습니다.',
      );
    }
  }
}
