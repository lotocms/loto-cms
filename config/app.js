export const APP_NAME = "LotoCMS";
export const APP_VERSION = "1.0.2";
export const APP_VERSION_TIME = "2026-02-28";
export const APP_AUTHOR_EMAIL = "lotomic@qq.com";
export const APP_AUTHOR_WECHAT = "lotomic";
export const PORT = process.env.PORT || "3001";
export const BODY_LIMIT = process.env.BODY_LIMIT || "100kb";
export const NODE_ENV = process.env.NODE_ENV || "development";
export const APP_DEBUG = process.env.APP_DEBUG === "true";
export const PAGE_SIZE = process.env.PAGE_SIZE || 20;
export const LIMIT_MAX = process.env.LIMIT_MAX || 300;

export default {
  APP_NAME,
  APP_VERSION,
  APP_VERSION_TIME,
  APP_AUTHOR_EMAIL,
  APP_AUTHOR_WECHAT,
  PORT,
  BODY_LIMIT,
  NODE_ENV,
  APP_DEBUG,
  PAGE_SIZE,
  LIMIT_MAX,
};