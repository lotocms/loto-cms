import app from "./app.js";
import cache from "./cache.js";
import cors from "./cors.js";
import db from "./database.js";
import email from "./email.js";
// index splitor
import jwt from "./jwt.js";
import logger from "./log.js";
import modules from "./modules.js";
import perms from "./perm.js";
import plugins from "./plugins.js";
import salt from "./salt.js";
import statics from "./statics.js";
import upload from "./upload.js";
import views from "./view.js";
import waf from "./waf.js";
import wechat from "./wechat.js";

export default {
  ...app,
  ...cache,
  ...cors,
  ...db,
  ...email,
  // index
  ...jwt,
  ...logger,
  ...modules,
  ...perms,
  ...plugins,
  ...salt,
  ...statics,
  ...upload,
  ...views,
  ...waf,
  ...wechat,
};
