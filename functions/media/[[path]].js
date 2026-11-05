export async function onRequestGet({params,env}){
 if(!env.MEDIA)return new Response('Unavailable',{status:503});
 const key=Array.isArray(params.path)?params.path.join('/'):String(params.path||'');
 if(!/^[a-f0-9-]{36}\.(jpg|png|webp|avif)$/.test(key))return new Response('Not found',{status:404});
 const object=await env.MEDIA.get(key);
 if(!object)return new Response('Not found',{status:404});
 return new Response(object.body,{headers:{'Content-Type':object.httpMetadata?.contentType||'application/octet-stream','Cache-Control':'public,max-age=31536000,immutable','X-Content-Type-Options':'nosniff'}});
}
