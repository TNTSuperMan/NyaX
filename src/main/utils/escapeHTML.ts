export function escapeHTML(str: string) { if (typeof str !== 'string') return ''; const div = document.createElement('div'); div.textContent = str; return div.innerHTML; }
