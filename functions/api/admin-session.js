import {verifyAdmin} from '../_auth.js';
export async function onRequestGet({request,env}){const authorized=await verifyAdmin(request,env);return Response.json({authorized},{status:authorized?200:401,headers:{'Cache-Control':'no-store'}})}
