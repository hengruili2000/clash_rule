// Clash Party JavaScript override for Seven1_fallback_Rule-Set.yaml.
// Update the constants below if the local subscription endpoint or label changes.
const SUBSCRIPTION_URL = "http://127.0.0.1:38324/download/AIO";
const PROVIDER_NAME = "AIO";
const ADDITIONAL_PREFIX = "[AIO] ";

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

  return config;
}
