import { Injectable } from '@nestjs/common';

@Injectable()
export class SharedService {
  getBearerToken(tokenString: string): string {
    return tokenString.split(' ')[1];
  }

  generateAuthorizationHeaderFromString(baseStr: string): string {
    return 'Bearer ' + new Buffer(baseStr).toString('base64');
  }
}
