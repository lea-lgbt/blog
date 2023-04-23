// by Vadim Makeev github.com/pepelsbey/pepelsbey.dev
module.exports = function (window, _content, path) {
  const document = window.document;
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

  const slugify = text => text.trim().toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s/g, '-');
  for (const heading of headings) {
    const text = heading.textContent.trim();
    const id = slugify(text).toLowerCase();
    heading.setAttribute('id', id);
  }

  const skipLink = document.querySelector('.skip-link');
  const h1 = document.querySelector('h1');
  if (! h1) {
    throw new Error('no H1 detected in ' + path);
  }
  skipLink.setAttribute('href', `#${h1.getAttribute('id')}`);
}
