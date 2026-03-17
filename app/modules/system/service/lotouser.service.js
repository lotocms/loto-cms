class LotoUserService extends Chan.Service {
  constructor() {
    super(Chan.db, "loto_user");
  }

  getById(id) {
    return this.findById(id);
  }
}

export default new LotoUserService();
