const { readdir, readFile, writeFile, mkdir } = require('fs/promises');
const { parseHTML } = require('linkedom');
const path = require('path');
const Prism = require('prismjs');

const CSS_PATH = './dist/assets/css/codeview.css';
const DEMOS_SRC_PATH = './src/demos';
const DEMOS_DIST_PATH = './dist/demos';

const escapeQuotes = str => str?.replace(/"/g, '&quot;');

const codeTemplate = (title, description, code, css, lang = 'markup') => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Code view: ${title}</title>
  ${description ? `<meta name="description" content="${escapeQuotes(description)}">` : ''}
  <style>${css}</style>
</head>
<body>
  <h1>Code view: ${title}</h1>
  <pre class="language-markup"><code class="language-markup">${Prism.highlight(code, Prism.languages[lang], lang)}</code></pre>
</body>
</html>`.trim();

module.exports = async function () {
  const css = await readFile(CSS_PATH, 'utf8');
  const files = await readdir(DEMOS_SRC_PATH);
  for (const file of files) {
    if (! file.endsWith('.html')) {
      continue;
    }
    const inputFile = path.join(DEMOS_SRC_PATH, file);
    const outputFileDir = path.join(DEMOS_DIST_PATH, file.replace(/\.html$/, ''), 'code');
    const outputFile = path.join(outputFileDir, 'index.html');
    const input = await readFile(inputFile, 'utf8');
    const { document } = parseHTML(input);
    const title = document.title;
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content');
    try {
      await mkdir(outputFileDir, {recursive: true});
    } catch (err) {
      // ignore error.
    }
    await writeFile(outputFile, codeTemplate(title, description, input, css), 'utf8');
    console.error(`creating codeview for demo: ${file} -> ${outputFile}`);
  }
};
