const ERROR_MESSAGE = "Dynamic value used as translation key";

import { Rule } from "eslint";

const meta = {
  docs: {
    description:
      "Enforce using static strings as keys for translation functions",
    category: "Best Practices",
    recommended: true,
  },
  fixable: undefined,
  schema: [
    {
      type: "object",
      properties: {
        functionNames: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
    },
  ],
};

type CalleeName = { name?: string };

const rule: Rule.RuleModule = {
  meta,
  create: (context) => {
    const options = context.options[0] || {};
    const functionNames = options.functionNames || [];
    return {
      CallExpression(node) {
        const calleeName =
          node.callee.type === "MemberExpression"
            ? (node.callee.property as CalleeName).name
            : (node.callee as CalleeName).name;

        if (calleeName !== "t" && !functionNames.includes(calleeName)) {
          return;
        }

        if (
          node.arguments[0] &&
          node.arguments[0].type === "TemplateLiteral" &&
          node.arguments[0].expressions.length === 0
        ) {
          return;
        }

        context.report({ node, message: ERROR_MESSAGE });
      },
    };
  },
};

export = rule;
