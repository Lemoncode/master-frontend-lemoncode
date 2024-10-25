import { marked } from 'marked';

export const useMarkdown = () => {
  const parse = (markdown: string) => {
    const html = marked.parse(markdown);

    return { html };
  };

  return {
    parse,
  };
};
