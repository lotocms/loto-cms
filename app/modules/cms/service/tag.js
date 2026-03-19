class TagService extends Chan.Service {
  constructor() {
    super(Chan.db, "cms_tag");
  }

  // 新增
  async create(body) {
    const res = await this.insert(body);
    return res;
  }

  async has(path) {
    const res = await this.findOne({ query: { path } });
    return Object.keys(res?.data || {}).length > 0;
  }

  // 删除tag ,需要删除cms_articleTag.js 里面的tid
  async delete(id) {
    const has = await this.db.raw(
      `SELECT tid FROM cms_articletag WHERE tid = ?`, // 使用?作为参数占位符
      [id] // 参数单独传递
    );
    if (has[0] && has[0].length > 0) {
      return false;
    }
    const res = await this.deleteById(id);
    return res;
  }

  // 修改
  async update(body) {
    const { id } = body;
    delete body.id;
    const res = await this.updateById(id, body);
    return res;
  }

  // 文章列表
  async list(cur = 1, pageSize = 20) {
    const total = await this.db(this.tableName).count("id", { as: "count" });
    const offset = parseInt((cur - 1) * pageSize);
    const list = await this.db
      .select(["id", "name", "path"])
      .from(this.tableName)
      .limit(pageSize)
      .offset(offset)
      .orderBy("id", "desc");
    const count = total[0].count || 1;
    return {
      success: true,
      code: 200,
      msg: "查询成功",
      data: {
        count: count,
        total: Math.ceil(count / pageSize),
        current: +cur,
        list: list,
      },
    };
  }

  async hot(size = 20) {
    const list = await this.db
      .select(["id", "name", "path", "count"])
      .from(this.tableName)
      .orderBy("count", "desc")
      .limit(size);
    return list;
  }

  // 查
  async detail(id) {
    const data = await this.db(this.tableName).where("id", "=", id).select();
    return data[0];
  }

  // 搜索
  async search(key = "", cur = 1, pageSize = 10) {
    const total = key
      ? await this.db(this.tableName)
          .whereRaw("name COLLATE utf8mb4_general_ci LIKE ?", [`%${key}%`])
          .count("id", { as: "count" })
      : await this.db(this.tableName).count("id", { as: "count" });

    const offset = parseInt((cur - 1) * pageSize);
    const list = key
      ? await this.db
          .select(["id", "name", "path"])
          .from(this.tableName)
          .whereRaw("name COLLATE utf8mb4_general_ci LIKE ?", [`%${key}%`])
          .limit(pageSize)
          .offset(offset)
          .orderBy("id", "desc")
      : await this.db
          .select(["id", "name", "path"])
          .from(this.tableName)
          .limit(pageSize)
          .offset(offset)
          .orderBy("id", "desc");
    const count = total[0].count || 1;
    return {
      success: true,
      code: 200,
      msg: "查询成功",
      data: {
        count: count,
        total: Math.ceil(count / pageSize),
        current: +cur,
        list: list,
      },
    };
  }
}

export default new TagService();
