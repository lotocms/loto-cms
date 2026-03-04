class CategoryService extends Chan.Service {
  constructor() {
    super(Chan.db, "cms_category");
  }

  // 增
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

  // 查全部栏目
  async find() {
    const res = await super.find({ sort: { orderBy: "asc" } });
    return res;
  }

  // 查栏目
  async findId(id) {
    const data = await this.db(this.tableName)
      .where("id", "=", id)
      .select([
        "id",
        "pid",
        "seoTitle",
        "seoKeywords",
        "seoDescription",
        "name",
        "pinyin",
        "path",
        "description",
        "type",
        "url",
        "orderBy",
        "target",
        "status",
        "mid",
        "listView",
        "articleView",
      ])
      .first();
    return data;
  }

  // 查子栏目
  async findSubId(id) {
    const result = await this.find({ query: { pid: id } });
    return result;
  }

  // 搜索栏目
  async search(key) {
    let query = this.db(this.tableName)
      .leftJoin("cms_model", `${this.tableName}.mid`, "cms_model.id")
      .select(`${this.tableName}.*`, "cms_model.model")
      .orderBy(`${this.tableName}.orderBy`, "asc");

    if (key) {
      query = query.whereRaw(
        `${this.tableName}.name COLLATE utf8mb4_general_ci LIKE ?`,
        [`%${key}%`]
      );
    }

    const res = await query;
    const formattedRes = Chan.helper.formatDateFields(res, ['createdAt', 'updatedAt', 'publishTime', 'startTime', 'endTime']);
    return { success: true, code: 200, msg: '查询成功', data: formattedRes };
  }
}

export default new CategoryService();
