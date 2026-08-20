import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "passkey/3-world-passkey-接入-api（对接总表）",
    },
    {
      type: "category",
      label: "1. Passkey 登录【新增】",
      items: [
        {
          type: "doc",
          id: "passkey/【新增】-passkey-登录-第-1-步",
          label: "【新增】Passkey 登录 第1步",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "passkey/【新增】-passkey-登录-第-2-步",
          label: "【新增】Passkey 登录 第2步",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "passkey/【修改】-passkey-登录-第-3-步（含-2-fa-兜底）",
          label: "【修改】Passkey 登录 第3步（含 2FA 兜底）",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "2. Passkey 管理【新增/修改】",
      items: [
        {
          type: "doc",
          id: "passkey/【新增】绑定-第-1-步",
          label: "【新增】绑定 第1步",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "passkey/【新增】绑定-第-2-步",
          label: "【新增】绑定 第2步",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "passkey/【新增】-passkey-列表",
          label: "【新增】Passkey 列表",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "passkey/【新增】编辑-passkey-名称",
          label: "【新增】编辑 Passkey 名称",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "passkey/【新增】撤销-passkey",
          label: "【新增】撤销 Passkey",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "passkey/【修改】业务验证-第-1-步（本次加-risk-console-no）",
          label: "【修改】业务验证 第1步（本次加 riskConsoleNo）",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "passkey/【修改】业务验证-第-2-步（本次加-risk-console-no-写回）",
          label: "【修改】业务验证 第2步（本次加 riskConsoleNo 写回）",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "passkey/【新增】业务验证-第-2-步（票据模式）",
          label: "【新增】业务验证 第2步（票据模式）",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "3. 2FA 与账号登录【历史复用】",
      items: [
        {
          type: "doc",
          id: "passkey/【修改】获取用户信息（本次加-passkey-status）",
          label: "【修改】获取用户信息（本次加 passkeyStatus）",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "passkey/【历史复用】传统-2-fa-验证",
          label: "【历史复用】传统 2FA 验证",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "passkey/【历史复用】账号密码登录",
          label: "【历史复用】账号密码登录",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "4. 业务接口·触发风控【历史复用】",
      items: [
        {
          type: "doc",
          id: "passkey/【历史复用】转账-出金（send，触发风控）",
          label: "【历史复用】转账/出金（SEND，触发风控）",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "passkey/【历史复用】kyt-筛查扣费（kyt，触发风控）",
          label: "【历史复用】KYT 筛查扣费（KYT，触发风控）",
          className: "api-method post",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
