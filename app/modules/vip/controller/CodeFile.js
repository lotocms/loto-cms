const {
  helper: { getFileTree, readFileContent, saveFileContent, isPathSafe },
  common: { success, fail },
} = Chan;
import path from "path";
import fs from "fs";

class CodeFileController extends Chan.Controller {
  allowedExtensions = [
    ".html",
    ".js",
    ".css",
    ".json",
    ".md",
    ".txt",
    ".xml",
    ".svg",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".ico",
  ];

  validatePath(filePath) {
    if (!filePath) {
      throw new Error("文件路径不能为空");
    }

    const normalizedPath = path.normalize(filePath);
    if (normalizedPath.includes("..")) {
      throw new Error("路径包含非法字符");
    }

    if (
      !isPathSafe(normalizedPath, Chan.paths.appPath) &&
      !isPathSafe(normalizedPath, Chan.paths.rootPath)
    ) {
      throw new Error("访问路径不安全");
    }

    const ext = path.extname(normalizedPath).toLowerCase();
    if (!this.allowedExtensions.includes(ext)) {
      throw new Error(`不允许的文件类型: ${ext}`);
    }

    return normalizedPath;
  }

  validateContent(content, filePath) {
    if (typeof content !== "string") {
      throw new Error("文件内容必须是字符串");
    }

    const ext = path.extname(filePath).toLowerCase();

    if (ext === ".html") {
      const dangerousPatterns = [
        /<\s*script[^>]*>.*?<\s*\/\s*script\s*>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /eval\s*\(/gi,
        /new\s+Function\s*\(/gi,
        /\$\{\s*.*\s*\}/g,
      ];

      for (const pattern of dangerousPatterns) {
        if (pattern.test(content)) {
          throw new Error("文件内容包含危险的脚本代码");
        }
      }
    }

    if (ext === ".js") {
      const dangerousPatterns = [
        /require\s*\(\s*['"`]\s*\.\.\./gi,
        /import\s*\(\s*['"`]\s*\.\.\./gi,
        /exec\s*\(/gi,
        /spawn\s*\(/gi,
        /child_process/gi,
      ];

      for (const pattern of dangerousPatterns) {
        if (pattern.test(content)) {
          throw new Error("文件内容包含危险的代码");
        }
      }
    }
  }

  async tree(req, res, next) {
    try {
      let type = req.query.type;
      let fullPath = "";
      if (type == "html") {
        fullPath = path.join(Chan.paths.appPath, "/modules/web/view", req.app.locals.template);
      } else {
        fullPath = path.join(Chan.paths.rootPath, "/public/template", req.app.locals.template);
      }
      const tree = await getFileTree(fullPath);
      res.json(this.success({ data: tree }));
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async oss(req, res, next) {
    try {
      let fullPath = "";
      let paths = req.query.path;
      if (!isPathSafe(paths, Chan.paths.appPath) && !isPathSafe(paths, Chan.paths.rootPath)) {
        return res.status(403).json({ error: "访问路径不安全" });
      }
      if (paths) {
        fullPath = path.join(Chan.paths.rootPath, paths);
      } else {
        fullPath = path.join(Chan.paths.rootPath, "/public/uploads", req.app.locals.template);
      }
      const tree = await getFileTree(fullPath, false);
      res.json(this.success({ data: tree }));
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async content(req, res, next) {
    try {
      const filePath = req.query.path;
      const normalizedPath = this.validatePath(filePath);
      const content = await readFileContent(normalizedPath);
      res.json(this.success({ data: content }));
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async save(req, res, next) {
    try {
      const { path: filePath, content } = req.body;

      const normalizedPath = this.validatePath(filePath);
      this.validateContent(content, normalizedPath);

      const fullPath = path.isAbsolute(normalizedPath)
        ? normalizedPath
        : path.join(Chan.paths.rootPath, normalizedPath);

      await saveFileContent(fullPath, content);

      res.json(this.success({ data: true }));
    } catch (error) {
      console.error(error);
      if (
        error.message.includes("不安全") ||
        error.message.includes("非法") ||
        error.message.includes("不允许") ||
        error.message.includes("危险")
      ) {
        return res.status(403).json(this.fail(error.message));
      }
      next(error);
    }
  }
}

export default new CodeFileController();
