class FieldService extends Chan.Service {
  constructor() {
    super(Chan.db, "cms_field");
  }
  // 增
  async create(body) {
    // 新增字的同时需要新增表
    const { mid, cname, ename, type, val, defaultVal, orderBy, length } = body;
    await this.db.transaction(async (trx) => {
      // 查询模块名称
      let table = await this.db
        .raw("SELECT tableName FROM cms_model WHERE id=?", [mid])
        .transacting(trx);
      table = table[0][0].tableName;
      const result = await this.db(this.tableName)
        .insert({ mid, cname, ename, type, val, defaultVal, orderBy, length })
        .transacting(trx);

      // result 返回是新增[id]
      let len = length || 250;
      let sql = "";
      if (result[0]) {
        // 1单行文本（varchar）
        if (type === "1") {
          sql = `varchar(${len})  default ''`;
        }
        // 2.多行文本 text
        if (type === "2") {
          sql = `text`;
        }
        // 3.下拉菜单 text
        if (type === "3") {
          sql = `text`;
        }
        // 4.单选 text
        if (type === "4") {
          sql = `text`;
        }
        // 5.多选 text
        if (type === "5") {
          sql = `text`;
        }
        // 6.时间和日期
        if (type === "6") {
          sql = `datetime default null`;
        }
        // 7.数字类型
        if (type === "7") {
          sql = `int default 0`;
        }
        // 8.单图
        if (type === "8") {
          sql = `varchar(255)  default ''`;
        }
        // 9.多图
        if (type === "9") {
          sql = `text`;
        }
        // 10.文件
        if (type === "10") {
          sql = `varchar(255)  default ''`;
        }
        // 11.多文件
        if (type === "11") {
          sql = `text`;
        }
        // 12.编辑器
        if (type === "12") {
          sql = `text`;
        }

        if (sql) {
          const sql_add = `ALTER TABLE ${table} ADD COLUMN ${ename} ${sql}`;
          await this.db.raw(sql_add).transacting(trx);
        }
      }
      return result;
    });
    return { success: true, code: 200, msg: "创建成功", data: {} };
  }

  async findByName(cname, ename) {
    const result = await this.db.raw(
      "SELECT cname,ename FROM cms_field WHERE cname=? or ename=? LIMIT 0,1",
      [cname, ename]
    );
    const data = result[0];
    return data
      ? { success: true, code: 200, msg: "查询成功", data }
      : { success: false, code: 404, msg: "记录不存在", data: null };
  }

  // 删
  async delete(id) {
    const data = await this.db(this.tableName).where("id", "=", id).first();
    if (!data) {
      return { success: false, code: 404, msg: "记录不存在", data: {} };
    }
    const { mid, ename } = data;
    await this.db.transaction(async (trx) => {
      let table = await this.db
        .raw("SELECT tableName FROM cms_model WHERE id=?", [mid])
        .transacting(trx);
      table = table[0][0].tableName;
      const sql_del = `ALTER TABLE ${table} DROP COLUMN ${ename}`;
      await this.db.raw(sql_del).transacting(trx);
      await this.db(this.tableName).where("id", "=", id).del().transacting(trx);
    });
    return { success: true, code: 200, msg: "删除成功", data: {} };
  }

  // 修改
  async update(body) {
    const { id, length, ename, old_ename } = body;
    delete body.id;
    delete body.old_ename;

    await this.db.transaction(async (trx) => {
      const result = await this.db(this.tableName)
        .where("id", "=", id)
        .update(body)
        .transacting(trx);

      if (result) {
        const modelInfo = await this.db
          .raw("SELECT tableName FROM cms_model WHERE id = ?", [body.mid])
          .transacting(trx);
        const [[{ tableName }]] = modelInfo;
        if (!tableName) {
          throw new Error("找不到模型表格");
        }
        const safeLength = Number.isInteger(length) && length > 0 ? length : 255;
        const fieldTypeMap = {
          1: `varchar(${safeLength || 255}) `,
          2: "text",
          3: "text",
          4: "text",
          5: "text",
          6: `datetime NOT NULL DEFAULT NULL`,
          7: `varchar(${safeLength || 255}) `,
          8: "text",
          9: "longtext",
        };

        let sqlType = fieldTypeMap[body.type];

        const sql = `ALTER TABLE ?? CHANGE ?? ?? ${sqlType}`;
        await this.db.raw(sql, [tableName, old_ename, ename]).transacting(trx);
      }
    });

    return { success: true, code: 200, msg: "更新成功", data: {} };
  }

  // 获取全量field，默认100个cur = 1,
  async list(mid, cur = 1, pageSize = 100) {
    const total = await this.db(this.tableName).count("id", { as: "count" });
    const offset = parseInt((cur - 1) * pageSize);
    const list = await this.db
      .select(["id", "cname", "ename", "orderBy"])
      .from(this.tableName)
      .where("mid", "=", mid)
      .limit(pageSize)
      .offset(offset)
      .orderBy("id", "desc");
    const count = total[0].count || 1;

    const models = await this.db.raw("SELECT model,tableName FROM cms_model WHERE id=?", [mid]);

    return {
      success: true,
      code: 200,
      msg: "查询成功",
      data: {
        count: count,
        total: Math.ceil(count / pageSize),
        current: +cur,
        list: list,
        model: models[0],
      },
    };
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
      query: key ? { cname: { like: `%${key}%` } } : {},
      fields: ["*"],
    });
    return res;
  }
}

export default new FieldService();
