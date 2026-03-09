const {
  config,
  helper: { getIp },
  common: { success, fail },
} = Chan;

const ALLOWED_IP_APIS = ["ip-api.com", "ipinfo.io"];
const MAX_IP_LENGTH = 45; // IPv6 最大长度

class ClientController extends Chan.Controller {
  validateIP(ip) {
    if (!ip) return false;

    if (ip.length > MAX_IP_LENGTH) {
      return false;
    }

    const ipv4Regex =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }

  sanitizeIP(ip) {
    if (!ip) return null;

    const cleaned = ip.trim();
    if (this.validateIP(cleaned)) {
      return cleaned;
    }
    return null;
  }

  async ip(req, res, next) {
    const queryIP = req.query.ip;

    const clientIP = getIp(req);

    const targetIP = queryIP ? this.sanitizeIP(queryIP) : clientIP;

    if (!targetIP) {
      return res.status(400).json(this.fail("无效的 IP 地址"));
    }

    const isLocalAddress =
      targetIP === "::1" || targetIP === "127.0.0.1" || targetIP === "localhost";
    const isPrivateIP = /^10\.|^172\.(1[6-9]|2[0-9]|3[0-1])\.|^192\.168\./.test(targetIP);

    if (isPrivateIP) {
      return res.json(
        this.success({
          status: "success",
          country: "内网",
          countryCode: "CN",
          region: "内网",
          regionName: "内网",
          city: "内网",
          zip: "",
          lat: "0.0",
          lon: "0.0",
          timezone: "Asia/Shanghai",
          isp: "内网",
          org: "",
          as: "内网",
          query: targetIP,
        })
      );
    }

    if (isLocalAddress) {
      try {
        const response = await fetch("http://ip-api.com/json/?lang=zh-CN");
        if (!response.ok) {
          throw new Error("IP 查询服务不可用");
        }
        const data = await response.json();

        if (data.status === "fail") {
          console.log(`IP 查询失败: ${data.message}`);
          return res.json(
            this.success({
              status: "success",
              country: "未知",
              countryCode: "未知",
              region: "未知",
              regionName: "未知",
              city: "未知",
              district: "",
              zip: "",
              lat: "0.0",
              lon: "0.0",
              timezone: "未知",
              isp: "未知",
              org: "",
              as: "未知",
              query: targetIP,
            })
          );
        }

        res.json(
          this.success({
            status: "success",
            country: data.country || "未知",
            countryCode: data.countryCode || "未知",
            region: data.region || "未知",
            regionName: data.regionName || "未知",
            city: data.city || "未知",
            district: "",
            zip: "",
            lat: data.lat || "0.0",
            lon: data.lon || "0.0",
            timezone: data.timezone || "Asia/Shanghai",
            isp: data.isp || "未知",
            org: data.org || "",
            as: data.as || "未知",
            query: targetIP,
          })
        );
      } catch (error) {
        console.log("ClientController.ip--->", error);
        res.json(
          this.success({
            status: "success",
            country: "未知",
            countryCode: "未知",
            region: "未知",
            regionName: "未知",
            city: "未知",
            district: "",
            zip: "",
            lat: "0.0",
            lon: "0.0",
            timezone: "Asia/Shanghai",
            isp: "未知",
            org: "",
            as: "未知",
            query: targetIP,
          })
        );
      }
      return;
    }

    try {
      const response = await fetch(`http://ip-api.com/json/${targetIP}?lang=zh-CN`);

      if (!response.ok) {
        throw new Error("IP 查询服务不可用");
      }

      const data = await response.json();

      if (data.status === "fail") {
        console.log(`IP 查询失败: ${data.message}`);
        return res.json(
          this.success({
            status: "success",
            country: "未知",
            countryCode: "未知",
            region: "未知",
            regionName: "未知",
            city: "未知",
            district: "",
            zip: "",
            lat: "0.0",
            lon: "0.0",
            timezone: "未知",
            isp: "未知",
            org: "",
            as: "未知",
            query: targetIP,
          })
        );
      }

      res.json(this.success(data));
    } catch (error) {
      console.log("ClientController.ip--->", error);
      res.json(
        this.success({
          status: "success",
          country: "未知",
          countryCode: "未知",
          region: "未知",
          regionName: "未知",
          city: "未知",
          district: "",
          zip: "",
          lat: "0.0",
          lon: "0.0",
          timezone: "未知",
          isp: "未知",
          org: "",
          as: "未知",
          query: targetIP,
        })
      );
    }
  }
}

export default new ClientController();
