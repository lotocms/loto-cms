const {
  helper: { arrToObj },
} = Chan;

class FragService extends Chan.Service {
  constructor() {
    super(Chan.db, "cms_frag");
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
    const { id, ...data } = body;
    const res = await this.updateById(id, data);
    return res;
  }

  // 获取全量frag，默认100个cur = 1,
  async list(cur = 1) {
    const total = await this.db(this.tableName).count("id", { as: "count" });
    const offset = parseInt((cur - 1) * this.limit);
    const list = await this.db
      .select(["name", "mark", "content"])
      .from(this.tableName)
      .limit(this.limit)
      .offset(offset)
      .orderBy("id", "desc");

    const frags = arrToObj(list, "name", "content");
    return { success: true, code: 200, msg: '查询成功', data: frags };
  }

  // 查
  async detail(id) {
    const res = await this.findById(id, {
      fields: ["id", "name", "mark", "content", "type"],
    });
    return res;
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
      ? await this.db(this.tableName)
          .select(["id", "name", "mark", "updatedAt"])
          .whereRaw("name COLLATE utf8mb4_general_ci LIKE ?", [`%${key}%`])
          .limit(pageSize)
          .offset(offset)
          .orderBy("id", "desc")
      : await this.db(this.tableName)
          .select(["id", "name", "mark", "updatedAt"])
          .limit(pageSize)
          .offset(offset)
          .orderBy("id", "desc");

    const count = total[0].count || 1;
    return {
      success: true,
      code: 200,
      msg: '查询成功',
      data: {
        list: list,
        count: count,
        current: cur,
        total: Math.ceil(count / pageSize),
      },
    };
  }
}

export default new FragService();
