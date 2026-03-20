class ResourceService extends Chan.Service {
  constructor() {
    super(Chan.db, "lts_resource");
  }
  /**
   *
   * @param {*} queryParams
   * @returns {data:{list,total,...},msg,...}
   */
  async pageList(queryParams) {
    const { keywords = "", ...others } = queryParams;
    //super query options : current,pageSize,query[knex where condition],likeCondition:{column,value,mode},filed,sort
    let options = {
      ...others,
      sort: {
        path: "asc",
      },
    };
    if (keywords.length) {
      options.likeCondition = {
        column: "path",
        value: keywords,
        mode: "left",
      };
    }

    return await this.query(options);
  }

  async save(data) {
    const { id, ...others } = data;
    return await this.updateById(id, others);
  }
}

export default new ResourceService();
