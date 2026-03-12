import { buildMenuTreeNodes } from "../../../helper/tree.js";

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
    "extra_json as extraJson",
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

    if (keywords?.length) {
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

  async getSubPageList(query) {
    const { current = 1, pageSize = this.limit, keywords = "", pid = 0 } = query || {};
    const size = Math.min(Math.max(this.pageSize, 1), this.limit);
    const offset = (current - 1 < 0 ? 1 : current - 1) * size;

    let qb = this.createQueryBuilder("*").where("pid", "=", pid);
    let qbCount = this.createQueryBuilder().where("pid", "=", pid);

    if (keywords?.length) {
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

  /**
   * 授权页
   * 获取全部menus 数据并以tree array 返回
   */
  async allTreeNodes() {
    const all = await this.all({ sort: { pid: "asc", sortno: "asc" }, fields: this.fields });

    const treeNodes = buildMenuTreeNodes(all ?? [], 0);
    return {
      success: true,
      code: 200,
      msg: "查询成功",
      data: treeNodes,
    };
  }

  async allMenuTreeNodes() {
    const list = await this.createQueryBuilder(this.fields)
      .whereIn("type", ["M", "C"])
      .orderBy("type", "desc")
      .orderBy("sortno", "asc");

    const treeNodes = buildMenuTreeNodes(list ?? [], 0);
    return {
      success: true,
      code: 200,
      msg: "查询成功",
      data: treeNodes,
    };
  }
}

export default new MenuService();
