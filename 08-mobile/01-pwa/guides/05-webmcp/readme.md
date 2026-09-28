# WebMCP

## Introduction

WebMCP provides JavaScript and annotates HTML form elements so that agents know exactly how to interact with page features, to support a user's experience. This can significantly improve the performance and reliability of agent actuation.

## Registering

Register -> Discover -> Invoke -> Execute -> Respond

## 1. Enabling the Environment

![Enabling MCP](.resources/01-enabling.png)

## 2. Discovering Website Tools 

When your agent WebMCP page, it does not read the DOM. Instead, it queries the client-side `nvigator.modelContext` API.

If you are writing a custom browser extension or a local automation runner that acts as the agent, your code queries the page to see what tools are available:

```js
// The agent queries the current web page for registered WebMCP tools
const availableTools = await navigator.modelContext.getTools();

console.log(availableTools);
/* 
Output will look like a standard JSON Schema:
[{
  name: "search_products",
  description: "Search the e-commerce inventory for items matching a string",
  inputSchema: {
    type: "object",
    properties: { query: { type: "string" } },
    required: ["query"]
  }
}]
*/

```

## 3. Processing and Selecting the Tool

Your agent passes this list of tools (specifically the name, description, and inputSchema) directly into an LLM's system prompt or tool-calling array.

- The user says: *"Find me shows under $50"*
- The LLM analyzes the schema provided by the website and decides to call `search_products` with `{"query": "shoes"}`.

## 4. Invoking the Tool

Once your LLM decides which tool to use, your agent bypasses clicking or typing. It invokes the website's native function programatically using the structured JSON payload:

```js
// The agent calls the discovered tool directly inside the active session
try {
  const result = await navigator.modelContext.invokeTool('search_products', { 
    query: 'shoes' 
  });
  
  // Feed this clean result back into your LLM to formulate the final response
  console.log("Website returned data:", result); 
} catch (error) {
  console.error("Tool execution failed:", error);
}

```

Because this runs inside the user's active browser tab, the agent automatically inherits the user’s cookies, login sessions, and state without needing custom authentication scripts


## Resources

- [WebMCP Docs Google](https://developer.chrome.com/docs/ai/webmcp)
- [Demos](https://github.com/GoogleChromeLabs/webmcp-tools/tree/main/demos)