const fs=require('fs');
(async()=>{
 const words=['나','마','아','어','이','니','미','머','아이','이마','아니'];
 const titles=words.map(w=>'File:Ko-'+w+'.ogg').join('|');
 const response=await fetch('https://commons.wikimedia.org/w/api.php?'+new URLSearchParams({action:'query',format:'json',prop:'imageinfo',iiprop:'url|extmetadata',titles}));
 if(!response.ok)throw Error(response.status);
 const data=await response.json(),credits=[];
 fs.mkdirSync('assets/korean',{recursive:true});
 for(const page of Object.values(data.query.pages)){
  const info=page.imageinfo?.[0];if(!info){console.log('Unavailable:',page.title);continue;}
  const m=info.extmetadata;
  if(m.LicenseShortName?.value!=='CC BY-SA 4.0')throw Error('Review license for '+page.title);
  const word=page.title.slice(8,-4),url=new URL(info.url);url.search='';
  if(!fs.existsSync('assets/korean/'+word+'.ogg')){
   await new Promise(r=>setTimeout(r,10000));
   let audio=await fetch(url);
   if(audio.status===429){await new Promise(r=>setTimeout(r,Math.min(60000,Math.max(30000,Number(audio.headers.get('retry-after')||30)*1000))));audio=await fetch(url);}
   if(!audio.ok){console.log('Download unavailable:',word,audio.status);continue;}
   fs.writeFileSync('assets/korean/'+word+'.ogg',Buffer.from(await audio.arrayBuffer()));
  }
  credits.push({word,source:info.descriptionurl,audio:url.href,author:m.Artist.value.replace(/<[^>]+>/g,''),license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:'None; original Ogg recording.'});
  console.log('Saved',word);
  fs.writeFileSync('assets/korean/credits.json',JSON.stringify(credits,null,2));
 }
 fs.writeFileSync('assets/korean/credits.json',JSON.stringify(credits,null,2));
})();
