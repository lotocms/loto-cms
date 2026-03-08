class LoginLogService extends Chan.Service {
  constructor() {
    super(Chan.db, "sys_loginlog");
  }

  // 增加
  async create(body) {
    const res = await this.insert(body);
    return res;
  }

  // 删除100条之外的数据
  async delete() {
    try {
      // 获取最新的100条记录的ID
      const recentLogIds = await this.db(this.tableName)
        .select("id")
        .orderBy("createdAt", "desc")
        .limit(100);

      // 将ID数组转换为可以用于IN子句的格式
      const idsToKeep = recentLogIds.map((row) => row.id);

      // 删除不在这些ID中的所有记录
      const affectedRows = await this.db(this.tableName).whereNotIn("id", idsToKeep).del();
      
      return { success: true, code: 200, msg: '清理成功', data: { affectedRows } };
    } catch (error) {
      console.error('[LoginLog.delete] 清理登录日志失败:', error.message);
      return { success: false, code: 500, msg: '清理失败', data: {} };
    }
  }

  // 根据ID删除
  async deleteByIds(ids) {
    try {
      const idArray = ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      if (idArray.length === 0) {
        return { success: false, code: 400, msg: '参数错误', data: {} };
      }
      const affectedRows = await this.db(this.tableName).whereIn("id", idArray).del();
      return { success: true, code: 200, msg: '删除成功', data: { affectedRows } };
    } catch (error) {
      console.error('[LoginLog.deleteByIds] 删除登录日志失败:', error.message);
      return { success: false, code: 500, msg: '删除失败', data: {} };
    }
  }

  // 列表
  async list(cur = 1, pageSize = 10) {
    const res = await this.query({
      current: cur,
      pageSize: pageSize,
      query: {},
      fields: ["*"],
      // 按创建时间倒序查询(要求 chanjs >= 2.1.1)
      sort: { createdAt: "desc" },
    });
    
    if (res.success && res.data && res.data.list) {
      const userIds = res.data.list.map(item => item.uid).filter(uid => uid);
      if (userIds.length > 0) {
        const users = await this.db('sys_user')
          .select('id', 'username')
          .whereIn('id', userIds);
        const userMap = {};
        users.forEach(user => {
          userMap[user.id] = user.username;
        });
        res.data.list = res.data.list.map(item => ({
          ...item,
          username: userMap[item.uid] || ''
        }));
      }
    }
    
    return res;
  }
}

export default new LoginLogService();
