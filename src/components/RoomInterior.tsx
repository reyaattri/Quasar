import React from 'react';
import Svg,{Rect,Path,Circle,Ellipse,G,Text as SvgText,Defs,LinearGradient,Stop} from 'react-native-svg';
import {View,Image} from 'react-native';
export function RoomInterior({world,stop,width,height}:{world:number;stop:number;width:number;height:number}){
 if(world===0)return <View style={{width,height,overflow:'hidden'}}><Image source={require('../../assets/rooms-dojo.png')} resizeMode="stretch" style={{position:'absolute',width:width*3,height:height*2,left:-(stop%3)*width,top:-Math.floor(stop/3)*height}}/></View>;
 if(stop===2)return <View style={{width,height,overflow:'hidden'}}><Image source={require('../../assets/palace-interiors.png')} resizeMode="stretch" style={{position:'absolute',width:width*3,height,left:-world*width}}/></View>;
 const neon=world===2,edge=neon?'#88E8ED':'#FFD580',ink=neon?'#261C48':'#80502B';
 return <Svg width={width} height={height} viewBox="0 0 400 620" preserveAspectRatio="none">
 <Defs><LinearGradient id="roomFloor" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor={neon?'#453276':'#B87B40'}/><Stop offset="1" stopColor={neon?'#18182D':'#EDC48A'}/></LinearGradient></Defs>
 <Rect width={400} height={620} fill={neon?'#19192E':'#C89555'}/><Path d="M0 0H400V180L340 245H60L0 180Z" fill={neon?'#262140':'#E5BB7D'}/><Path d="M0 180L60 245H340L400 180V620H0Z" fill="url(#roomFloor)"/>
 {[0,1,2,3,4,5,6].map(i=><Path key={i} d={`M${60+i*46} 245L${-180+i*125} 620`} stroke={edge} opacity={.15}/>)}
 {[280,330,390,460,540].map(y=><Path key={y} d={`M0 ${y}H400`} stroke={edge} opacity={.15}/>)}
 {[22,360].map(x=><G key={x}><Rect x={x} y={35} width={18} height={240} rx={neon?8:0} fill={edge}/><Rect x={x+5} y={40} width={8} height={230} fill={neon?'#DA75F0':'#326071'}/></G>)}
 <Path d="M60 245H340M65 18H335" stroke={edge} strokeWidth={4}/>
 {neon&&stop===1 ? <>
 <Machine x={48} y={175} color="#D67ACB" kind="claw"/><Machine x={158} y={108} color="#63D5DC" kind="race"/><Machine x={268} y={187} color="#E4BB64" kind="pinball"/>
 </> : [0,1,2].map((i)=><G key={i} transform={`translate(${[56,160,266][i]},${[180,110,190][i]})`}>
 <Ellipse cx={40} cy={156} rx={52} ry={15} fill="#080C1F" opacity={.25}/>
 <Rect x={0} y={128} width={82} height={28} fill={ink} stroke={edge} strokeWidth={2}/>
 {neon ? <NeonObject stop={stop} index={i}/> : <EgyptObject stop={stop} index={i}/>}
 </G>)}
 <Path d="M170 580L200 565L230 580M180 592L200 582L220 592" stroke={edge} strokeWidth={3} fill="none" opacity={.7}/>
 </Svg>;
}
function Machine({x,y,color,kind}:{x:number;y:number;color:string;kind:string}){return <G transform={`translate(${x},${y})`}>
 <Ellipse cx={42} cy={167} rx={52} ry={14} fill="#070A19" opacity={.4}/><Path d="M0 0H80V164H0Z" fill="#292347" stroke={color} strokeWidth={4}/><Rect x={6} y={8} width={68} height={18} rx={4} fill={color}/><Rect x={8} y={34} width={64} height={74} fill="#112B44" stroke={color}/>
 {kind==='claw'? <><Path d="M40 35V62q25 -8 25 12q0 18 -25 12q-20 -8 -18 8" stroke="#D781ED" strokeWidth={7} fill="none"/><Circle cx={27} cy={91} r={9} fill="#F6D27E"/><Circle cx={52} cy={96} r={8} fill="#A9DBA2"/></>:kind==='race'? <><Path d="M18 106L35 40H48L69 106" stroke="#78E7E7" fill="#3C3972"/><Rect x={34} y={74} width={15} height={22} rx={4} fill="#F6CE76"/></>:<><Path d="M14 42L68 47L62 101H19Z" stroke="#F3D078" fill="#654A77"/>{[25,40,56].map((n)=><Circle key={n} cx={n} cy={58+n/3} r={6} fill={color}/>)}</>}
 <Path d="M0 113L80 113L85 130H-5Z" fill={color}/><Circle cx={21} cy={121} r={5} fill="#332940"/><Circle cx={61} cy={121} r={4} fill="#EC655D"/><Rect x={29} y={140} width={22} height={7} fill="#131623"/>
 </G>}
function NeonObject({stop,index}:{stop:number;index:number}){
 if(stop===0&&index===0)return <><Rect x={10} y={3} width={60} height={125} rx={10} fill="#6378C6" stroke="#91F1EE" strokeWidth={4}/><Circle cx={29} cy={42} r={5} fill="#AEFAF1"/><Circle cx={53} cy={42} r={5} fill="#AEFAF1"/><Path d="M26 62Q41 84 57 62" stroke="#AEFAF1" strokeWidth={4} fill="none"/></>;
 if(stop===3)return index===0?<><Ellipse cx={40} cy={103} rx={39} ry={20} fill="#E36C9C"/><Path d="M2 100Q40 161 78 100" fill="#F2BF80"/><Path d="M19 98Q10 30 42 31Q73 28 64 98Z" fill="#AE90E8"/><Circle cx={34} cy={63} r={4}/><Circle cx={52} cy={63} r={4}/><Path d="M15 90Q-5 58 8 48M65 90Q85 62 79 50" stroke="#AE90E8" strokeWidth={7} fill="none"/></>:<><Rect x={9} y={25} width={64} height={104} rx={5} fill="#426681" stroke="#92E8E7"/><Rect x={17} y={38} width={48} height={55} fill="#23344E"/>{[25,44,63].map(x=><Circle key={x} cx={x} cy={110} r={5} fill="#EAAD6B"/>)}</>;
 if(stop===5)return <><Path d="M17 129L42 62L67 129M42 62L42 129" stroke="#99B9DE" strokeWidth={5}/><G rotation={-25} origin="40,50"><Rect x={5} y={30} width={70} height={28} rx={8} fill="#6678BA" stroke="#8EF0E4"/></G><Circle cx={48} cy={16} r={11} fill="#FFD779"/><Path d="M48 25V43H58" stroke="#FFD779" strokeWidth={5}/></>;
 return <><Rect x={5} y={44} width={72} height={80} rx={6} fill="#3D557B" stroke="#8AEAE2"/><Rect x={14} y={53} width={54} height={35} fill="#172C43"/><Path d="M18 72l8 -7 9 13 10 -18 10 15 9 -7M40 44V5M20 13L40 4L61 13" fill="none" stroke="#89E9CB" strokeWidth={3}/><Circle cx={25} cy={105} r={6} fill="#EAAA72"/></>;
}
function EgyptObject({stop,index}:{stop:number;index:number}){
 if(stop===0&&index===0)return <><Circle cx={40} cy={78} r={43} fill="#51453A" stroke="#F2C475" strokeWidth={5}/><Circle cx={40} cy={78} r={23} fill="#C39359"/><Ellipse cx={41} cy={117} rx={20} ry={12} fill="#266B70"/></>;
 if(stop===1)return <><Rect x={8} y={45} width={66} height={75} fill="#238991" stroke="#EBCD76" strokeWidth={5}/><Path d="M41 50L67 82L41 113L15 82Z" fill="#F0C264"/><Path d="M23 120L15 131M59 120L69 131" stroke="#634931" strokeWidth={5}/></>;
 if(stop===3)return <><Path d="M40 5V127M9 128H72" stroke="#C29135" strokeWidth={5}/><Path d="M11 30Q40 5 70 30L65 109Q40 129 15 105Z" fill={index===0?'#258D9A':'#CDAA56'} stroke="#F0D07E" strokeWidth={4}/><Path d="M17 40L64 94M17 57L60 110" stroke="#F0D07E" strokeWidth={4}/></>;
 if(stop===4)return <><Rect x={9} y={28} width={67} height={90} fill="#EBD39E"/><Ellipse cx={42} cy={27} rx={34} ry={8} fill="#BA8F55"/><Ellipse cx={42} cy={118} rx={34} ry={8} fill="#BA8F55"/>{[47,63,79,95].map(y=><Path key={y} d={`M20 ${y}H65`} stroke="#547374" strokeWidth={3}/>)}</>;
 return <><Path d="M10 130V70H21V15H63V70H74V130Z" fill="#327986" stroke="#EFC770" strokeWidth={5}/><Circle cx={42} cy={47} r={15} fill="#E6B953"/><Path d="M21 90H63M22 111H63" stroke="#F4D890" strokeWidth={5}/></>;
}
