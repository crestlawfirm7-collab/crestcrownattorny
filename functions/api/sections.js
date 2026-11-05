import {verifyAdmin} from '../_auth.js';
const allowedPages=['/','/about','/practice-areas','/team','/insights','/careers','/contact'];
const clean=x=>String(x??'').trim();
export async function onRequestGet({env,request}) {
 if(!env.DB)return Response.json({error:'D1 database not configured'},{status:503});
 const url=new URL(request.url);
 const page=url.searchParams.get('page');
 const admin=await verifyAdmin(request,env);
 if(url.searchParams.has('admin')&&!admin)return Response.json({error:'Unauthorized'},{status:401});
 let query='SELECT id,page,title,body,sort_order,published FROM sections';
 const filters=[],values=[];
 if(page){filters.push('page=?');values.push(page)}
 if(!admin)filters.push('published=1');
 if(filters.length)query+=' WHERE '+filters.join(' AND ');
 query+=' ORDER BY page,sort_order,id LIMIT 100';
 const result=await env.DB.prepare(query).bind(...values).all();
 return Response.json({sections:result.results},{headers:{'Cache-Control':'no-store'}});
}
export async function onRequestPost({env,request}){
 if(!await verifyAdmin(request,env))return Response.json({error:'Unauthorized'},{status:401});
 if(!env.DB)return Response.json({error:'D1 not configured'},{status:503});
 let data;try{data=await request.json()}catch{return Response.json({error:'Invalid JSON'},{status:400})}
 const page=clean(data.page),title=clean(data.title),body=clean(data.body);
 if(!allowedPages.includes(page)||title.length<2||title.length>120||body.length>8000)return Response.json({error:'Invalid section fields'},{status:400});
 const id=crypto.randomUUID(),order=Math.max(0,Math.min(9999,Number(data.sort_order)||0));
 await env.DB.prepare('INSERT INTO sections (id,page,title,body,sort_order,published) VALUES (?,?,?,?,?,0)').bind(id,page,title,body,order).run();
 return Response.json({id,published:false},{status:201});
}
export async function onRequestPut({env,request}){
 if(!await verifyAdmin(request,env))return Response.json({error:'Unauthorized'},{status:401});
 if(!env.DB)return Response.json({error:'D1 not configured'},{status:503});
 let d;try{d=await request.json()}catch{return Response.json({error:'Invalid JSON'},{status:400})}
 if(typeof d.id!=='string'||d.id.length>80||!allowedPages.includes(clean(d.page))||clean(d.title).length<2||clean(d.title).length>120||clean(d.body).length>8000)return Response.json({error:'Invalid section fields'},{status:400});
 const result=await env.DB.prepare('UPDATE sections SET page=?,title=?,body=?,sort_order=?,published=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(clean(d.page),clean(d.title),clean(d.body),Math.max(0,Math.min(9999,Number(d.sort_order)||0)),d.published===true?1:0,d.id).run();
 return Response.json({updated:result.meta.changes>0});
}
export async function onRequestDelete({env,request}){
 if(!await verifyAdmin(request,env))return Response.json({error:'Unauthorized'},{status:401});
 if(!env.DB)return Response.json({error:'D1 not configured'},{status:503});
 let d;try{d=await request.json()}catch{return Response.json({error:'Invalid JSON'},{status:400})}
 if(typeof d.id!=='string'||d.id.length>80)return Response.json({error:'Invalid id'},{status:400});
 await env.DB.prepare('DELETE FROM sections WHERE id=?').bind(d.id).run();
 return Response.json({deleted:true});
}
