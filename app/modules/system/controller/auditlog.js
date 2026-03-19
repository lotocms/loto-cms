import auditLogService from "../service/AuditService.js";
import bcrypt from "bcryptjs";

const {
  config,
  helper: { getToken, generateToken },
} = Chan;

class SysAuditLogController extends Chan.Controller {
  constructor() {
    super(Chan.sysdb, "sys_audit_log");
  }

  /**
   * 记录日志
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async create(req, res, next) {
    try {
      const token = req.headers.token;
      const user = await getToken(token, config?.JWT_SECRET);

      let record = {
        ...req.body,
        uid: user.uid,
        username: user?.username,
        logtype: "sysuser-login",
        locked: true,
      };
      const data = await auditLogService.create(record);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  async health(_req, res, _next) {
    // const nextId = Chan.snowflake.nextId();
    const enpw = await bcrypt.hash("Admin!123", 13);

    const nextId = global.snowflake?.nextUno();
    console.log(nextId);
    const token = await generateToken(
      {
        uid: 1,
        username: "admin",
        roles: "super,admin,auditor",
        phone: "18866448899",
        uno: "1g6d9y7ls",
      },
      config.JWT_SECRET,
      "1000d"
    );
    res.json(this.success({ ts: new Date(), nextId: nextId, enpw, token }));
  }

  async list(req, res, _next) {
    // const res = await
    const queryParams = req?.query || {};
    const ret = await auditLogService.pageList(queryParams);
    res.json(this.success(ret));
  }
}

export default new SysAuditLogController();
