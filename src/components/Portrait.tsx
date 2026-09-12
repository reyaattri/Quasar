import React from 'react';
import Svg,{Rect,Circle,Path,Ellipse,G} from 'react-native-svg';
import {people} from '../data/funGames';
export function Portrait({index,size=210}:{index:number;size?:number}){const p=people[index];return <Svg width={size} height={size} viewBox="0 0 200 200" accessibilityLabel={"Portrait: "+p.feature}>
 <Rect width={200} height={200} rx={32} fill={p.color}/><Circle cx={156} cy={35} r={30} fill="#FFFFFF" opacity={.15}/><Path d="M25 200Q30 134 100 138Q169 131 178 200Z" fill={['#315750','#EBC479','#4B354F','#3B6F83','#DA795C','#354A6C'][index]}/>
 <Ellipse cx={100} cy={94} rx={49} ry={57} fill={p.skin}/><Ellipse cx={51} cy={97} rx={9} ry={14} fill={p.skin}/><Ellipse cx={149} cy={97} rx={9} ry={14} fill={p.skin}/>
 <Path d={index%2?'M51 76Q32 5 96 25Q157 7 151 74L126 47Q88 75 68 53Z':'M49 87Q23 31 76 25Q148 2 158 75L132 50Q110 62 78 52L58 96Z'} fill={index===5?'#D7C6AA':index===2?'#242C32':'#53372C'}/>
 <Ellipse cx={80} cy={96} rx={5} ry={7} fill="#252A30"/><Ellipse cx={122} cy={96} rx={5} ry={7} fill="#252A30"/><Path d="M99 96L94 111H103" stroke="#9B634D" strokeWidth={3} fill="none"/><Path d="M81 124Q100 145 122 122" fill="#FFF2DC" stroke="#784436" strokeWidth={2}/>
 {index===0&&<G stroke="#3A3337" strokeWidth={4} fill="none"><Circle cx={78} cy={96} r={21}/><Circle cx={124} cy={96} r={21}/><Path d="M99 93H103"/></G>}
 {index===1&&<><Path d="M50 69Q48 8 103 14Q151 13 152 69Z" fill="#376AA3"/><Rect x={48} y={57} width={106} height={22} rx={8} fill="#76B6DB"/><Circle cx={100} cy={15} r={13} fill="#D9EBE9"/></>}
 {index===2&&<><Path d="M101 38L53 5L51 50Z M101 38L147 3L151 51Z" fill="#A269C1" stroke="#663E7F" strokeWidth={3}/><Circle cx={101} cy={36} r={12} fill="#D3B3E6"/></>}
 {index===3&&[0,1,2,3,4].map(i=><Path key={i} d={`M${50+i*24} 169L${60+i*24} 200`} stroke="#F8EAC8" strokeWidth={10}/>)}
 {index===4&&<><Path d="M45 97Q34 22 101 23Q164 22 158 98" stroke="#F0C746" strokeWidth={12} fill="none"/><Rect x={36} y={79} width={22} height={44} rx={10} fill="#F7CE4E"/><Rect x={143} y={79} width={22} height={44} rx={10} fill="#F7CE4E"/></>}
 {index===5&&<Path d="M100 116Q75 102 66 117Q48 125 45 107Q40 143 76 138L100 125L124 138Q160 143 155 107Q150 125 134 117Q120 102 100 116Z" fill="#584131"/>}
 </Svg>}
