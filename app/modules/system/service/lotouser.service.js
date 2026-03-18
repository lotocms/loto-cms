import { InvalidError } from "@lotomic/chanjs";

const { ROLE_VISITOR_ID } = Chan.config;
class LotoUserService extends Chan.Service {
  constructor() {
    super(Chan.db, "lts_user");
  }

  getById(id) {
    return this.findById(id);
  }

  async create(params) {
    let { role_id = ROLE_VISITOR_ID, username, password, ...others } = params;

    return await this.db.transaction(async (trx) => {
      const find = await trx(this.tableName).where({ username }).first();
      if (find) {
        throw new InvalidError(`用户${username} 已存在`, 409);
      }

      const userno = await global.snowflake?.nextUno();
      const status = password?.length ? true : false;

      let saved = {
        username,
        userno,
        password,
        ...others,
        status,
      };
      if (password?.length) {
        saved.pwd_update_date = new Date();
      }

      const formattedData = this._formatDateFields(saved);
      const insertRes = await trx(this.tableName).insert(formattedData);
      const insertId = insertRes?.[0];

      if (insertId && role_id) {
        await trx("lts_user_role").insert({ user_id: insertId, role_id });
      }

      return {
        success: true,
        code: 200,
        msg: "插入成功",
        data: {
          insertId,
          affectedRows: insertRes?.length ?? 0,
        },
      };
    });
  }

  async _getByUsername(username) {
    return await this.qb.where({ username }).first();
  }
}

export default new LotoUserService();
