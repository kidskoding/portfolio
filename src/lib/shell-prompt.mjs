const LANGS = new Set(['sh', 'bash', 'shell', 'zsh', 'fish', 'powershell', 'pwsh', 'ansi']);
const TOKEN = /(\s+)|(#.*$)|(&&|\|\||[|;])|("(?:[^"\\]|\\.)*"|'[^']*')|(\S+)/g;

const text = (n) => (n.type === 'text' ? n.value : (n.children ?? []).map(text).join(''));
const span = (cls, value) => ({
  type: 'element',
  tagName: 'span',
  properties: { class: cls },
  children: [{ type: 'text', value }],
});

export function shellPrompt() {
  return {
    name: 'shell-prompt',
    code(node) {
      if (!LANGS.has(this.options.lang)) return;
      let continued = false;
      for (const line of node.children) {
        if (line.type !== 'element') continue;
        const raw = text(line);
        const prompt = raw.match(/^(\$|PS>) /)?.[0];
        if (!prompt && !continued) continue;
        const children = prompt ? [span('sh-prompt', prompt)] : [];
        let expectCmd = !continued;
        for (const [tok, space, comment, op, quote] of raw.slice(prompt?.length ?? 0).matchAll(TOKEN)) {
          if (space) children.push({ type: 'text', value: space });
          else if (comment) children.push(span('sh-comment', comment));
          else if (op) {
            children.push(span(op.length > 1 ? 'sh-op' : 'sh-end', op));
            expectCmd = true;
          } else if (quote) children.push(span('sh-quote', quote));
          else if (expectCmd) {
            children.push(span('sh-cmd', tok));
            expectCmd = false;
          } else children.push(span(tok.startsWith('-') ? 'sh-opt' : 'sh-param', tok));
        }
        line.children = children;
        continued = /[\\`]\s*$/.test(raw);
      }
    },
  };
}
