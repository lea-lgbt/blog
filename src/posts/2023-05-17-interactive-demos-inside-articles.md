---
title: Interactive demos inside articles
description: This article touches how I embed interactive code demos into my blog articles.
date: 2023-06-01
tags:
  - eleventy
  - javascript
  - meta
---
I'm trying to embed demo snippets of html/css/js into my articles, so I added a `{% raw %}{% demo "demo-name" %}{% endraw %}` shortcode to my Eleventy blog. Those demos are just plain html files located in `src/demos`, with everything inline, with the html skeleton provided by Eleventy. 

As `<style>` tags would then be put into the body, I added a html transform rule which moves those `<style>` tags from `<body>` to `<head>`. Although browsers seem to tolerate style tags inside `<body>`, it would not be valid HTML.

Those html transforms are processed in my Eleventy project at build time using [linkedom](https://github.com/WebReflection/linkedom), which is a lightweight and fast DOM implementation. The [code](https://github.com/lea-lgbt/blog/blob/main/config/plugins/html-transform.js) for it is put into a separate eleventy config file which can be loaded into the main configuration file via `eleventyConfig.addPlugin`.  

Using LinkeDOM is pretty straightforward, you have a `parseHTML` function where you pass-in a string of HTML code and you will get a DOM API back to work with containing `{ document }` (and more).

So, moving a style tag from head to body on the server-side looks similar to how you would do it in browser-side JavaScript:

```js
// Moves style tags from body up to the head.
module.exports = function ({document}) {
  document.body.querySelectorAll('style').forEach(style => {
    style.remove();
    document.head.appendChild(style);
  });
};
```

For embedding the demos into my articles, I used a tab widget inside a `<figure>` element, but that widget shouldn't be put into the rss feed, so I only put links to the demos and added a transform rule which adds the tab widget into the blog articles.

The tab widget follows the pattern of the [Example of Tabs with Manual Activation](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-manual/) of the ARIA Authoring Practices Guide (APG).

Below is an example of such a demo embed.

{% demo "hello-world" %}

In a next iteration, I could maybe separate the code into HTML/CSS/JS tabs, similar to what you know from embeds like Codepen or jsfiddle.
