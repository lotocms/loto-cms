class SysRoleMenuService extends Chan.Service {
  constructor() {
    super(Chan.db, "sys_role_menu");
  }

  /**
   * @description 获取分页菜单列表
   * @param {Object} options - 分页查询参数
   * @returns {Promise<Object>} 包含菜单列表、总数等信息的对象
   */
  async list(query) {
    let res = await this.query({
      current: 1,
      pageSize: this.limit,
      query,
      fields: ["role_id", "menu_id"],
    });
    return res;
  }
}

export default new SysRoleMenuService();
