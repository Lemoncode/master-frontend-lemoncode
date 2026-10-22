# Registering Tools

Update `app.js`

```js
import "./node_modules/@mcp-b/webmcp-polyfill/dist/index.js";

const mcp = navigator.modelContext || document.modelContext;
console.log("WebMCP ready:", mcp);

if (mcp) {
  mcp.registerTool({
    // 1. Unique name for the tool
    name: "search_products",

    // 2. Clear description explaining to the AI when and why to use it
    description: "Search products in the store catalog by keyword or category.",

    // 3. JSON Schema defining expected input arguments
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search keyword",
        },
        maxResults: {
          type: "number",
          description: "Maximum number of items to return",
        },
      },
      required: ["query"],
    },

    // 4. Execution callback function run when an agent invokes the tool
    execute: async (input) => {
      const { query, maxResults = 5 } = input;

      // Call your frontend logic or application API
      const results = await new Promise((res) => {
        setTimeout(() => {
          res([
            {
              code: "1",
              name: "shoe",
            },
            {
              code: "2",
              name: "pencil",
            },
          ]);
        }, 500);
      });

      // Return the result format back to the agent
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(results),
          },
        ],
      };
    },

    // 5. (Optional) Read-only hint annotation
    annotations: {
      readOnlyHint: true, // Indicates this tool does not modify application state
    },
  });
}
```

Refactor, update `index.html`

```diff
# ....
  <body>
    <h1>Hell WebMCP</h1>
+   <div>
+     <button id="unregister">Unregister</button>
+   </div>
    <script type="module" src="app.js"></script>
  </body>
# ....
```

Update `app.js`

```js
import "./node_modules/@mcp-b/webmcp-polyfill/dist/index.js";

const getContext = () => {
  const mcp = navigator.modelContext || document.modelContext;
  console.log("WebMCP ready:", mcp);
  return mcp;
};

const registerTool = (mcp, signal) => {
  if (mcp) {
    mcp.registerTool(
      {
        name: "search_products",
        description:
          "Search products in the store catalog by keyword or category.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search keyword",
            },
            maxResults: {
              type: "number",
              description: "Maximum number of items to return",
            },
          },
          required: ["query"],
        },
        execute: async (input) => {
          const { query, maxResults = 5 } = input;

          // Call your frontend logic or application API
          const results = await new Promise((res) => {
            setTimeout(() => {
              res([
                {
                  code: "1",
                  name: "shoe",
                },
                {
                  code: "2",
                  name: "pencil",
                },
              ]);
            }, 500);
          });

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(results),
              },
            ],
          };
        },
        annotations: {
          readOnlyHint: true, // Indicates this tool does not modify application state
        },
      },
      {
        signal,
      },
    );
  }
};

const main = () => {
  const controller = new AbortController();

  const mcp = getContext();
  registerTool(mcp, controller.signal);

  const unregisterButton = document.getElementById('unregister');
  unregisterButton.addEventListener('click', () => {
    controller.abort();
  });
};

main();

```