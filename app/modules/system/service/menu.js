export class MenuService extends Chan.Service {
  fields = [
    "id",
    "pid",
    "title",
    "name",
    "sortno",
    "path",
    "component",
    "icon",
    "query",
    "perms",
    "type",
    "is_frame as isFrame",
    "is_cache as isCache",
    "is_show as isShow",
    "status",
    "secret_level as secretLevel",
    "remark",
    "role_key as roleKey",
    "extra_json as extraJson",
    "create_by as createBy",
    "create_time as createTime",
    "update_by as updateBy",
    "update_time as updateTime",
    "delete_time as deleteTime",
  ];
  constructor() {
    super(Chan.db, "lts_menu");
  }

  /**
   *  获取分页菜单列表
   * @param {*} query
   */
  async list(query) {
    const { current = 1, pageSize = this.limit, keywords = "" } = query;
    const size = Math.min(Math.max(this.pageSize, 1), this.limit);
    const offset = (current - 1 < 0 ? 1 : current - 1) * size;

    let qb = this.createQueryBuilder("*");
    let qbCount = this.createQueryBuilder();

    if (keywords?.fields) {
      qb = qb
        .whereLike("title", `%${keywords}%`)
        .orWhere("name", `%${keywords}%`)
        .orderBy("pid", "asc")
        .orderBy("sortno", "asc");
      qbCount = qbCount.whereLike("title", `%${keywords}%`).orWhere("name", `%${keywords}%`);
    }

    const [totalResult, list] = await Promise.all([
      qbCount.count("* as total").first(),
      qb.offset(offset).limit(size),
    ]);

    const total = Number(totalResult?.total ?? 0);
    const totalPages = Math.ceil(total / size);

    return {
      success: true,
      code: 200,
      msg: "查询成功",
      data: {
        current,
        pageSize,
        total,
        totalPages,
        list: super.transformDate(list ?? []),
      },
    };
  }
}

export default new MenuService();
