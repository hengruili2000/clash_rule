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

function main(config) {
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    throw new Error("覆写失败：Clash 配置不是有效对象");
  }

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
    ? config["proxy-groups"].filter((group) => group?.name !== F1_TV_GROUP)
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
  config["rule-providers"] = ruleProviders;

  // Put the specific F1 rule before broad rules such as geolocation-!cn.
  const rules = Array.isArray(config.rules)
    ? config.rules.filter(
        (rule) =>
          typeof rule !== "string" || !rule.startsWith("RULE-SET,F1_TV,"),
      )
    : [];
  rules.unshift(`RULE-SET,F1_TV,${F1_TV_GROUP}`);
  config.rules = rules;

  return config;
}
