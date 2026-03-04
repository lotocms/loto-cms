class FriendlinkService extends Chan.Service {
  constructor() {
    super(Chan.db, "cms_friendlink");
  }

  // 新增
  async create(body) {
    const res = await this.insert(body);
    return res;
  }

  // 删
  async delete(id) {
    const res = await this.deleteById(id);
    return res;
  }

  // 修改
  async update(body) {
    const { id, createdAt, updatedAt, ...data } = body;
    const res = await this.updateById(id, data);
    return res;
  }

  // 列表
  async list(cur = 1, pageSize = 10) {
    const res = await this.query({
      current: cur,
      pageSize: pageSize,
      query: {},
      fields: ["*"],
    });
    return res;
  }

  // 查
  async detail(id) {
    const res = await this.findById(id, {
      fields: ["*"],
    });
    return res;
  }

  // 搜索
  async search(key = "", cur = 1, pageSize = 10) {
    const res = await this.query({
      current: cur,
      pageSize: pageSize,
      query: key ? { title: { like: `%${key}%` } } : {},
      fields: ["*"],
    });
    return res;
  }
}

export default new FriendlinkService();
