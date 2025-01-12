import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Navegar a la página
  await page.goto("https://www.themoviedb.org/tv/1399-game-of-thrones/watch");

  // Seleccionar los <a> dentro de los <li> y extraer los atributos 'href' y 'title'
  const enlaces = await page.$$eval('.providers li a', (links) => {
    return links.map(link => ({
      href: link.href,
      title: link.title
    }));
  });

  // Imprimir los resultados
  console.log(enlaces);

  await browser.close();
})();



