// Shared by the server layout (boot script) and the client toggle.
export const MODE_KEY = 'site-mode';

/** Inline in <head> so the saved Simple/Dither choice applies before first paint (no flash). */
export const MODE_BOOT = `try{if(localStorage.getItem('${MODE_KEY}')==='simple')document.documentElement.dataset.mode='simple'}catch(e){}`;
