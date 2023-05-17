const fs = require('fs').promises;

const slugify = text => text.trim().toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s/g, '-');

const demoTemplate = ({title, description, html, head, js, css}) => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <meta description="${description}">
    ${head}
    <style>${css}</style>
  </head>
  <body>
    ${html}
    <script type="module">${js}</script>
  </body>
</html>
`.trim();

const figureTemplate = ({hostedUrl, title, gistUrl}) => `
<figure>
  <iframe src="${hostedUrl}">
    <a href="${hostedUrl}">${title}</a>
  </iframe>
  <figcaption>
    <cite>${title}</cite> (<a href="${gistUrl}">code</a>)
  </figcaption>
</figure>
`.trim();

function extractTitle(text) {
  const h1 = text
    .split('\n')
    .filter(line => line.startsWith('# '))
    .unshift();

  return h1 ? h1.slice(2) : "Untitled";
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addShortcode('gist-demo', async (gistUrl) => {
    const gistId = gistUrl.slice(gistUrl.lastIndexOf('/') + 1);
    let title = "", html = "", css = "", js = "", head = '';
    const res = await fetch(`https://api.github.com/gists/${gistId}`);
    const gist = await res.json();
    const files = Object.values(gist.files);
    title = gist.description || files[0]?.filename;
    const description = gist.description;
    for (const file of files) {
      const name = file.filename;
      if (name.endsWith('.md')) {
        title = extractTitle(file.content);
        description = file.content;
      }
      if (name === 'head.inc') {
        head = file.content;
      }
      if (name.endsWith('.html') {
        html = file.content;
      }
      if (name.endsWith('.css') {
        css = file.content;
      }
      if (name.endsWith('.js') {
        js = file.content;
      }
    }
    const hostedUrl = `/demos/${slugify(title)}/`;
    await fs.writeFile(`./dist${hostedUrl}index.html`,
      demoTemplate({
        title, description,
        html, css, js, head,
      }), 'utf-8');
    return figureTemplate({
      hostedUrl,
      title,
    });
  });
};
