import COS from 'cos-nodejs-sdk-v5';

export default new (class TencentCos {
  Client: any;

  constructor() {
    this.Client = new COS({
      SecretId: process.env.TENCENT_COS_SECRETID,
      SecretKey: process.env.TENCENT_COS_SECRETKEY,
    });
  }

  async putContent(fileName: string, content: string) {
    return await this.Client.putObject({
      Bucket: process.env.TENCENT_COS_BUCKET,
      Region: 'ap-shanghai',
      Key: fileName,
      Body: Buffer.from(content),
    });
  }
})();
