class MessageService extends Chan.Service {
  constructor() {
    super(Chan.db, "cms_message");
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

  // 改
  async update(body) {
    const { id, ...data } = body;
    const res = await this.updateById(id, data);
    return res;
  }

  // 列表
  async list(cur = 1, pageSize = 10) {
    const res = await this.query({
      current: cur,
      pageSize: pageSize,
      fields: ["id", "title", "tel", "wechat", "content", "createdAt"],
    });
    return res;
  }

  // 查
  async detail(id) {
    const res = await this.findById(id);
    return res;
  }
}

export default new MessageService();
