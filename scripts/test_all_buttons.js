const { chromium } = require('playwright');

async function testAll() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[Console Error] ${msg.text()}`);
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push(`[Page Error] ${err.toString()}`);
  });

  const urls = [
    'http://localhost:8080/index.html',
    'http://localhost:8080/nepal-biometric-present.html',
    'http://localhost:8080/mapping-laws.html',
    'http://localhost:8080/beyond-access.html'
  ];

  for (const url of urls) {
    console.log(`\n========================================`);
    console.log(`Testing URL: ${url}`);
    console.log(`========================================`);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    // Find all buttons
    const buttons = await page.$$('button');
    console.log(`Found ${buttons.length} buttons on page.`);

    for (let i = 0; i < buttons.length; i++) {
      const btn = buttons[i];
      const isVisible = await btn.isVisible();
      const text = (await btn.innerText()).trim() || (await btn.getAttribute('aria-label')) || (await btn.getAttribute('id')) || `Button #${i}`;
      
      if (isVisible) {
        try {
          await btn.click({ timeout: 1000 });
          // wait briefly
          await page.waitForTimeout(100);
          console.log(`  ✔ Clicked: "${text}"`);
        } catch (e) {
          console.log(`  ✖ Failed to click: "${text}" -> ${e.message}`);
        }
      } else {
        console.log(`  ⚪ Hidden button: "${text}"`);
      }
    }

    // Find all links with href^="#"
    const anchorLinks = await page.$$('a[href^="#"]');
    console.log(`Found ${anchorLinks.length} anchor hash links.`);
    for (let j = 0; j < anchorLinks.length; j++) {
      const link = anchorLinks[j];
      const href = await link.getAttribute('href');
      const targetId = href.replace('#', '');
      const targetEl = await page.$(`#${targetId}`);
      if (!targetEl && targetId !== '') {
        console.log(`  ⚠ Anchor ${href} has NO matching element on page!`);
      }
    }
  }

  await browser.close();

  if (consoleErrors.length > 0) {
    console.log(`\n❌ Console Errors Detected:`);
    consoleErrors.forEach(e => console.log(e));
  } else {
    console.log(`\n🎉 Zero console/page errors detected during all button clicks!`);
  }
}

testAll().catch(err => {
  console.error('Test runner failed:', err);
  process.exit(1);
});
