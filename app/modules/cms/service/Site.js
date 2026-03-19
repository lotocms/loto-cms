class SiteService extends Chan.Service {
  constructor() {
    super(Chan.db, "cms_site");
  }

  // 基本信息
  async info() {
    const res = await this.findOne();
    return res;
  }

  // 更新基本信息
  async updateInfo(body) {
    const { id, ...data } = body;
    const res = await this.updateById(id, data);
    return res;
  }
}

export default new SiteService();
