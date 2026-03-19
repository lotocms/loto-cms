class Config extends Chan.Service {
  constructor() {
    super(Chan.db, "sys_config");
  }

  /**
   * @description 根据菜单ID查找菜单信息
   * @param {number} id - 菜单ID
   * @returns {Promise<Object|null>} 返回找到的菜单对象或null
   */
  async detail(id) {
    const res = await this.findById(id, {
      fields: ["id", "type_code", "config_key", "config_value", "status", "remark"],
    });
    return res;
  }

  /**
   * @description 删除菜单
   * @param {number} id - 要删除的菜单ID
   * @returns {Promise<boolean>} 操作是否成功
   */
  async delete(id) {
    let res = await this.deleteById(id);
    return res;
  }

  /**
   * @description 获取分页菜单列表
   * @param {Object} options - 分页查询参数
   * @returns {Promise<Object>} 包含菜单列表、总数等信息的对象
   */
  async list({
    query,
    fields = ["id", "type_code", "config_key", "config_value", "status", "remark"],
  }) {
    let res = await this.query({
      current: 1,
      pageSize: this.limit,
      query,
      fields,
    });
    return res;
  }

  // 增
  async create(body) {
    const res = await this.insert(body);
    return res;
  }

  async update(body) {
    const { id, ...data } = body;
    const res = await this.updateById(id, data);
    return res;
  }

  async updateMany(updates = []) {
    const res = await super.updateMany(updates);
    return res;
  }
}

export default new Config();
