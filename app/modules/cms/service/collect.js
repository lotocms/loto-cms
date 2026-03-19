import iconv from "iconv-lite";

class CollectService extends Chan.Service {
  constructor() {
    super(Chan.db, "plus_collect");
  }

  /**
   * 抓取网页内容（支持 GB2312 / Buffer）
   */
  async common(url, charset) {
    const result = await Chan.helper.request(url, {
      method: "GET",
      responseType: "arraybuffer",
      parseJson: false,
      timeout: 15000,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
        Referer: url,
        "Accept-Language": "zh-CN,zh;q=0.9",
      },
    });

    if (!result.success) {
      throw new Error(result.error || "请求失败");
    }

    const buffer = Buffer.from(result.data);
    return charset === "1" ? buffer : iconv.decode(buffer, "gb2312");
  }

  /**
   * 新增采集任务
   */
  async create(body) {
    const res = await this.insert(body);
    return res;
  }

  /**
   * 删除采集任务
   */
  async delete(id) {
    const res = await this.deleteById(id);
    return res;
  }

  /**
   * 更新采集任务
   */
  async update(body) {
    const { id, ...data } = body;
    if (!id) return fail("缺少 id 参数", { code: 2002 });

    const res = await this.updateById(id, data);
    return res;
  }

  /**
   * 分页查询采集任务列表
   */
  async list(cur = 1, pageSize = 10) {
    const page = Math.max(1, parseInt(cur));
    const limit = Math.min(pageSize, 100); // 防止过大 pageSize
    const offset = (page - 1) * limit;

    const [{ count }] = await this.db(this.tableName).count("id as count");
    const list = await this.db(this.tableName)
      .select(
        "plus_collect.id",
        "plus_collect.taskName",
        "plus_collect.pages",
        "plus_collect.updatedAt",
        "plus_collect.charset",
        "plus_collect.titleTag",
        "plus_collect.articleTag",
        "plus_collect.parseData",
        "plus_collect.status",
        "plus_collect.cid",
        "cms_category.name as category"
      )
      .innerJoin("cms_category", "plus_collect.cid", "cms_category.id")
      .limit(limit)
      .offset(offset)
      .orderBy("plus_collect.id", "desc");

    const total = Math.ceil(count / limit);

    const formattedList = Chan.helper.formatDateFields(list, [
      "createdAt",
      "updatedAt",
      "publishTime",
      "startTime",
      "endTime",
    ]);

    return {
      success: true,
      code: 200,
      msg: "查询成功",
      data: {
        count,
        total,
        current: page,
        list: formattedList,
      },
    };
  }

  /**
   * 查询单个任务详情
   */
  async detail(id) {
    const data = await this.db(this.tableName)
      .where("id", id)
      .select([
        "id",
        "taskName",
        "targetUrl",
        "listTag",
        "startNum",
        "endNum",
        "increment",
        "pages",
        "titleTag",
        "articleTag",
        "charset",
        "parseData",
        "status",
        "cid",
      ])
      .first();

    return data || null;
  }

  /**
   * 搜索采集任务（修复 SQL 注入）
   */
  async search(key = "", cur = 1, pageSize = 10) {
    const page = Math.max(1, parseInt(cur));
    const limit = Math.min(pageSize, 100);
    const offset = (page - 1) * limit;

    // 转义 LIKE 特殊字符：% _ \
    const safeKey = key.replace(/[%_\\]/g, (match) => `\\${match}`);
    const likePattern = `%${safeKey}%`;

    const [{ count }] = await this.db(this.tableName)
      .count("id as count")
      .where("taskName", "like", likePattern);

    const list = await this.db(this.tableName)
      .select("id", "taskName", "targetUrl", "updatedAt", "charset", "status")
      .where("taskName", "like", likePattern)
      .orderBy("id", "desc")
      .limit(limit)
      .offset(offset);

    const formattedList = Chan.helper.formatDateFields(list, [
      "createdAt",
      "updatedAt",
      "publishTime",
      "startTime",
      "endTime",
    ]);

    return {
      success: true,
      code: 200,
      msg: "查询成功",
      count: count || 0,
      total: Math.ceil((count || 0) / limit),
      current: page,
      list: formattedList,
    };
  }
}

export default new CollectService();
