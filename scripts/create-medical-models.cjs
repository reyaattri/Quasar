// Original schematic teaching models, in metres. No anatomical scans or third-party meshes.
const fs = require('node:fs');
const path = require('node:path');
const out = path.join(__dirname, '../public/medical');
fs.mkdirSync(out, {recursive:true});
function model(name, parts) {
  const positions=[], normals=[], indices=[];
  const rows=16, cols=24;
  for(let r=0;r<=rows;r++) for(let c=0;c<=cols;c++) {
    const a=r*Math.PI/rows,b=c*Math.PI*2/cols;
    const v=[Math.sin(a)*Math.cos(b),Math.cos(a),Math.sin(a)*Math.sin(b)];
    positions.push(...v); normals.push(...v);
  }
  for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) {
    const a=r*(cols+1)+c,b=a+cols+1;
    indices.push(a,a+1,b,a+1,b+1,b);
  }
  const arrays=[new Float32Array(positions),new Float32Array(normals),new Uint16Array(indices)];
  const views=[]; let offset=0;
  const buffers=arrays.map(a=>{const b=Buffer.from(a.buffer);views.push({buffer:0,byteOffset:offset,byteLength:b.length});offset+=b.length;return b;});
  const materials=parts.map(p=>({pbrMetallicRoughness:{baseColorFactor:p.color,metallicFactor:0,roughnessFactor:.65}}));
  const gltf={asset:{version:'2.0',generator:'Quasar original schematic models'},scene:0,scenes:[{nodes:parts.map((_,i)=>i)}],
    nodes:parts.map((p,i)=>({name:p.name,mesh:i,translation:p.at,scale:p.scale, ...(p.angle?{rotation:[0,0,Math.sin(p.angle/2),Math.cos(p.angle/2)]}:{})})),
    meshes:parts.map((_,i)=>({primitives:[{attributes:{POSITION:0,NORMAL:1},indices:2,material:i}]})),materials,
    buffers:[{byteLength:offset}],bufferViews:views,accessors:[{bufferView:0,componentType:5126,count:positions.length/3,type:'VEC3',min:[-1,-1,-1],max:[1,1,1]},{bufferView:1,componentType:5126,count:normals.length/3,type:'VEC3'},{bufferView:2,componentType:5123,count:indices.length,type:'SCALAR'}]};
  let json=Buffer.from(JSON.stringify(gltf)); json=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,32)]);
  let bin=Buffer.concat(buffers);bin=Buffer.concat([bin,Buffer.alloc((4-bin.length%4)%4)]);
  const head=Buffer.alloc(12);head.writeUInt32LE(0x46546c67);head.writeUInt32LE(2,4);head.writeUInt32LE(28+json.length+bin.length,8);
  const chunk=(b,type)=>{const h=Buffer.alloc(8);h.writeUInt32LE(b.length);h.writeUInt32LE(type,4);return Buffer.concat([h,b]);};
  fs.writeFileSync(path.join(out,name+'.glb'),Buffer.concat([head,chunk(json,0x4e4f534a),chunk(bin,0x004e4942)]));
}
const green=[.21,.48,.35,1],pink=[.89,.57,.49,1],gold=[.94,.72,.29,1],purple=[.47,.38,.65,1];
const part=(name,at,scale,color,angle=0)=>({name,at,scale,color,angle});
model('barrier', Array.from({length:18},(_,i)=>part('Packed barrier cell '+(i+1),[(i%6-2.5)*.085,.12+Math.floor(i/6)*.045,0],[.047,.027,.09],i<6?pink:i<12?gold:green)));
model('phagocyte',[part('Phagocyte body',[0,.2,0],[.16,.15,.13],pink),part('Nucleus',[0,.21,.12],[.06,.045,.025],purple),part('Engulfing arm',[-.14,.3,0],[.045,.11,.065],pink,-.7),part('Engulfing arm',[.14,.3,0],[.045,.11,.065],pink,.7),part('Microbe',[0,.36,0],[.055,.055,.055],green),...Array.from({length:8},(_,i)=>part('Microbe surface projection',[Math.cos(i*Math.PI/4)*.06,.36+Math.sin(i*Math.PI/4)*.06,0],[.014,.014,.014],green))]);
model('antibody',[part('Antibody stem',[0,.13,0],[.025,.1,.025],gold),part('Binding arm',[-.065,.26,0],[.025,.105,.025],gold,.65),part('Binding arm',[.065,.26,0],[.025,.105,.025],gold,-.65),part('Binding site',[-.13,.34,0],[.032,.024,.03],purple),part('Binding site',[.13,.34,0],[.032,.024,.03],purple),part('Antigen target',[.15,.41,0],[.044,.044,.044],green)]);
console.log('Generated three original medical GLB models.');

