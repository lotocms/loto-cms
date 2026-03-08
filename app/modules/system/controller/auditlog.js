import auditLogService from "../service/AuditService.js";

const {
  config,
  helper: { getToken },
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
        uid: user.id,
        username: user?.username,
        logtype: "system-login",
        locked: true,
      };
      const data = await auditLogService.create(record);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  async health(_req, res, _next) {
    res.json(this.success({ ts: new Date() }));
  }

  async list(req, res, _next) {
    // const res = await
    const queryParams = req?.query || {};
    const ret = await auditLogService.pageList(queryParams);
    res.json(this.success(ret));
  }
}

export default new SysAuditLogController();
