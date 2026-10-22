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
