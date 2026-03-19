import express from "express";
import init from "../../middleware/init.js";
import verifycode from "./middleware/verifycode.js";
import userauth from "./middleware/userauth.js";
const { loadController } = Chan.helper;
const { singleUpload, multiUpload, logo } = Chan.common;
let controller = await loadController("user");

export default (app, _, chanInst) => {
  const userRouter = express.Router();
  userRouter.use(init());
  //用户
  userRouter.post("/sendEmail", controller.User.sendEmail);
  userRouter.post("/register", verifycode, controller.User.register);
  userRouter.post("/login", controller.User.login);
  userRouter.get("/detail", userauth(), controller.User.detail);
  userRouter.post("/checkEmail", verifycode, controller.User.checkEmail);
  userRouter.post("/resetPass", verifycode, controller.User.resetPass);
  userRouter.post("/updatePass", userauth(), controller.User.updatePass);
  userRouter.post("/updateUser", userauth(), controller.User.updateUser);
  // userRouter.get("/delete", auth(), controller.User.delete);

  //配置前缀
  app.use("/user/v1", userRouter);
  chanInst.collectingRoutes(userRouter, "/user/v1", "user");
};
