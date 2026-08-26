const nav = document.querySelector('.nav');
const toggle = document.querySelector('.nav-toggle');
toggle?.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', open); });
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
document.querySelectorAll('a[href="#contact"]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); window.open('https://wa.me/919394389413', '_blank', 'noopener'); }));
const toast = document.querySelector('.toast');
function showToast(message) { toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2600); }
document.querySelectorAll('.play').forEach(button => button.addEventListener('click', () => { button.innerHTML = 'Demo preview active <b>❚❚</b>'; showToast(button.dataset.demo); }));
document.querySelector('#contact-form').addEventListener('submit', e => { e.preventDefault(); const form = new FormData(e.currentTarget); const message = encodeURIComponent(`Hello Yashvir Paul!\n\nName: ${form.get('name')}\nBusiness: ${form.get('business')}\nIndustry: ${form.get('industry')}\nService: ${form.ge
