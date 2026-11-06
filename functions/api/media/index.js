import {verifyAdmin} from '../../_auth.js';
export async function onRequestPost({request,env}){
 if(!await verifyAdmin(request,env))return Response.json({error:'Unauthorized'},{status:401});
 if(!env.DB)return Response.json({error:'Database unavailable'},{status:503});
 const form=await request.formData().catch(()=>null),file=form?.get('image');
 if(!file||typeof file.arrayBuffer!=='function')return Response.json({error:'Choose an image'},{status:400});
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>900000||file.size===0)return Response.json({error:'Upload a JPEG, PNG or WebP below 900 KB'},{status:400});
 const bytes=new Uint8Array(await file.arrayBuffer());
 const valid=file.type==='image/jpeg'&&bytes[0]===255&&bytes[1]===216||file.type==='image/png'&&bytes[0]===137&&bytes[1]===80||file.type==='image/webp'&&String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP';
 if(!valid)return Response.json({error:'Invalid image format'},{status:400});
 let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
 const assetId=crypto.randomUUID();
 try{await env.DB.prepare('INSERT INTO media_assets(id,mime,data,filename) VALUES(?,?,?,?)').bind(assetId,file.type,btoa(binary),String(file.name).slice(0,100)).run()}
 catch{return Response.json({error:'Media table missing. Apply migration 0004_media_assets.sql.'},{status:503})}
 return Response.json({url:'/api/media/'+assetId,absolute_url:new URL('/api/media/'+assetId,request.url).href,storage:'site-domain',id:assetId});
}
export async function onRequestGet({request,env}){
 if(!await verifyAdmin(request,env))return Response.json({error:'Unauthorized'},{status:401});
 if(!env.DB)return Response.json({error:'Database unavailable'},{status:503});
 const result=await env.DB.prepare('SELECT id,filename,created_at FROM media_assets ORDER BY created_at DESC LIMIT 100').all().catch(()=>null);
 if(!result)return Response.json({error:'Media table missing'},{status:503});
 return Response.json({assets:result.results});
}