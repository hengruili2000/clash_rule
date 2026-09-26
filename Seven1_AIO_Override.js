// Clash Party JavaScript override for Seven1_fallback_Rule-Set.yaml.
// Update the constants below if the local subscription endpoint or label changes.
const SUBSCRIPTION_URL = "http://127.0.0.1:38324/download/AIO";
const PROVIDER_NAME = "AIO";
const ADDITIONAL_PREFIX = "[AIO] ";
const F1_TV_GROUP = "F1 TV";
const F1_TV_RULESET_URL =
  "https://raw.githubusercontent.com/vxiaov/vClash/5294957bd48ff61e71938cfd1f68cfe2e44b8acb/clash/clash/ruleset/F1_TV";
const F1_TV_ICON_URL =
  "https://raw.githubusercontent.com/hengruili2000/clash_rule/main/icon/Formula1.png";
const FINANCE_GROUP = "金融服务";
const FINANCE_RULESET_URL =
  "https://raw.githubusercontent.com/hengruili2000/Custom_OpenClash_Rules/refs/heads/main/rule/Custom_US_Proxy.yaml";
const FINANCE_ICON_URL =
  "https://raw.githubusercontent.com/hengruili2000/clash_rule/main/icon/Finance.png";
const TINDER_RULESET_URL =
  "https://raw.githubusercontent.com/madi10/MANTANKODE/f75b7d020f819aa54a8f5df57562364b1ef513b7/ClashForAndroid/Tinder.yaml";

function main(config) {
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    throw new Error("覆写失败：Clash 配置不是有效对象");
  }

  // Apply client, listener, sniffer, and DNS settings with YAML-style deep merge.
  Object.assign(config, {
    port: 7890,
    "socks-port": 7891,
    "redir-port": 7892,
    "mixed-port": 7893,
    "allow-lan": false,
    mode: "rule",
    "log-level": "info",
    "external-controller": "127.0.0.1:9090",
    "unified-delay": true,
    ipv6: false,
  });

  const currentSniffer =
    config.sniffer &&
    typeof config.sniffer === "object" &&
    !Array.isArray(config.sniffer)
      ? config.sniffer
      : {};
  const currentSniff =
    currentSniffer.sniff &&
    typeof currentSniffer.sniff === "object" &&
    !Array.isArray(currentSniffer.sniff)
      ? currentSniffer.sniff
      : {};
  config.sniffer = {
    ...currentSniffer,
    sniff: {
      ...currentSniff,
      TLS: { ports: [443], "override-destination": true },
      HTTP: { ports: [443], "override-destination": true },
    },
    enable: true,
    "parse-pure-ip": false,
    "force-dns-mapping": true,
    "override-destination": true,
  };

  const currentAndroid =
    config["clash-for-android"] &&
    typeof config["clash-for-android"] === "object" &&
    !Array.isArray(config["clash-for-android"])
      ? config["clash-for-android"]
      : {};
  config["clash-for-android"] = {
    ...currentAndroid,
    "append-system-dns": false,
  };

  const currentProfile =
    config.profile &&
    typeof config.profile === "object" &&
    !Array.isArray(config.profile)
      ? config.profile
      : {};
  config.profile = { ...currentProfile, tracing: true };

  const currentExperimental =
    config.experimental &&
    typeof config.experimental === "object" &&
    !Array.isArray(config.experimental)
      ? config.experimental
      : {};
  config.experimental = {
    ...currentExperimental,
    "sniff-tls-sni": true,
  };

  const currentDns =
    config.dns && typeof config.dns === "object" && !Array.isArray(config.dns)
      ? config.dns
      : {};
  config.dns = {
    ...currentDns,
    enable: true,
    ipv6: false,
    listen: "127.0.0.1:7874",
    "use-hosts": true,
    "use-system-hosts": false,
    nameserver: [
      "119.29.29.29",
      "223.5.5.5",
      "tls://119.29.29.29",
      "tls://223.5.5.5",
      "https://dns.pub/dns-query",
      "https://dns.alidns.com/dns-query",
    ],
    "proxy-server-nameserver": ["udp://127.0.0.1:7874"],
    "fake-ip-range": "198.18.0.0/15",
    "fake-ip-filter": [
      "*.lan",
      "*.localdomain",
      "*.example",
      "*.invalid",
      "*.localhost",
      "*.test",
      "*.local",
      "*.home.arpa",
      "time.*.com",
      "time.*.gov",
      "time.*.edu.cn",
      "time.*.apple.com",
      "time1.*.com",
      "time2.*.com",
      "time3.*.com",
      "time4.*.com",
      "time5.*.com",
      "time6.*.com",
      "time7.*.com",
      "ntp.*.com",
      "ntp1.*.com",
      "ntp2.*.com",
      "ntp3.*.com",
      "ntp4.*.com",
      "ntp5.*.com",
      "ntp6.*.com",
      "ntp7.*.com",
      "*.time.edu.cn",
      "*.ntp.org.cn",
      "+.pool.ntp.org",
      "time1.cloud.tencent.com",
      "stun.*.*",
      "stun.*.*.*",
      "swscan.apple.com",
      "mesu.apple.com",
      "music.163.com",
      "*.music.163.com",
      "*.126.net",
      "musicapi.taihe.com",
      "music.taihe.com",
      "songsearch.kugou.com",
      "trackercdn.kugou.com",
      "*.kuwo.cn",
      "api-jooxtt.sanook.com",
      "api.joox.com",
      "y.qq.com",
      "*.y.qq.com",
      "streamoc.music.tc.qq.com",
      "mobileoc.music.tc.qq.com",
      "isure.stream.qqmusic.qq.com",
      "dl.stream.qqmusic.qq.com",
      "aqqmusic.tc.qq.com",
      "amobile.music.tc.qq.com",
      "localhost.ptlogin2.qq.com",
      "*.msftconnecttest.com",
      "*.msftncsi.com",
      "*.xiami.com",
      "*.music.migu.cn",
      "music.migu.cn",
      "+.wotgame.cn",
      "+.wggames.cn",
      "+.wowsgame.cn",
      "+.wargaming.net",
      "*.*.*.srv.nintendo.net",
      "*.*.stun.playstation.net",
      "xbox.*.*.microsoft.com",
      "*.*.xboxlive.com",
      "*.ipv6.microsoft.com",
      "teredo.*.*.*",
      "teredo.*.*",
      "speedtest.cros.wr.pvp.net",
      "+.jjvip8.com",
      "www.douyu.com",
      "activityapi.huya.com",
      "activityapi.huya.com.w.cdngslb.com",
      "www.bilibili.com",
      "api.bilibili.com",
      "a.w.bilicdn1.com",
      "+.apt-agent.com",
    ],
    "enhanced-mode": "fake-ip",
  };

  const providers =
    config["proxy-providers"] &&
    typeof config["proxy-providers"] === "object" &&
    !Array.isArray(config["proxy-providers"])
      ? config["proxy-providers"]
      : {};

  // Prefer the existing AIO entry; otherwise inherit the upstream placeholder.
  // This keeps health-check/filter changes made by the base configuration.
  const placeholderEntry = Object.entries(providers).find(
    ([name, provider]) =>
      name === "机场名" ||
      (provider && typeof provider === "object" && provider.url === "订阅链接"),
  );
  const template = providers[PROVIDER_NAME] || placeholderEntry?.[1] || {};

  const aioProvider = {
    type: "http",
    interval: 86400,
    proxy: "DIRECT",
    "health-check": {
      enable: true,
      url: "https://www.g.cn/generate_204",
      interval: 300,
    },
    ...template,
    url: SUBSCRIPTION_URL,
    override: {
      ...(template.override || {}),
      "additional-prefix": ADDITIONAL_PREFIX,
    },
  };

  // Preserve any explicitly added providers, but remove the upstream placeholder.
  const nextProviders = { ...providers };
  if (placeholderEntry && placeholderEntry[0] !== PROVIDER_NAME) {
    delete nextProviders[placeholderEntry[0]];
  }
  nextProviders[PROVIDER_NAME] = aioProvider;
  config["proxy-providers"] = nextProviders;

  // F1 TV uses only the three explicitly requested US strategies.
  const proxyGroups = Array.isArray(config["proxy-groups"])
    ? config["proxy-groups"].filter(
        (group) =>
          group?.name !== F1_TV_GROUP && group?.name !== FINANCE_GROUP,
      )
    : [];
  const f1TvGroup = {
    name: F1_TV_GROUP,
    type: "select",
    proxies: ["美国-手动", "美国-故转", "美国-自动"],
    icon: F1_TV_ICON_URL,
  };
  const disneyIndex = proxyGroups.findIndex((group) => group?.name === "Disney");
  proxyGroups.splice(
    disneyIndex >= 0 ? disneyIndex + 1 : proxyGroups.length,
    0,
    f1TvGroup,
  );

  // Mirror Disney's complete strategy configuration and place Finance after PayPal.
  const disneyGroup = proxyGroups.find((group) => group?.name === "Disney");
  const financeGroup = {
    ...(disneyGroup || { type: "select", proxies: ["一键代理"] }),
    name: FINANCE_GROUP,
    icon: FINANCE_ICON_URL,
  };
  const paypalIndex = proxyGroups.findIndex((group) => group?.name === "PayPal");
  proxyGroups.splice(
    paypalIndex >= 0 ? paypalIndex + 1 : proxyGroups.length,
    0,
    financeGroup,
  );
  config["proxy-groups"] = proxyGroups;

  // The supplied ruleset is a YAML payload containing classical rules.
  const ruleProviders =
    config["rule-providers"] &&
    typeof config["rule-providers"] === "object" &&
    !Array.isArray(config["rule-providers"])
      ? config["rule-providers"]
      : {};
  ruleProviders.F1_TV = {
    type: "http",
    behavior: "classical",
    format: "yaml",
    interval: 86400,
    url: F1_TV_RULESET_URL,
  };
  ruleProviders.Custom_US_Proxy = {
    type: "http",
    behavior: "classical",
    format: "yaml",
    interval: 86400,
    url: FINANCE_RULESET_URL,
  };
  ruleProviders.Tinder = {
    type: "http",
    behavior: "classical",
    format: "yaml",
    interval: 86400,
    url: TINDER_RULESET_URL,
  };
  config["rule-providers"] = ruleProviders;

  // Put specific service rules before broad rules such as geolocation-!cn.
  const rules = Array.isArray(config.rules)
    ? config.rules.filter(
        (rule) =>
          typeof rule !== "string" ||
          (!rule.startsWith("RULE-SET,F1_TV,") &&
            !rule.startsWith("RULE-SET,Custom_US_Proxy,") &&
            !rule.startsWith("RULE-SET,Tinder,") &&
            !rule.toLowerCase().startsWith("geosite,ibkr,")),
      )
    : [];
  rules.unshift(
    `RULE-SET,F1_TV,${F1_TV_GROUP}`,
    `RULE-SET,Custom_US_Proxy,${FINANCE_GROUP}`,
    `GEOSITE,ibkr,${FINANCE_GROUP}`,
    "RULE-SET,Tinder,Twitter(X)",
  );
  config.rules = rules;

  return config;
}
