// Serve the single-page website for client-side pages while leaving API and admin routes intact.
// Cloudflare Pages _redirects is not consistently applied to routes when Pages Functions exist.
export async function onRequestGet({request,env,next}){
 const url=new URL(request.url);
 if(url.pathname.startsWith('/api/')||url.pathname.startsWith('/admin/')||url.pathname==='/admin')return next();
 if(/\.[a-z0-9]{1,8}$/i.test(url.pathname))return next();
 const accepts=request.headers.get('accept')||'';
 if(!accepts.includes('text/html')&&!accepts.includes('*/*'))return next();
 const assetUrl=new URL('/index.html',url);
 const response=await env.ASSETS.fetch(new Request(assetUrl.toString(),{method:'GET',headers:{Accept:'text/html'}}));
 if(!response.ok)return next();
 const headers=new Headers(response.headers);headers.set('Cache-Control','no-cache');return new Response(response.body,{status:200,headers});
}
