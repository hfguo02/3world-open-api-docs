import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  "docsSidebar": [
    {
      "type": "category",
      "label": "开发者指南",
      "link": {
        "type": "doc",
        "id": "introduction/index"
      },
      "items": [
        "introduction/authentication-signature",
        "introduction/common-responses"
      ]
    },
    {
      "type": "category",
      "label": "Card",
      "items": [
        "introduction/quickstart",
        {
          "type": "category",
          "label": "API 文档",
          "link": {
            "type": "doc",
            "id": "api/api-overview"
          },
          "items": [
            {
              "type": "category",
              "label": "卡片申请",
              "items": [
                {
                  "type": "doc",
                  "id": "api/list-application-products",
                  "className": "get api-method"
                },
                {
                  "type": "doc",
                  "id": "api/apply-card-v-2",
                  "className": "post api-method"
                },
                {
                  "type": "doc",
                  "id": "api/upload-application-file-v-2",
                  "className": "post api-method"
                },
                {
                  "type": "doc",
                  "id": "api/get-application-status",
                  "className": "get api-method"
                },
                {
                  "type": "doc",
                  "id": "api/list-applications",
                  "className": "get api-method"
                }
              ]
            },
            {
              "type": "category",
              "label": "卡片管理",
              "items": [
                {
                  "type": "doc",
                  "id": "api/list-cards",
                  "className": "get api-method"
                },
                {
                  "type": "doc",
                  "id": "api/get-card-detail",
                  "className": "get api-method"
                },
                {
                  "type": "doc",
                  "id": "api/get-card-sensitive-info",
                  "className": "get api-method"
                },
                {
                  "type": "doc",
                  "id": "api/activate-card",
                  "className": "post api-method"
                },
                {
                  "type": "doc",
                  "id": "api/freeze-card",
                  "className": "post api-method"
                },
                {
                  "type": "doc",
                  "id": "api/unfreeze-card",
                  "className": "post api-method"
                },
                {
                  "type": "doc",
                  "id": "api/block-card",
                  "className": "post api-method"
                },
                {
                  "type": "doc",
                  "id": "api/unblock-card",
                  "className": "post api-method"
                },
                {
                  "type": "doc",
                  "id": "api/set-card-pin",
                  "className": "post api-method"
                }
              ]
            },
            {
              "type": "category",
              "label": "账户与授信",
              "items": [
                {
                  "type": "doc",
                  "id": "api/get-partner-balance-v-2",
                  "className": "get api-method"
                },
                {
                  "type": "doc",
                  "id": "api/get-card-balance",
                  "className": "get api-method"
                },
                {
                  "type": "doc",
                  "id": "api/credit-card-v-2",
                  "className": "post api-method"
                },
                {
                  "type": "doc",
                  "id": "api/query-credit-v-2",
                  "className": "get api-method"
                },
                {
                  "type": "doc",
                  "id": "api/get-user-balance",
                  "className": "get api-method"
                }
              ]
            },
            {
              "type": "category",
              "label": "交易查询",
              "items": [
                {
                  "type": "doc",
                  "id": "api/list-transactions",
                  "className": "get api-method"
                },
                {
                  "type": "doc",
                  "id": "api/get-transaction-detail",
                  "className": "get api-method"
                }
              ]
            }
          ]
        },
        {
          "type": "category",
          "label": "Webhook 事件",
          "link": {
            "type": "doc",
            "id": "webhooks/index"
          },
          "items": [
            "webhooks/application-events",
            "webhooks/card-events",
            "webhooks/transaction-events",
            "webhooks/credit-events"
          ]
        },
        "reference/error-codes"
      ]
    },
    {
      "type": "doc",
      "id": "funds/index",
      "label": "Funds"
    }
  ]
};

export default sidebars;
