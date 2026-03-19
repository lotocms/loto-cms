const {
  config: { EMAIL, USER_SALT, JWT_SECRET, JWT_EXPIRES_IN },
  helper: { setToken, getToken, genCode, LogError, getIp },
  common: { success, fail, genRegEmailHtml, genResetPasswordEmail, sendMail },
} = Chan;

import User from "../service/User.js";
import bcrypt from "bcryptjs";

class UserController extends Chan.Controller {
  async getExternalIP() {
    try {
      const response = await fetch("http://ip-api.com/json/?lang=zh-CN");
      const data = await response.json();
      if (data.status === "success") {
        return data.query;
      }
    } catch (error) {
      console.error("[UserController] 获取外网IP失败:", error.message);
    }
    return null;
  }

  async sendEmail(req, res, next) {
    const { email, code, type } = req.body;
    let emailcode = genCode(code, EMAIL.CODE);
    if (type === "register") {
      await sendMail(email, "注册验证码", genRegEmailHtml(emailcode));
    } else {
      await sendMail(email, "修改密码验证码", genResetPasswordEmail(emailcode));
    }

    res.json(this.success({ data: "邮件发送成功" }));
  }

  async login(req, res, next) {
    try {
      const { username, password, fp } = req.body;
      const ip = getIp(req);

      const result = await User.findUser(username);
      if (result.success && result.data) {
        let user = result.data;
        if (!user.id) {
          res.json(this.fail({ msg: "不存在此用户" }));
          return;
        }
        const match = await bcrypt.compare(password, user.password);
        if (user && match) {
          const { id, username, status, avatar, nickname } = user;

          // 如果是本地地址或没有获取到IP，尝试获取外网IP
          let realIP = ip;
          const isLocalAddress = !ip || ip === "::1" || ip === "127.0.0.1" || ip === "localhost";
          if (isLocalAddress) {
            const externalIP = await this.getExternalIP();
            if (externalIP) {
              realIP = externalIP;
            }
          }

          // 使用请求中的 fp，如果没有则使用默认值
          const realFP = fp || "";

          // 设置token
          const token = setToken({ uid: id, fp: realFP, ip: realIP }, JWT_SECRET, JWT_EXPIRES_IN);

          // 设置 cookie，保持与 token 中的 fp 和 ip 一致
          res.cookie("_f", realFP, {
            httpOnly: false,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
            sameSite: "lax",
          });
          res.cookie("_i", realIP, {
            httpOnly: false,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
            sameSite: "lax",
          });

          res.json(
            this.success({
              data: { id, username, status, token, ip: realIP, avatar, headimgurl: avatar },
            })
          );
        } else {
          res.json(this.fail({ msg: "密码错误！" }));
        }
      } else {
        res.json(this.fail({ msg: "用户不存在！" }));
      }
    } catch (err) {
      console.error("UserController.login-->", err);
      next(err);
    }
  }

  // 注册
  async register(req, res, next) {
    try {
      const { username, password, email } = req.body;
      let _password = await bcrypt.hash(password, parseInt(USER_SALT));
      const data = await User.create({ username, password: _password, email });
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  async checkEmail(req, res, next) {
    try {
      res.json(this.success({ data: "邮件发送成功" }));
    } catch (err) {
      next(err);
    }
  }

  // 查
  async detail(req, res, next) {
    try {
      const { uid } = req.user;
      const data = await User.detail(uid);
      res.json(this.success({ data }));
    } catch (err) {
      next(err);
    }
  }

  //删除
  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const data = await User.delete(id);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  async resetPass(req, res, next) {
    try {
      const { email, password } = req.body;
      //判断邮箱是否存在
      let user = await User.find(email);
      if (user.code === 200 && user?.data?.list?.length > 0) {
        let _password = await bcrypt.hash(password, parseInt(USER_SALT));
        let data = await User.update({
          query: { email },
          params: { password: _password },
        });
        res.json(this.success(data));
      } else {
        res.json(this.fail({ msg: "账号不存在！" }));
      }
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req, res, next) {
    try {
      let { id, phone, remark, sex, wechat, username, nickname, email } = req.body;
      let query = { id };
      let data = { phone, remark, sex, wechat, username, nickname, email };
      const result = await User.update({ query, data });
      res.json(this.success(result));
    } catch (err) {
      next(err);
    }
  }

  // 改
  async updatePass(req, res, next) {
    try {
      let { uid } = req.user;
      let { password, newPassword } = req.body;
      const result = await User.queryPass(uid);
      if (result.success && result.data) {
        let user = result.data;
        const match = await bcrypt.compare(password, user.password);
        if (user && match) {
          let _password = await bcrypt.hash(newPassword, parseInt(USER_SALT));
          let query = { id: uid };
          let data = { password: _password };
          const result = await User.update({ query, data });
          res.json(this.success(result));
        } else {
          res.json(this.fail({ msg: "原密码错误！" }));
        }
      } else {
        res.json(this.fail({ msg: "用户名或密码错误！" }));
      }
    } catch (err) {
      next(err);
    }
  }
}

export default new UserController();
