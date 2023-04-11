document.body.classList.add('js-enabled');

const button = document.querySelectorAll('.theme-switcher');
button.addEventListener('click', () => {
    const ariaExpanded = button.getAttribute('aria-expanded') === true;
    button.setAttribute('aria-expanded', !ariaExpanded);
});
