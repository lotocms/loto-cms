import path from "path";

// 扩展表 Service
class ExtensionTableService {
  constructor(db) {
    this.db = db;
  }

  /**
   * 获取栏目对应的模型ID
   */
  async getModelIdByCategoryId(categoryId, trx = null) {
    const db = trx || this.db;
    const result = await db("cms_category").where("id", categoryId).select("mid").first();
    return result?.mid || null;
  }

  /**
   * 根据模型ID获取表名
   */
  async getTableNameByModelId(modelId, trx = null) {
    if (!modelId || modelId === "0") return null;

    const db = trx || this.db;
    const result = await db("cms_model").where("id", modelId).select("tableName").first();
    return result?.tableName || null;
  }

  /**
   * 获取文章对应的扩展表信息
   */
  async getExtensionTableInfo(articleId, trx = null) {
    const db = trx || this.db;

    const article = await db("cms_article").where("id", articleId).select("cid").first();

    if (!article?.cid) return null;

    const category = await db("cms_category").where("id", article.cid).select("mid").first();

    if (!category?.mid || category.mid === "0") return null;

    const model = await db("cms_model").where("id", category.mid).select("tableName").first();

    return model?.tableName ? { tableName: model.tableName } : null;
  }

  /**
   * 插入扩展表数据
   */
  async insertExtensionData(tableName, articleId, fieldParams, trx) {
    if (!tableName || !articleId) return null;

    return await trx(tableName).insert({ ...fieldParams, aid: articleId });
  }

  /**
   * 更新或插入扩展表数据
   */
  async upsertExtensionData(tableName, articleId, fieldParams, trx) {
    if (!tableName || !articleId) return null;

    const exists = await trx(tableName).where("aid", articleId).first();

    if (exists) {
      return await trx(tableName).where("aid", articleId).update(fieldParams);
    } else {
      return await trx(tableName).insert({ ...fieldParams, aid: articleId });
    }
  }
}

// 标签 Service
class TagService {
  constructor(db) {
    this.db = db;
  }

  /**
   * 解析标签ID字符串为数组
   */
  parseTagIds(tagIdString) {
    if (!tagIdString || !tagIdString.length) return [];
    return tagIdString.split(",").map(Number).filter(Boolean);
  }

  /**
   * 批量插入标签关联
   */
  async insertTagMappings(articleId, tagIds, trx) {
    if (!tagIds.length) return;

    const mappings = tagIds.map((tid) => ({ aid: articleId, tid }));
    await trx("cms_articletag").insert(mappings);
  }

  /**
   * 更新标签计数
   */
  async updateTagCounts(oldTagIds, newTagIds, trx) {
    const db = trx || this.db;

    const toIncrement = newTagIds.filter((id) => !oldTagIds.includes(id));
    const toDecrement = oldTagIds.filter((id) => !newTagIds.includes(id));

    if (toIncrement.length > 0) {
      await db("cms_tag").whereIn("id", toIncrement).increment("count", 1);
    }

    if (toDecrement.length > 0) {
      await db("cms_tag").whereIn("id", toDecrement).where("count", ">", 0).decrement("count", 1);
    }
  }

  /**
   * 更新标签计数（+1）
   */
  async incrementTagCounts(tagIds, trx) {
    if (!tagIds.length) return;

    await trx("cms_tag").whereIn("id", tagIds).increment("count", 1);
  }

  /**
   * 更新标签计数（-1）
   */
  async decrementTagCounts(tagIds, trx) {
    if (!tagIds.length) return;
    // auto
    await trx("cms_tag").whereIn("id", tagIds).where("count", ">", 0).decrement("count", 1);
  }

  /**
   * 删除标签映射
   */
  async deleteTagMappings(articleIds, trx) {
    await trx("cms_articletag").whereIn("aid", articleIds).del();
  }

  /**
   * 从文章数据中提取所有标签ID
   */
  extractTagIdsFromArticles(articles) {
    const allTags = [];
    for (const article of articles) {
      if (article.tagId) {
        const tags = article.tagId.split(",").map(Number).filter(Boolean);
        allTags.push(...tags);
      }
    }
    return [...new Set(allTags)];
  }
}

// 图片 Service
class ImageService {
  constructor() {
    this.db = Chan.db;
  }

  /**
   * 获取文章中的图片路径
   */
  async getImagesByArticleId(articleId, trx = null) {
    const db = trx || this.db;
    const result = await db("cms_article").select("img", "content").where("id", articleId).first();

    const images = [];
    if (result?.img) {
      images.push(result.img);
    }
    if (result?.content) {
      const contentImages = Chan.common.filterImgFromStr(result.content);
      images.push(...contentImages);
    }

    return images;
  }

  /**
   * 批量获取文章图片
   */
  async getImagesByArticleIds(articleIds, trx = null) {
    const db = trx || this.db;
    const articles = await db("cms_article")
      .select("id", "img", "content")
      .whereIn("id", articleIds);

    const allImages = [];
    for (const article of articles) {
      if (article.img) {
        allImages.push(article.img);
      }
      if (article.content) {
        const contentImages = Chan.common.filterImgFromStr(article.content);
        allImages.push(...contentImages);
      }
    }

    return allImages;
  }

  /**
   * 删除本地图片
   */
  deleteLocalImages(imagePaths) {
    const localImgs = imagePaths.filter((p) => p.includes("public/upload"));
    for (const imgPath of localImgs) {
      Chan.helper.delImg(path.join(__dirname, "../../", imgPath));
    }
  }
}

class ArticleService extends Chan.Service {
  constructor() {
    super(Chan.db, "cms_article");
    this.extensionService = new ExtensionTableService(this.db);
    this.tagService = new TagService(this.db);
    this.imageService = new ImageService();
  }

  // 增：创建文章（含事务）
  async create(body) {
    const { defaultParams, fieldParams } = body;

    return await this.db.transaction(async (trx) => {
      const { updatedAt, ...paramsToInsert } = defaultParams;
      const formattedParams = this._formatDateFields(paramsToInsert);

      const [insertResult, categoryInfo] = await Promise.all([
        trx(this.tableName).insert(formattedParams),
        trx("cms_category").where("id", defaultParams.cid).select("mid").first(),
      ]);

      const id = insertResult[0];
      if (!id) throw new Error("Failed to insert article");

      if (!categoryInfo?.mid) {
        return { success: true, data: { id } };
      }

      const tableRow = await trx("cms_model")
        .where("id", categoryInfo.mid)
        .select("tableName")
        .first();

      const tasks = [];

      if (tableRow?.tableName) {
        tasks.push(trx(tableRow.tableName).insert({ ...fieldParams, aid: id }));
      }

      if (defaultParams.tagId && defaultParams.tagId.length > 0) {
        const tags = defaultParams.tagId.split(",").map(Number).filter(Boolean);

        if (tags.length > 0) {
          tasks.push(trx("cms_articletag").insert(tags.map((tid) => ({ aid: id, tid }))));

          tasks.push(trx("cms_tag").whereIn("id", tags).increment("count", 1));
        }
      }

      if (tasks.length > 0) {
        await Promise.all(tasks);
      }

      return { success: true, data: { id } };
    });
  }

  // 删：删除文章（含图片、标签、扩展数据）
  async delete(id) {
    // 校验并转换 ID 数组
    const ids = String(id).split(",").map(Number).filter(Boolean);
    if (ids.length === 0) return { success: false, msg: "参数无效" };

    try {
      return await this.db.transaction(async (trx) => {
        // 1. 批量获取所有文章信息（并行查询）
        const [articles, extensionTables] = await Promise.all([
          trx(this.tableName).whereIn("id", ids).select("id", "cid", "tagId"),
          this.getExtensionTablesByArticleIds(ids, trx),
        ]);

        if (articles.length === 0) {
          return { success: false, msg: "文章不存在" };
        }

        // 2. 并行删除所有数据
        const deleteTasks = [
          // 删除主文章
          trx(this.tableName).whereIn("id", ids).del(),
          // 删除标签映射
          this.tagService.deleteTagMappings(ids, trx),
        ];

        // 删除扩展表数据
        if (extensionTables.length > 0) {
          for (const tableName of extensionTables) {
            deleteTasks.push(trx(tableName).whereIn("aid", ids).del());
          }
        }

        await Promise.all(deleteTasks);

        // 3. 更新标签计数（在所有删除完成后）
        const tagIds = this.tagService.extractTagIdsFromArticles(articles);
        if (tagIds.length > 0) {
          await this.tagService.decrementTagCounts(tagIds, trx);
        }

        // 4. 异步删除图片（不阻塞事务）
        const imagePaths = await this.imageService.getImagesByArticleIds(ids, trx);
        if (imagePaths.length > 0) {
          // 在事务提交后再删除图片
          process.nextTick(() => {
            this.imageService.deleteLocalImages(imagePaths);
          });
        }

        return { success: true, data: { affectedRows: ids.length } };
      });
    } catch (err) {
      console.error("[ArticleService.delete] 删除失败:", err.message);
      throw err;
    }
  }

  /**
   * 根据文章ID批量获取扩展表名
   */
  async getExtensionTablesByArticleIds(articleIds, trx = null) {
    const db = trx || this.db;

    // 获取所有文章的栏目ID
    const articles = await db(this.tableName).whereIn("id", articleIds).select("cid");

    const categoryIds = [...new Set(articles.map((a) => a.cid))];

    // 获取模型IDs
    const models = await db("cms_category")
      .whereIn("id", categoryIds)
      .whereNotNull("mid")
      .select("mid");

    const modelIds = [...new Set(models.map((m) => m.mid).filter(Boolean))];

    if (modelIds.length === 0) return [];

    // 获取表名
    const tables = await db("cms_model").whereIn("id", modelIds).select("tableName");

    return tables.map((t) => t.tableName).filter(Boolean);
  }

  // 改：更新文章
  async update(body) {
    const { id, field, oldTagId, ...updateData } = body;

    try {
      return await this.db.transaction(async (trx) => {
        const [articleExists, modelInfo] = await Promise.all([
          trx(this.tableName).where("id", id).first(),
          this.extensionService.getExtensionTableInfo(id, trx),
        ]);

        if (!articleExists) {
          return { success: false, msg: "文章不存在" };
        }

        if (modelInfo?.tableName && field) {
          await this.extensionService.upsertExtensionData(modelInfo.tableName, id, field, trx);
        }

        const tagTasks = [];
        const oldTagIds = this.tagService.parseTagIds(oldTagId);
        const newTagIds = this.tagService.parseTagIds(updateData.tagId);

        tagTasks.push(trx("cms_articletag").where("aid", id).del());

        if (newTagIds.length > 0) {
          tagTasks.push(this.tagService.insertTagMappings(id, newTagIds, trx));
        }

        await Promise.all(tagTasks);

        await this.tagService.updateTagCounts(oldTagIds, newTagIds, trx);

        const { updatedAt, ...dataToUpdate } = updateData;
        const formattedData = this._formatDateFields(dataToUpdate);
        await trx(this.tableName).where("id", id).update(formattedData);

        return { success: true, data: { affectedRows: 1 } };
      });
    } catch (err) {
      console.error("[ArticleService.update] 更新失败:", err.message);
      throw err;
    }
  }

  // 查：文章列表（支持分页和栏目筛选）
  async list(cur = 1, pageSize = 10, cid) {
    const page = Math.max(1, parseInt(cur) || 1);
    const limit = Math.max(1, parseInt(pageSize) || 10);
    const offset = (page - 1) * limit;

    let query = this.db(this.tableName).select([
      "id",
      "title",
      "attr",
      "pv",
      "createdAt",
      "status",
    ]);

    // 如果传了 cid，且是有效数字或数组
    if (cid) {
      const ids = Array.isArray(cid) ? cid : [cid].flat().map(Number).filter(Boolean);
      if (ids.length > 0) {
        query = query.whereIn("cid", ids);
      }
    }

    const totalResult = await query.clone().count("* as count").first();
    const count = parseInt(totalResult?.count || 0, 10);

    const list = await query.orderBy("id", "desc").offset(offset).limit(limit);

    const formattedList = Chan.helper.formatDateFields(list, [
      "createdAt",
      "updatedAt",
      "publishTime",
      "startTime",
      "endTime",
    ]);

    return {
      count,
      total: Math.ceil(count / limit),
      current: page,
      list: formattedList,
    };
  }

  // 查：文章详情
  async detail(id) {
    const data = await this.db(this.tableName).where("id", id).first();

    if (!data || !data.cid) {
      return { success: false, msg: "文章不存在" };
    }

    let field = {};
    const categoryInfo = await this.db("cms_category").where("id", data.cid).select("mid").first();

    if (categoryInfo?.mid && categoryInfo.mid !== "0") {
      const tableRow = await this.db("cms_model")
        .where("id", categoryInfo.mid)
        .select("tableName")
        .first();

      if (tableRow?.tableName) {
        const fieldData = await this.db(tableRow.tableName).where("aid", id).first();
        field = fieldData || {};
      }
    }

    const formattedData = Chan.helper.formatDateFields(data, [
      "createdAt",
      "updatedAt",
      "publishTime",
      "startTime",
      "endTime",
    ]);
    const formattedField = Chan.helper.formatDateFields(field, [
      "createdAt",
      "updatedAt",
      "publishTime",
      "startTime",
      "endTime",
    ]);

    return { success: true, data: { ...formattedData, field: formattedField } };
  }

  // 搜索文章（标题 + 栏目）
  async search(key = "", cur = 1, pageSize = 10, cid = 0) {
    const keyword = key.trim();
    const page = Math.max(1, parseInt(cur) || 1);
    const limit = Math.max(1, parseInt(pageSize) || 10);
    const offset = (page - 1) * limit;

    // 转义 LIKE 特殊字符：% _ \
    const escapeLike = (str) => str.replace(/[%_\\]/g, "\\$&");
    const safeKey = keyword ? `%${escapeLike(keyword)}%` : "%";

    let countQuery = this.db("cms_article as a")
      .leftJoin("cms_category as c", "a.cid", "c.id")
      .count("* as count");

    let listQuery = this.db("cms_article as a")
      .select(
        "a.id",
        "a.title",
        "a.attr",
        "a.tagId",
        "a.description",
        "a.cid",
        "a.pv",
        "a.createdAt",
        "a.status",
        "c.name",
        "c.path",
        "c.type"
      )
      .leftJoin("cms_category as c", "a.cid", "c.id")
      .orderBy("a.id", "desc")
      .offset(offset)
      .limit(limit);

    if (keyword) {
      countQuery = countQuery.where("a.title", "LIKE", safeKey);
      listQuery = listQuery.where("a.title", "LIKE", safeKey);
    }

    if (cid) {
      countQuery = countQuery.andWhere("c.id", cid);
      listQuery = listQuery.andWhere("c.id", cid);
    }

    const totalResult = await countQuery.first();
    const count = parseInt(totalResult?.count || 0, 10);
    const list = await listQuery;

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
        total: Math.ceil(count / limit),
        current: page,
        list: formattedList,
      },
    };
  }

  // 增加浏览量
  async count(id) {
    const result = await this.db("cms_article").where("id", id).increment("pv", 1);
    return result ? "success" : "fail";
  }

  // 上一篇文章
  async pre(id, cid) {
    return await this.db("cms_article as a")
      .leftJoin("cms_category as c", "a.cid", "c.id")
      .where("a.id", "<", id)
      .andWhere("a.cid", cid)
      .orderBy("a.id", "desc")
      .select("a.id", "a.title", "c.name", "c.path")
      .first();
  }

  // 下一篇文章
  async next(id, cid) {
    return await this.db("cms_article as a")
      .leftJoin("cms_category as c", "a.cid", "c.id")
      .where("a.id", ">", id)
      .andWhere("a.cid", cid)
      .orderBy("a.id", "asc")
      .select("a.id", "a.title", "c.name", "c.path")
      .first();
  }

  // 获取栏目对应模型的字段配置
  async findField(cid) {
    const modIdRow = await this.db("cms_category")
      .where("id", cid)
      .whereNotNull("mid")
      .select("mid")
      .first();

    let fields = [];
    if (modIdRow) {
      fields = await this.db("cms_field")
        .where("mid", modIdRow.mid)
        .select("cname", "ename", "type", "val", "defaultVal", "orderBy")
        .limit(12);
    }

    return { success: true, code: 200, msg: "查询成功", data: { fields } };
  }

  // 统计数据
  async tongji() {
    const [week, message, tag, article] = await Promise.all([
      this.db("cms_article")
        .count("* as count")
        .where("createdAt", ">=", this.db.raw("DATE_SUB(CURDATE(), INTERVAL 7 DAY)"))
        .first(),

      this.db("cms_message").count("* as count").first(),
      this.db("cms_tag").count("* as count").first(),
      this.db("cms_article").count("* as count").first(),
    ]);

    return {
      success: true,
      code: 200,
      msg: "查询成功",
      data: {
        week: week.count,
        message: message.count,
        tag: tag.count,
        article: article.count,
      },
    };
  }
}

export default new ArticleService();
