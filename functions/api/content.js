import {verifyAdmin} from '../_auth.js';
const kinds=['page','practice','team','post'];
const val=x=>String(x??'').trim();
const validSlug=s=>/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)&&s.length<=90;
export async function onRequestGet({request,env}){
 if(!env.DB)return Response.json({error:'Database unavailable'},{status:503});
 const u=new URL(request.url),admin=u.searchParams.get('admin')==='1';
 if(admin&&!await verifyAdmin(request,env))return Response.json({error:'Unauthorized'},{status:401});
 const kind=u.searchParams.get('kind'),slug=u.searchParams.get('slug');
 if(kind&&!kinds.includes(kind))return Response.json({error:'Invalid kind'},{status:400});
 let q='SELECT * FROM content_entries',where=[],args=[];
 if(kind){where.push('kind=?');args.push(kind)}
 if(slug){where.push('slug=?');args.push(slug)}
 if(!admin)where.push('published=1');
 if(where.length)q+=' WHERE '+where.join(' AND ');
 q+=' ORDER BY updated_at DESC LIMIT 100';
 const rows=await env.DB.prepare(q).bind(...args).all();
 return Response.json({entries:rows.results},{headers:{'Cache-Control':'no-store'}});
}
export async function onRequestPost({request,env}){
 if(!await verifyAdmin(request,env))return Response.json({error:'Unauthorized'},{status:401});
 if(!env.DB)return Response.json({error:'Database unavailable'},{status:503});
 let d;try{d=await request.json()}catch{return Response.json({error:'Invalid JSON'},{status:400})}
 const kind=val(d.kind),slug=val(d.slug),title=val(d.title),summary=val(d.summary),body=val(d.body),image=val(d.image_url),seoTitle=val(d.seo_title),seoDesc=val(d.seo_description);
 if(!kinds.includes(kind)||!validSlug(slug)||title.length<2||title.length>160||summary.length>500||body.length>30000||seoTitle.length>180||seoDesc.length>320||image.length>500||image&&!(image.startsWith('/')||/^https:\/\//.test(image)))return Response.json({error:'Invalid content fields'},{status:400});
 const id=typeof d.id==='string'&&d.id.length<=80?d.id:crypto.randomUUID();
 try{
 await env.DB.prepare('INSERT INTO content_entries(id,kind,slug,title,summary,body,image_url,seo_title,seo_description,published) VALUES(?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET kind=excluded.kind,slug=excluded.slug,title=excluded.title,summary=excluded.summary,body=excluded.body,image_url=excluded.image_url,seo_title=excluded.seo_title,seo_description=excluded.seo_description,published=excluded.published,updated_at=CURRENT_TIMESTAMP').bind(id,kind,slug,title,summary,body,image,seoTitle,seoDesc,d.published===true?1:0).run();
 return Response.json({id,ok:true});
 }catch{return Response.json({error:'Save failed; check whether this slug already exists'},{status:409})}
}
export async function onRequestDelete({request,env}){
 if(!await verifyAdmin(request,env))return Response.json({error:'Unauthorized'},{status:401});
 if(!env.DB)return Response.json({error:'Database unavailable'},{status:503});
 let d;try{d=await request.json()}catch{return Response.json({error:'Invalid JSON'},{status:400})}
 if(typeof d.id!=='string'||d.id.length>80)return Response.json({error:'Invalid ID'},{status:400});
 await env.DB.prepare('DELETE FROM content_entries WHERE id=?').bind(d.id).run();
 return Response.json({ok:true});
}
