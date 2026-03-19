import express from "express";
const { loadController } = Chan.helper;
let controller = await loadController("wechat");
import { chatRefreshToken } from "./middleware/wechatRefreshToken.js";

export default (app, _, chanInst) => {
  const wechatRouter = express.Router();
  //Auth授权登录
  wechatRouter.get("/auth", controller.AuthLogin.authorize);
  //Auth登录回调
  wechatRouter.get("/callback", controller.AuthLogin.callback);
  // 扫码登录和回调
  wechatRouter.get("/loginQrCode", controller.ScanLogin.loginQrCode);
  //微信默认校验验证服务器是否通
  wechatRouter.get("/eventCallback", controller.ScanLogin.verifyServer); // 处理 GET 验证
  //具体业务处理
  wechatRouter.post("/eventCallback", controller.ScanLogin.eventCallback);
  //轮询扫码状态
  wechatRouter.get("/scanStatus", controller.ScanLogin.scanStatus);
  //获取微信分享配置
  wechatRouter.post("/shareConfig", controller.Share.getConfig);
  // 微信小程序登录
  wechatRouter.post("/minip/login", controller.Minip.login);
  //配置前缀
  app.use("/wechat/v1", wechatRouter);

  chanInst.collectingRoutes(baseRouter, "/wechat/v1", "wechat");
};
