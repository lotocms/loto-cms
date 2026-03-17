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

  async createNew(body) {
    const { pid = 0, ...others } = body;
    const sortno = await this.getLevelMaxSortno(pid);
    const res = await this.insert({ ...others, pid, sortno });
    return res;
  }

  async getLevelMaxSortno(pid = 0) {
    const result = await this.createQueryBuilder()
      .max("sortno", { as: "maxSortno" })
      // .select("MAX(sortno) as maxSortno")
      .where({ pid })
      .first();

    const maxSortno = result?.maxSortno ? parseInt(result.maxSortno) : 0;
    return maxSortno + 1;
  }

  async getUserRouter(userId) {
    try {
      console.log(`[SysMenu.allRouter] 开始查询用户 ${userId} 的菜单`);
      const roles = await this.db("lts_role").select()
    } catch (error) {
      console.error(`[SysMenu.allRouter] 查询用户 ${userId} 的菜单时出错:`, error.message);
      console.error(`[SysMenu.allRouter] 错误堆栈:`, error.stack);
      return { success: false, code: 500, msg: "查询失败", data: { perms: [], routers: [] } };
    }
  }
}

export default new MenuService();
