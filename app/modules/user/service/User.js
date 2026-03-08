class UserService extends Chan.Service {
  constructor() {
    super(Chan.db, "user");
  }

  async findUser(username) {
    const res = await this.findOne({
      query: { username },
      fields: ["id", "username", "email", "password", "avatar", "nickname", "sex", "phone", "wechat", "status"],
    });
    return res;
  }

  async queryPass(id) {
    const res = await this.findById(id, {
      fields: ["password"],
    });
    return res;
  }

  async find(email) {
    const res = await this.query({
      query: { email },
      fields: ["id", "email"],
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
      fields: [
        "id",
        "nickname",
        "username",
        "sex",
        "email",
        "wechat",
        "phone",
        "avatar",
        "status",
        "created_at",
        "remark",
        "login_date",
      ],
    });

    return res;
  }

  /**
   * @description 删除菜单
   * @param {number} id - 要删除的菜单ID
   * @returns {Promise<boolean>} 操作是否成功
   */
  async delete(id) {
    const res = await this.deleteById(id);
    return res;
  }

  // 增
  async create(body) {
    const result = await this.insert(body);
    return result;
  }

  //改
  async update({ query, data }) {
    const result = await this.updateByQuery({ query, data });
    return result;
  }
}

export default new UserService();
