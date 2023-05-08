const vanillaH = require('vanillah');
const htm = require('htm');

// Code for adding id's to headlines is by Vadim Makeev github.com/pepelsbey/pepelsbey.dev
// heading wrapper idea is from https://11ty.rocks by Stephanie Eckles.
module.exports = function (window, _content, path) {
  const document = window.document;

  const h = vanillaH(document);
  const html = htm.bind(h);

  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const isPost = /posts[\/\\]/.test(path);

  const article = document.querySelector('.content > article');

  function wrapHeading(heading) {
    const id = heading.getAttribute('id');
    const tag = heading.nodeName.toLowerCase();
    const classes = heading.getAttribute('class');

    const headingWrapper = html`
      <div class="heading-wrapper ${tag} ${classes}">
        <a href="#${id}" aria-labelledBy="${id}">
          <span aria-hidden="true">#</span>
        </a>
      </div>
    `;

    heading.parentNode.insertBefore(headingWrapper, heading);
    headingWrapper.insertBefore(heading, headingWrapper.firstChild);
  }

  const slugify = text => text.trim().toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s/g, '-');
  for (const heading of headings) {
    const text = heading.textContent.trim();
    const id = slugify(text).toLowerCase();
    heading.setAttribute('id', id);
    if (isPost && article?.contains(heading) && heading.tagName !== 'H1') {
      wrapHeading(heading);
    }
  }

  const skipLink = document.querySelector('.skip-link');
  const h1 = document.querySelector('h1');
  if (! h1) {
    skipLink.remove();
  } else {
    skipLink.setAttribute('href', `#${h1.getAttribute('id')}`);
  }
}
