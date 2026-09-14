const { chromium } = require('@playwright/test');
const fs=require('fs'),path=require('path'),http=require('http');
(async()=>{
 const root=path.resolve('public');
 const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404).end();return;}res.setHeader('Content-Type',file.endsWith('.html')?'text/html':file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/plain');fs.createReadStream(file).pipe(res)});
 await new Promise(resolve=>server.listen(8083,'127.0.0.1',resolve));
 const browser=await chromium.launch({channel:'chrome'});
 const page=await browser.newPage({viewport:{width:720,height:758}});
 page.on('pageerror',e=>console.error(e.message));
 await page.goto('http://127.0.0.1:8083/molecular-room.html?pdb=1Y1W');
 await page.waitForFunction(()=>window.quasarMoleculeReady==='1Y1W',{},{timeout:60000});
 await page.waitForTimeout(4000);
 console.log(await page.evaluate(()=>({canvases:[...document.querySelectorAll('canvas')].map(c=>({w:c.width,h:c.height})),structures:window.quasarViewer.plugin.managers.structure.hierarchy.current.structures.length})));
 await page.locator('#viewer').screenshot({path:'assets/rna-polymerase-real.png'});
 await browser.close();
 server.close();
})();
