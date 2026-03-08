class SysUserRoleService extends Chan.Service {
  constructor() {
    super(Chan.db, "sys_user_role");
  }

  /**
   * @description 根据用户ID查找用户角色信息
   * @param {number} id - 用户ID
   * @returns {Promise<Object|null>} 返回找到的用户角色对象或null
   */
  async detail(id) {
    const res = await this.findOne({ query: { user_id: id } });
    return res;
  }
}

export default new SysUserRoleService();
