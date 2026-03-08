class ModelService extends Chan.Service {
  constructor() {
    super(Chan.db, "cms_model");
  }

  // 增
  async create(body) {
    const { model, tableName, status, remark = "" } = body;
    let result;
    await this.db.transaction(async (trx) => {
      const sql_create = `CREATE TABLE ${tableName} (
            id INT(11) NOT NULL AUTO_INCREMENT,
            aid INT(11) NOT NULL,
            PRIMARY KEY (id)
          ) ENGINE=InnoDB
          DEFAULT CHARSET=utf8mb4
          COLLATE=utf8mb4_general_ci
          COMMENT='${remark}'`;

      const createTableStatus = await this.db
        .raw(sql_create, [])
        .transacting(trx);
      
      const sql_insert = `INSERT INTO cms_model (model,tableName,status,remark) VALUES(?,?,?,?)`;
      const result = await this.db
        .raw(sql_insert, [model, tableName, status, remark])
        .transacting(trx);
    });
    return { success: true, code: 200, msg: '创建成功', data: {} };
  }

  async hasUse(id) {
    const res = await this.db
      .select(this.db.raw("COUNT(*) as count"))
      .from("cms_article as a")
      .leftJoin("cms_category as c", "c.id", "a.cid")
      .where("c.mid", id)
      .first();

    return { success: true, code: 200, msg: '查询成功', data: { hasUse: res.count > 0 } };
  }

  async findByName(model, tableName) {
    const res = await this.db(this.tableName)
      .whereRaw("model COLLATE utf8mb4_general_ci LIKE ?", [`%${model}%`])
      .orWhereRaw("tableName COLLATE utf8mb4_general_ci LIKE ?", [`%${tableName}%`])
      .select();
    
    return { success: true, code: 200, msg: '查询成功', data: res };
  }

  // 删
  async delete(id) {
    const data = await this.db(this.tableName).where("id", "=", id).first();
    if (!data) {
      return { success: false, code: 404, msg: '记录不存在', data: {} };
    }
    const { tableName } = data;
    await this.db.transaction(async (trx) => {
      const sql_del = `DROP TABLE ${tableName}`;
      await this.db.raw(sql_del).transacting(trx);
      await this.db(this.tableName).where("id", "=", id).del().transacting(trx);
    });
    return { success: true, code: 200, msg: '删除成功', data: {} };
  }

  // 修改
  async update(body) {
    const { id, ...data } = body;
    const res = await this.updateById(id, data);
    return res;
  }

  // 获取全量model，默认100个cur = 1,
  async list(cur = 1, pageSize = 100) {
    let res = await this.query({
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
    let res = await this.query({
      current: cur,
      pageSize: pageSize,
      query: key ? { model: { like: `%${key}%` } } : {},
      fields: ["*"],
    });
    return res;
  }
}

export default new ModelService();
