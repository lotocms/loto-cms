const {
  config,
  helper: { setToken, getToken },
  common: { success, fail },
} = Chan;

import SysUserRole from "../service/SysUserRole.js";

class SysUserRoleController extends Chan.Controller {
  // 查
  async detail(req, res, next) {
    try {
      const { user_id } = req.query;
      const data = await SysUserRole.detail(user_id);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }
}

export default new SysUserRoleController();
