export async function onRequestGet({params,env}){
 if(!env.DB||!/^[a-f0-9-]{36}$/.test(params.id))return new Response('Not found',{status:404});
 const row=await env.DB.prepare('SELECT mime,data FROM media_assets WHERE id=?').bind(params.id).first().catch(()=>null);
 if(!row)return new Response('Not found',{status:404});
 const binary=atob(row.data),bytes=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
 return new Response(bytes,{headers:{'Content-Type':row.mime,'Content-Length':String(bytes.length),'Cache-Control':'public,max-age=31536000,immutable','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; sandbox"}});
}