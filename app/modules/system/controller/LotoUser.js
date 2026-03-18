import userService from "../service/lotouser.service.js";
import bcrypt from "bcryptjs";

const { config } = Chan;

class LotoUserController extends Chan.Controller {
  async detail(req, res, next) {
    try {
      const { id } = req.query;
      if (id === undefined || id === "") {
        this.throwInvalidError({ data: { errors: ["miss id in query"] } });
      }
      const ret = await userService.getById(id);
      res.json(this.success(ret));
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const body = req.body;
      const token = req.headers.token;
      if (!token && !body?.password?.length) {
        return this.throwInvalidError({
          msg: "请设置用户密码!",
          data: { errors: ["password is empty"] },
        });
      }
      if (!body.username) {
        return this.throwInvalidError({
          msg: "请设置用户名!",
          data: { errors: ["username is empty"] },
        });
      }

      const enpw = body?.password?.length
        ? await bcrypt.hash(body.password, parseInt(config.PASSWORD_SALT ?? 10))
        : body.password;

      let data = { ...req.body, password: enpw };
      if (req.user) {
        data = { ...data, create_by: req.user.uid };
      }
      const ret = await userService.create(data);

      res.json(this.success(ret));
    } catch (error) {
      next(error);
    }
  }
}

export default new LotoUserController();
