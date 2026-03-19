/**
 * JWT 配置
 */
export default {
  JWT_SECRET: process.env.JWT_SECRET || "DefHB2nSF_J6J",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
  JWT_REFRESH: process.env.JWT_REFRESH || false,
};
