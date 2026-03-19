const {
  config: { JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH, APP_DEBUG },
  helper: { setToken, getToken },
} = Chan;
import SysMenu from "../modules/base/service/SysMenu.js";

const REFRESH_THRESHOLD = 30 * 60; // 30分钟

// 统一响应处理函数，减少重复代码
const sendResponse = (res, code, message, data = null) => {
  res.json({ code, msg: message, data });
};

const MIDDLEWARE_NAME = Symbol("middlewareName");
export default () => {
  let authMiddleware = async (req, res, next) => {
    try {
      const token = req.headers.token || req.cookies?.token || "";

      // 2. 检查token是否存在
      if (!token) {
        return sendResponse(res, 401, "token缺失");
      }
      // 3. 验证并解析token
      const { username, uid, f, i, exp } = await getToken(token, JWT_SECRET);
      console.log({ username, uid, f, i, exp });

      // 4. 验证用户基本信息
      if (!username || !uid || !f || exp === undefined) {
        return sendResponse(res, 201, "登录信息异常，请重新登录！");
      }

      // 5. 获取并验证设备信息
      const { _f } = req.cookies;

      console.log(`[Auth] 验证设备信息 - Cookie._f: ${_f}, Token.f: ${f}`);

      // 验证设备指纹
      if (_f !== f) {
        console.log(`[Auth] 设备指纹不匹配: ${_f} !== ${f}`);
        return sendResponse(res, 202, "登录设备异常，请重新登录！");
      }

      // 6. 验证token是否过期，如果过期，则刷新token
      if (JWT_REFRESH) {
        const currentTime = Math.floor(Date.now() / 1000);
        const remainingTime = exp - currentTime;

        if (remainingTime <= 0) {
          return sendResponse(res, 401, "认证失败：token已过期");
        } else if (remainingTime < REFRESH_THRESHOLD) {
          res.cookie("token", setToken({ username, uid }, JWT_SECRET, JWT_EXPIRES_IN), {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
          });
        }
      }

      // 7. 验证通过，将用户信息存入 req 中
      req.user = { username, uid };

      // 8. 计算当前请求的权限标识（只计算一次）
      const perms = req.originalUrl.split("?")[0].split("/").filter(Boolean).join(":");

      // 确保权限数组存在
      if (!req.user.perms) {
        const permsRes = await SysMenu.allPerms(uid);
        // allPerms 现在返回标准格式 { success, code, msg, data }
        if (permsRes.success && permsRes.data) {
          req.user.perms = permsRes.data
            .map((item) => item.perms)
            .filter((perm) => typeof perm === "string" && perm.trim().length > 0);
        } else {
          req.user.perms = [];
          console.log("[Auth] 获取用户权限失败:", permsRes);
        }
      }
      // 权限检查：精确匹配（最安全）
      const hasPermission = req.user.perms.some((item) => item === perms);
      console.log("error-->", perms);
      const permsWhiteList = ["base:menu:allRouter", "system:audit:logs:create"];
      if (!hasPermission && !permsWhiteList.includes(perms)) {
        console.log("error-->", perms);
        return res.json({ code: 402, msg: "暂无权限" });
      }

      // 9. 继续处理请求
      await next();
    } catch (error) {
      console.error("认证错误:", error);
      // 区分不同类型的JWT错误
      const errorMap = {
        TokenExpiredError: "token已过期，请重新登录",
        JsonWebTokenError: "无效的token",
        NotBeforeError: "token尚未生效",
      };
      const message = errorMap[error.name] || error.message || "认证失败";
      sendResponse(res, 401, message);
    }
  };

  authMiddleware[MIDDLEWARE_NAME] = "authMiddleware";

  return authMiddleware;
};
