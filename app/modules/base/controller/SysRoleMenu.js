const {
  common: { success, fail },
} = Chan;
import SysRoleMenu from "../service/SysRoleMenu.js";

class SysRoleMenuController extends Chan.Controller {
  async list(req, res, next) {
    try {
      const id = req.query.id;
      const data = await SysRoleMenu.list({ role_id: id });
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }
}

export default new SysRoleMenuController();
