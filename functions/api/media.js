import {verifyAdmin} from '../_auth.js';
const types={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/avif':'avif'};
export async function onRequestPost({request,env}){
 if(!await verifyAdmin(request,env))return Response.json({error:'Unauthorized'},{status:401});
 if(!env.MEDIA)return Response.json({error:'R2 media bucket not configured'},{status:503});
 const form=await request.formData().catch(()=>null),file=form?.get('file');
 if(!(file instanceof File))return Response.json({error:'Image required'},{status:400});
 if(!types[file.type]||file.size>3*1024*1024||file.size<100)return Response.json({error:'Only JPG, PNG, WebP or AVIF images up to 3 MB'},{status:400});
 const bytes=new Uint8Array(await file.arrayBuffer());
 const isJpeg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
 const isPng=bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71;
 const isWebp=String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP';
 const isAvif=String.fromCharCode(...bytes.slice(4,12)).includes('ftypavif')||String.fromCharCode(...bytes.slice(4,12)).includes('ftypavis');
 if(!(file.type==='image/jpeg'&&isJpeg||file.type==='image/png'&&isPng||file.type==='image/webp'&&isWebp||file.type==='image/avif'&&isAvif))return Response.json({error:'File signature does not match image type'},{status:400});
 const key=crypto.randomUUID()+'.'+types[file.type];
 await env.MEDIA.put(key,bytes,{httpMetadata:{contentType:file.type,cacheControl:'public,max-age=31536000,immutable'}});
 return Response.json({url:'/media/'+key},{status:201});
}
