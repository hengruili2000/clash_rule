/**
 * Mihomo JavaScript override for flowercloud.yaml
 *
 * Loads the RFC proxy provider and wires it into the existing proxy groups.
 */
function main(config) {
  config = config || {};

  const customProviderName = "RFC";
  const previousProviderName = "自建节点";
  const preferredProviderGroupName = "RFC优先";

  // 从本地 RFC 订阅地址加载节点。
  if (!config["proxy-providers"] || typeof config["proxy-providers"] !== "object") {
    config["proxy-providers"] = {};
  }
  config["proxy-providers"][customProviderName] = {
    type: "http",
    url: "http://127.0.0.1:38324/download/RFC",
    path: "./proxy-providers/rfc.yaml",
    interval: 3600,
    "health-check": {
      enable: true,
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      lazy: true
    }
  };
  delete config["proxy-providers"][previousProviderName];

  // 删除节点名包含“实验性”的单节点，并从各组及 provider 中排除。
  const experimentalPattern = "实验性";
  if (Array.isArray(config.proxies)) {
    config.proxies = config.proxies.filter(function (proxy) {
      return !proxy || typeof proxy.name !== "string" || proxy.name.indexOf(experimentalPattern) === -1;
    });
  }
  Object.keys(config["proxy-providers"]).forEach(function (providerName) {
    const provider = config["proxy-providers"][providerName];
    if (!provider || typeof provider !== "object") return;
    if (Array.isArray(provider.payload)) {
      provider.payload = provider.payload.filter(function (proxy) {
        return !proxy || typeof proxy.name !== "string" || proxy.name.indexOf(experimentalPattern) === -1;
      });
    }
    const oldExclude = provider["exclude-filter"];
    provider["exclude-filter"] = oldExclude
      ? oldExclude + "|" + experimentalPattern
      : experimentalPattern;
  });

  if (!Array.isArray(config["proxy-groups"])) config["proxy-groups"] = [];
  const groups = config["proxy-groups"];
  groups.forEach(function (group) {
    if (!group || !Array.isArray(group.proxies)) return;
    group.proxies = group.proxies.filter(function (name) {
      return typeof name !== "string" || name.indexOf(experimentalPattern) === -1;
    });
  });

  // 让 RFC provider 也能在现有总选择组 Proxies 中选用。
  const mainProxyGroup = groups.find(function (group) {
    return group && group.name === "Proxies";
  });
  if (mainProxyGroup) {
    if (!Array.isArray(mainProxyGroup.use)) mainProxyGroup.use = [];
    mainProxyGroup.use = mainProxyGroup.use.filter(function (name) {
      return name !== previousProviderName;
    });
    if (mainProxyGroup.use.indexOf(customProviderName) === -1) {
      mainProxyGroup.use.push(customProviderName);
    }
  }

  // US 组改为自动回退：按列表顺序选择第一个通过健康检查的节点。
  const usProxyGroup = groups.find(function (group) {
    return group && group.name === "US";
  });
  if (usProxyGroup) {
    usProxyGroup.type = "fallback";
    usProxyGroup.url = "https://www.gstatic.com/generate_204";
    usProxyGroup.interval = 300;
    if (!Array.isArray(usProxyGroup.use)) usProxyGroup.use = [];
    usProxyGroup.use = usProxyGroup.use.filter(function (name) {
      return name !== previousProviderName && name !== customProviderName;
    });
    if (!Array.isArray(usProxyGroup.proxies)) usProxyGroup.proxies = [];
    usProxyGroup.proxies = usProxyGroup.proxies.filter(function (name) {
      return name !== previousProviderName && name !== customProviderName && name !== preferredProviderGroupName;
    });
    usProxyGroup.proxies.unshift(preferredProviderGroupName);

    // Mihomo lists explicit `proxies` before provider `use` entries. Put RFC
    // behind a nested fallback group so its nodes are the first US candidate.
    const preferredProviderGroup = {
      name: preferredProviderGroupName,
      type: "fallback",
      use: [customProviderName],
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      hidden: true
    };
    const withoutOldPreferredGroup = groups.filter(function (group) {
      return !group || group.name !== preferredProviderGroupName;
    });
    const updatedUsIndex = withoutOldPreferredGroup.findIndex(function (group) {
      return group && group.name === "US";
    });
    if (updatedUsIndex >= 0) {
      withoutOldPreferredGroup.splice(updatedUsIndex, 0, preferredProviderGroup);
    } else {
      withoutOldPreferredGroup.push(preferredProviderGroup);
    }
    groups.splice(0, groups.length);
    Array.prototype.push.apply(groups, withoutOldPreferredGroup);
  }

  const hkProxyGroup = groups.find(function (group) {
    return group && group.name === "HK";
  });
  if (hkProxyGroup) {
    hkProxyGroup.type = "fallback";
    hkProxyGroup.url = "https://www.gstatic.com/generate_204";
    hkProxyGroup.interval = 300;
  }

  // F1TV 组可手动选择 US、RFC provider、原有 Proxies 组或直连。
  const f1Group = {
    name: "F1TV",
    type: "select",
    proxies: ["US", "Proxies", "DIRECT"],
    use: [customProviderName]
  };
  config["proxy-groups"] = groups.filter(function (group) {
    return !group || group.name !== f1Group.name;
  });
  const mainGroupIndex = config["proxy-groups"].findIndex(function (group) {
    return group && group.name === "Proxies";
  });
  config["proxy-groups"].splice(mainGroupIndex >= 0 ? mainGroupIndex + 1 : config["proxy-groups"].length, 0, f1Group);

  // ACL4SSR F1 规则集（Clash classical 文本格式）。
  if (!config["rule-providers"] || typeof config["rule-providers"] !== "object") {
    config["rule-providers"] = {};
  }
  config["rule-providers"].f1tv = {
    type: "http",
    behavior: "classical",
    format: "text",
    url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/F1.list",
    path: "./ruleset/f1tv.list",
    interval: 86400
  };

  // 放在规则列表前部，确保先于后续通用规则或 MATCH 命中。
  if (!Array.isArray(config.rules)) config.rules = [];
  const f1Rule = "RULE-SET,f1tv,F1TV";
  config.rules = config.rules.filter(function (rule) {
    return rule !== f1Rule;
  });
  config.rules.unshift(f1Rule);

  return config;
}
