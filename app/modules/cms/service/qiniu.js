import qiniu from "qiniu";
class QiniuService extends Chan.Service {
  constructor() {
    super(Chan.db, "sys_config");
  }

  async getConfig() {
    const res = await this.query({
      current: 1,
      pageSize: 10,
      query: { "type_code": "qiniu_oss" },
      fields: ["config_key", "config_value"],
    });
    return res;
  }

  // 生成上传token
  async getUploadToken(config) {
    const { accessKey, secretKey, bucket } = config;
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    // 上传凭证
    const options = {
      scope: bucket,
      // 超时时间
      expires: 7200,
      returnBody:
        '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)","age":$(x:age)}',
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    return putPolicy.uploadToken(mac);
  }

  // 获取下载凭证
  async getDownloadToken(config, url) {
    const { accessKey, secretKey, domain } = config;
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const deadline = parseInt(Date.now() / 1000) + 3600; // 1小时后过期
    const downloadUrl = qiniu.util.publicDownloadUrl(domain, url);
    return qiniu.util.downloadToken(downloadUrl, deadline);
  }
}

export default new QiniuService();