class SysRoleService extends Chan.Service {
  constructor() {
    super(Chan.db, "sys_role");
  }

  /**
   * @description 根据角色ID查找角色信息
   * @param {number} id - 角色ID
   * @returns {Promise<Object|null>} 返回找到的角色对象或null
   */
  async detail(id) {
    const res = await this.findById(id);
    return res;
  }

  /**
   * @description 删除角色
   * @param {number} id - 要删除的角色ID
   * @returns {Promise<boolean>} 操作是否成功
   */
  async delete(id) {
    let res = await this.deleteById(id);
    return res;
  }

  /**
   * @description 获取分页角色列表
   * @param {Object} options - 分页查询参数
   * @returns {Promise<Object>} 包含角色列表、总数等信息的对象
   */
  async list(query) {
    let res = await this.query({
      current: 1,
      pageSize: this.limit,
      query,
      fields: ["id", "name", "key", "sort", "status", "create_time"],
    });
    return res;
  }

  // 增
  async create({ roleData, menuIds }) {
    let roleId;
    await this.db.transaction(async (trx) => {
      const [newRoleId] = await trx(this.tableName).insert(roleData).returning("id");
      roleId = newRoleId;

      const roleMenuData = menuIds.map((menuId) => ({
        role_id: roleId,
        menu_id: menuId,
      }));

      if (roleMenuData.length > 0) {
        await trx("sys_role_menu").insert(roleMenuData);
      }
    });
    
    return { success: true, code: 200, msg: '创建成功', data: { id: roleId } };
  }

  //改
  async update(params = {}) {
    const { roleId, roleData, menuIds } = typeof params.roleId !== 'undefined' 
      ? params 
      : { roleId: params, roleData: {}, menuIds: [] };

    await this.db.transaction(async (trx) => {
      const { id, create_time, create_by, ...cleanRoleData } = roleData;
      
      if (Object.keys(cleanRoleData).length > 0) {
        await trx("sys_role").where("id", roleId).update(cleanRoleData);
      }

      const existingMenuIdsResult = await trx("sys_role_menu")
        .select("menu_id")
        .where("role_id", roleId);
      const existingMenuIds = existingMenuIdsResult.map(
        (item) => item.menu_id
      );

      const idsToDelete = existingMenuIds.filter(
        (id) => !menuIds.includes(id)
      );

      if (idsToDelete.length > 0) {
        await trx("sys_role_menu")
          .whereIn("menu_id", idsToDelete)
          .andWhere("role_id", roleId)
          .del();
      }

      const insertData = menuIds
        .filter((menuId) => !existingMenuIds.includes(menuId))
        .map((menuId) => ({
          role_id: roleId,
          menu_id: menuId,
        }));

      if (insertData.length > 0) {
        await trx("sys_role_menu").insert(insertData);
      }
    });
    
    return { success: true, code: 200, msg: '更新成功', data: { affectedRows: 1 } };
  }
}

export default new SysRoleService();
