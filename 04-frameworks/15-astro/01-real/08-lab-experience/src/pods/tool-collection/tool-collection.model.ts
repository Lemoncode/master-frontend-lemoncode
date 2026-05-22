export interface Tool {
  name: string;
  logo: string;
}

export interface ToolSectionContent {
  heading: string;
  description: string;
  tools: Tool[];
}
