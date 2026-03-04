class SysUserService extends Chan.Service {
  constructor() {
    super(Chan.db, "sys_user");
  }

  async find(username) {
    const res = await this.findOne({
      query: { username },
      fields: ["id", "username", "password", "status"],
    });
    return res;
  }

  /**
   * @description 根据菜单ID查找菜单信息
   * @param {number} id - 菜单ID
   * @returns {Promise<Object|null>} 返回找到的菜单对象或null
   */
  async detail(id) {
    const res = await this.findById(id, {
      fields: ["id", "username", "avatar", "status"],
    });

    if (!res.success || !res.data) {
      return res;
    }

    const user = res.data;

    const roles = await this.db("sys_user_role")
      .select("role_id")
      .where("user_id", id)
      .first();

    let roleKey = null;
    if (roles && roles.role_id) {
      const _role = await this.db("sys_role")
        .select("key")
        .where("id", roles.role_id)
        .first();
      roleKey = _role ? _role.key : null;
    }

    user.role = roleKey;

    return { success: true, code: 200, msg: '查询成功', data: user };
  }

  /**
   * @description 删除菜单
   * @param {number} id - 要删除的菜单ID
   * @returns {Promise<boolean>} 操作是否成功
   */
  async delete(id) {
    return await this.deleteById(id);
  }

  /**
   * @description 获取分页菜单列表
   * @param {Object} options - 分页查询参数
   * @returns {Promise<Object>} 包含菜单列表、总数等信息的对象
   */
  async list({ cur = 1, pageSize = 10 }) {
    const total = await this.db(this.tableName).count("id", { as: "count" });
    const offset = parseInt((cur - 1) * pageSize);
    const list = await this.db("sys_user as u")
      .select(
        "u.id",
        "u.username",
        "u.status",
        "r.id as role_id",
        "r.name as role_name",
        "r.key as role_value"
      )
      .leftJoin("sys_user_role as ur", "u.id", "ur.user_id")
      .leftJoin("sys_role as r", "ur.role_id", "r.id")
      .limit(pageSize)
      .offset(offset)
      .orderBy("u.id", "asc");

    const count = total[0].count || 1;
    return {
      success: true,
      code: 200,
      msg: '查询成功',
      data: {
        count: count,
        total: Math.ceil(count / pageSize),
        current: cur,
        list: list,
      }
    };
  }

  // 增
  async create({ role_id, ...params }) {
    let userId;
    await this.db.transaction(async (trx) => {
      const [newUserId] = await trx(this.tableName).insert(params).returning("id");
      userId = newUserId;
      await trx("sys_user_role").insert({
        user_id: userId,
        role_id,
      });
    });
    return { success: true, code: 200, msg: '创建成功', data: { id: userId } };
  }

  //改
  async update({ userId, role_id, ...params }) {
    await this.db.transaction(async (trx) => {
      if (Object.keys(params).length > 0) {
        await trx(this.tableName).where("id", userId).update(params);
      }

      const rowsAffected = await trx("sys_user_role")
        .where("user_id", userId)
        .update({ role_id });

      if (rowsAffected === 0) {
        await trx("sys_user_role").insert({ user_id: userId, role_id });
      }
    });
    return { success: true, code: 200, msg: '更新成功', data: { affectedRows: 1 } };
  }
}

export default new SysUserService();
