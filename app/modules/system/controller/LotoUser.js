import userService from "../service/lotouser.service.js";
import bcrypt from "bcryptjs";

const { config } = Chan;

class LotoUserController extends Chan.Controller {
  async detail(req, res, next) {
    try {
      const res = await userService.getById(id);
      res.json(this.success(res));
    } catch (error) {
      next(error);
    }
  }

  async add(req, res, next) {
    try {
      const body = req.body;
      const token = req.headers.token;
      if (!token && !body?.password?.length) {
        return res.json(this.fail({ msg: "请设置用户密码!", code: 400 }));
      }

      const enpw = await bcrypt.hash(body.password, parseInt(config.PASSWORD_SALT ?? 18));
      const res = await userService.getById(id);
      res.json(this.success(res));
    } catch (error) {
      next(error);
    }
  }
}

export default new LotoUserController();
