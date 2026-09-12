// Original multitrack scores: 32 bars, four arranged sections; no samples or quoted tunes.
const fs=require('node:fs');
const SR=22050, BPM=80, beat=60/BPM, bars=32, seconds=bars*4*beat;
const melody={
 dojo:[[74,0,1],[76,1.5,.5],[81,2,1.5],[79,5,1],[76,6,1],[74,8,1.5],[69,10,1],[72,12,1],[74,13.5,2]],
 egypt:[[69,0,1],[70,1,.5],[73,2,1],[76,4,1.5],[73,6,.5],[70,7,1],[69,9,2],[68,12,1],[69,14,1.5]],
 neon:[[76,0,1.5],[79,2,.75],[83,4,1],[81,6,1.5],[79,8,1],[76,10,1.5],[74,12,1],[71,14,1.5]]
};
const harmony={dojo:[[50,57,62,66],[48,55,60,64],[45,52,57,60],[50,57,62,66]],egypt:[[45,52,57,61],[46,53,58,62],[43,50,55,59],[45,52,57,61]],neon:[[45,52,59,64],[41,48,55,60],[48,55,62,67],[43,50,57,62]]};
const manifests=[];
for(const world of Object.keys(melody)){
 const L=new Float32Array(SR*seconds),R=new Float32Array(SR*seconds);let seed=world.length*371;
 const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296*2-1;};
 const events=[];
 function note(at,pitch,duration,velocity,instrument,pan=0){events.push({at,pitch,duration,velocity,instrument,pan});}
 for(let bar=0;bar<bars;bar++){
  const chord=harmony[world][Math.floor(bar/2)%4],section=Math.floor(bar/8),base=bar*4;
  // Breathing four-part harmony, with a quieter bridge.
  chord.forEach((n,k)=>note(base,n,4,section===2?.027:.039,'pad',(k-1.5)*.35));
  if(world==='neon')note(base,chord[0]-12,3.6,.12,'bass',0);
  // Arpeggiated accompaniment has rests and varying dynamics, not an endless scale.
  const steps=world==='dojo'?[0,1.5,2.5]:world==='egypt'?[0,.75,2,3.5]:[0,1,2.5,3.5];
  steps.forEach((t,k)=>note(base+t,chord[(bar+k)%4]+12,.95,world==='neon'?.06:.09,'pluck',Math.sin(bar+k)*.55));
  if(section!==0 || bar>=4){
   if(world==='egypt'){note(base,42,.3,.13,'drum',-.15);note(base+2.5,65,.13,.06,'tap',.3);}
   if(world==='neon'){note(base,36,.35,.15,'drum');note(base+2,72,.16,.075,'snare',.1);[.5,1.5,2.5,3.5].forEach(t=>note(base+t,90,.06,.025,'tap',.45));}
   if(world==='dojo'&&bar%4===3)note(base+3,70,.12,.03,'tap',.55);
  }
 }
 for(let phrase=0;phrase<8;phrase++){
   const section=Math.floor(phrase/2),variation=phrase%2;
   melody[world].forEach(([n,t,d],j)=>{
     if(section===2 && j%2) return;
     const pitch=n+(section===3&&j>5?12:0)+(variation&&j===melody[world].length-1?-2:0);
     note(phrase*16+t+(variation?.12:0),pitch,d,.105,world==='neon'?'keys':'flute',-.12);
     if(section===1||section===3)note(phrase*16+t+.2,pitch-12,d,.035,'pluck',.5);
   });
 }
 for(const e of events){
  const start=Math.floor(e.at*beat*SR),dur=e.duration*beat,tail=e.instrument==='pluck'?1.2:.4;
  const len=Math.min(Math.ceil((dur+tail)*SR),L.length-start),hz=440*2**((e.pitch-69)/12);
  const delay=Math.max(2,Math.round(SR/hz)),string=new Float32Array(delay);
  for(let j=0;j<delay;j++)string[j]=rand();let cursor=0,noiseLP=0;
  for(let j=0;j<len;j++){
   const t=j/SR,attack=Math.min(1,t/(e.instrument==='flute'?.12:e.instrument==='pad'?.65:.008));
   const release=Math.min(1,Math.max(0,(dur+tail-t)/(e.instrument==='pad'?.6:.3)));
   const phase=2*Math.PI*hz*t;let v=0;
   noiseLP=.8*noiseLP+.2*rand();
   if(e.instrument==='pluck'){
    v=string[cursor];string[cursor]=(string[cursor]+string[(cursor+1)%delay])*.497;cursor=(cursor+1)%delay;
    v=v*.9+Math.sin(phase)*Math.exp(-t*3)*.16;
   }else if(e.instrument==='flute'){
    const vibrato=Math.sin(2*Math.PI*4.7*t)*Math.min(.026,t*.035);
    v=(Math.sin(phase+vibrato)+.23*Math.sin(phase*2+vibrato)+.07*Math.sin(phase*3))*.67+noiseLP*.23;
   }else if(e.instrument==='pad'){
    v=(Math.sin(phase)+Math.sin(phase*1.003)+.35*Math.sin(phase*2.001)+.2*Math.sin(phase*3))/2.5;
   }else if(e.instrument==='keys'){
    v=(Math.sin(phase+Math.sin(phase*2)*1.8*Math.exp(-t*3))+.3*Math.sin(phase*.999))*Math.exp(-t*1.3);
   }else if(e.instrument==='bass') v=(Math.sin(phase)+.17*Math.sin(phase*2))*Math.exp(-t*.7);
   else if(e.instrument==='drum')v=Math.sin(2*Math.PI*(hz*t+24*.035*(1-Math.exp(-t/.035))))*Math.exp(-t*13)+noiseLP*Math.exp(-t*70)*.15;
   else if(e.instrument==='snare')v=(rand()*.65+Math.sin(phase)*.2)*Math.exp(-t*24);
   else v=(rand()-noiseLP)*Math.exp(-t*50);
   const sample=v*e.velocity*attack*release;
   L[start+j]+=sample*Math.sqrt((1-e.pan)/2);R[start+j]+=sample*Math.sqrt((1+e.pan)/2);
  }
 }
 // Quiet moving air plus a diffuse stereo room, generated rather than sampled.
 let air=0;for(let i=0;i<L.length;i++){air=air*.995+rand()*.005;L[i]+=air*.014;R[i]+=air*.011;}
 for(const [time,gain] of [[.137,.18],[.293,.12],[.467,.09]]){const delay=Math.floor(time*SR);for(let i=delay;i<L.length;i++){const l=L[i-delay],r=R[i-delay];L[i]+=r*gain;R[i]+=l*gain;}}
 let peak=0;for(let i=0;i<L.length;i++)peak=Math.max(peak,Math.abs(L[i]),Math.abs(R[i]));
 const gain=.68/Math.max(.01,peak),data=Buffer.alloc(L.length*4+44);
 data.write('RIFF');data.writeUInt32LE(data.length-8,4);data.write('WAVEfmt ',8);data.writeUInt32LE(16,16);data.writeUInt16LE(1,20);data.writeUInt16LE(2,22);data.writeUInt32LE(SR,24);data.writeUInt32LE(SR*4,28);data.writeUInt16LE(4,32);data.writeUInt16LE(16,34);data.write('data',36);data.writeUInt32LE(data.length-44,40);
 for(let i=0;i<L.length;i++){const fade=Math.min(1,i/(SR*2),(L.length-i)/(SR*3));data.writeInt16LE(Math.round(L[i]*gain*fade*32767),44+i*4);data.writeInt16LE(Math.round(R[i]*gain*fade*32767),46+i*4);}
 fs.writeFileSync(`assets/${world}.wav`,data);manifests.push({world,seconds,BPM,bars,events:events.length,peakBeforeMaster:peak,gain,sections:['Introduction','Main theme','Sparse bridge','Reprise'],instruments:world==='dojo'?['plucked string','breathy flute','soft harmonic bed','wood percussion']:world==='egypt'?['oud-like plucked string','reed-like flute','frame drum','harmonic bed']:['electric keys','synth bass','pads','soft drum kit']});
}
fs.writeFileSync('docs/music-scores.json',JSON.stringify(manifests,null,2));console.log(manifests);
