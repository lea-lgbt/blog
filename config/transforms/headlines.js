// by Vadim Makeev github.com/pepelsbey/pepelsbey.dev
module.exports = function(window) {
	const document = window.document;
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

  const slugify = text => text.trim().toLowerCase().replace(/[,\.:!?\-\;]/g, '').replace(/[\s,\.:!?\-\;]/g, '-');
	for (const heading of headings) {
		const text = heading.textContent.trim()
		const id = slugify(text).toLowerCase();
		heading.setAttribute('id', id);
	}
}
