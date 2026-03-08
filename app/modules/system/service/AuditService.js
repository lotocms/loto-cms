class SysAuditLogService extends Chan.Service {
  _camelFields = [
    "id",
    "tenant_id as tenantId",
    "uid",
    "username",
    "logtype",
    "ip",
    "country",
    "prov",
    "city",
    "district",
    "isp",
    "lat",
    "lng",
    "description",
    "tags",
    "cliversion",
    "create_time as createTime",
    "update_time as updateTime",
  ];
  constructor() {
    super(Chan.sysdb, "sys_audit_log");
  }

  async create(data) {
    const {
      uid,
      username,
      logtype = "sys-loging",
      ip,
      country,
      prov,
      city,
      district,
      isp,
      lat,
      lng,
      tags = "system",
      description = "system login",
      cliversion = "",
    } = data;

    const res = await this.insert({
      uid,
      username,
      logtype,
      ip,
      country,
      prov,
      city,
      district,
      isp,
      lat,
      lng,
      tags,
      tenant_id: 0,
      description,
      cliversion,
      update_time: new Date(),
    });
    return res;
  }

  /**
   * call extend query pagelist
   */
  async pageList({ current = 1, pageSize = 10, ...where }) {
    const res = await this.query({
      current,
      pageSize,
      query: { ...where },
      sort: { create_time: "desc" },
      field: [...this._camelFields],
    });

    return res;
  }
}

export default new SysAuditLogService();
