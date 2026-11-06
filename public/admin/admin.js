
// API endpoints must return JSON. A deployment fallback may instead return index.html.
async function readApiJson(response){
 const type=response.headers.get('content-type')||'';
 if(!type.toLowerCase().includes('application/json')){
  if(response.status===401||response.status===403)throw Error('Your admin session has expired. Please sign in again.');
  throw Error('The website API is unavailable or misconfigured (HTTP '+response.status+'). Please check the Cloudflare Pages Functions deployment and try again.');
 }
 let data;try{data=await response.json()}catch{throw Error('The server returned an incomplete response. Please retry.');}
 if(!response.ok)throw Error(data?.error||'Request failed (HTTP '+response.status+').');
 return data;
}

/* Compress images before uploading to same-domain storage. Original files never go to third-party hosts. */
async function prepareSiteImage(file){
 if(!file)throw Error('Choose an image first.');
 if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('Use JPEG, PNG or WebP.');
 if(file.size<=900000)return file;
 const bitmap=await createImageBitmap(file);
 try{
  const canvas=document.createElement('canvas');
  const ratio=Math.min(1,1800/Math.max(bitmap.width,bitmap.height));
  canvas.width=Math.max(1,Math.round(bitmap.width*ratio));
  canvas.height=Math.max(1,Math.round(bitmap.height*ratio));
  const ctx=canvas.getContext('2d');
  if(!ctx)throw Error('Image processing is unavailable.');
  ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
  for(const quality of [.82,.7,.58,.45]){
   const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',quality));
   if(blob&&blob.size<=900000)return new File([blob],file.name.replace(/\.[^.]+$/,'')+'.webp',{type:'image/webp'});
  }
  throw Error('Image is too large. Resize it before uploading.');
 }finally{bitmap.close?.()}
}

const $=s=>document.querySelector(s),status=$('#status'),editor=$('#editor'),list=$('#sections');
const request=async(method='GET',body)=>{const r=await fetch('/api/sections?admin=1',{method,headers:{'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,credentials:'same-origin'});const d=await readApiJson(r);return d};
async function load(){try{const d=await request();list.replaceChildren();for(const item of d.sections){const div=document.createElement('div');div.className='item';const h=document.createElement('h3');h.textContent=item.title;const p=document.createElement('p');p.textContent=item.page+' • '+(item.published?'Published':'Draft')+' • '+item.body.slice(0,180);const toggle=document.createElement('button');toggle.textContent=item.published?'Unpublish':'Publish';toggle.onclick=async()=>{try{await request('PUT',{...item,published:!item.published});await load()}catch(e){status.textContent=e.message}};const del=document.createElement('button');del.textContent='Delete';del.onclick=async()=>{if(!confirm('Delete this section?'))return;try{await request('DELETE',{id:item.id});await load()}catch(e){status.textContent=e.message}};div.append(h,p,toggle,del);list.append(div)}if(!d.sections.length)list.textContent='No custom sections yet.'}catch(e){status.textContent=e.message}}
$('#sectionForm').onsubmit=async e=>{e.preventDefault();try{await request('POST',{page:$('#page').value,title:$('#title').value,body:$('#body').value,image_url:$('#sectionImage').value,sort_order:Number($('#order').value)});e.target.reset();status.textContent='Draft saved.';await load()}catch(err){status.textContent=err.message}};
async function checkSession(){try{const r=await fetch('/api/admin-session',{credentials:'same-origin',cache:'no-store'});await readApiJson(r);$('#loginPanel').hidden=true;$('#logout').hidden=false;editor.hidden=false;status.textContent='Administrator signed in';await load();await refreshEntries();await refreshTeam();await loadSettings();await loadMedia()}catch(e){editor.hidden=true;$('#loginPanel').hidden=false;$('#logout').hidden=true;status.textContent=e.message.includes('session')||e.message.includes('Unauthorized')?'Enter your administrator password to continue.':e.message}}
$('#loginForm').addEventListener('submit',async e=>{e.preventDefault();const btn=$('#loginButton');btn.disabled=true;status.textContent='Signing in…';try{const r=await fetch('/api/admin-session',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({password:$('#adminPassword').value})});const d=await readApiJson(r);$('#adminPassword').value='';await checkSession()}catch(error){status.textContent=error.message}finally{btn.disabled=false}});
$('#logout').onclick=async()=>{await fetch('/api/admin-session',{method:'DELETE',credentials:'same-origin'});await checkSession()};
checkSession();

const contentRequest=async(method='GET',data)=>{const response=await fetch('/api/content?admin=1',{method,headers:{'Content-Type':'application/json'},body:data?JSON.stringify(data):undefined});const result=await readApiJson(response);return result};
let entriesCache=[];
const form=$('#entryForm'),fields={id:$('#entryId'),kind:$('#kind'),slug:$('#slug'),title:$('#entryTitle'),summary:$('#summary'),body:$('#entryBody'),image_url:$('#imageUrl'),seo_title:$('#seoTitle'),seo_description:$('#seoDescription'),published:$('#published')};
async function refreshEntries(){try{const result=await contentRequest();entriesCache=result.entries;const root=$('#entries');root.replaceChildren();for(const entry of entriesCache){const item=document.createElement('div');item.className='item';item.dataset.kind=entry.kind;const filter=document.getElementById('entries')?.dataset.filterKind;if(filter&&entry.kind!==filter)item.hidden=true;const h=document.createElement('h3');h.textContent=entry.title;const meta=document.createElement('p');meta.textContent=entry.kind+' / '+entry.slug+' — '+(entry.published?'Published':'Draft');const edit=document.createElement('button');edit.textContent='Edit';edit.onclick=()=>{for(const [key,input] of Object.entries(fields))input.type==='checkbox'?input.checked=!!entry[key]:input.value=entry[key]??'';form.scrollIntoView({behavior:'smooth'})};const del=document.createElement('button');del.textContent='Delete';del.onclick=async()=>{if(!confirm('Permanently delete this entry?'))return;try{await contentRequest('DELETE',{id:entry.id});await refreshEntries()}catch(e){status.textContent=e.message}};item.append(h,meta,edit,del);root.append(item)}if(!entriesCache.length)root.textContent='No entries yet.'}catch(e){status.textContent=e.message}}
form.addEventListener('submit',async e=>{e.preventDefault();const data={};for(const [key,input] of Object.entries(fields))data[key]=input.type==='checkbox'?input.checked:input.value;const currentKind=document.getElementById('entries')?.dataset.filterKind;if(currentKind)data.kind=currentKind;try{await contentRequest('POST',data);form.reset();fields.id.value='';status.textContent='Entry saved.';await refreshEntries()}catch(err){status.textContent=err.message}});
$('#editBuiltIn').onclick=()=>{
 const selected=$('#builtInSelect').value;
 if(!selected){status.textContent='Choose a practice area or team member first.';return}
 const [kind,slug]=selected.split(':');
 const existing=entriesCache.find(e=>e.kind===kind&&e.slug===slug);
 form.reset();
 if(existing){for(const [key,input] of Object.entries(fields))input.type==='checkbox'?input.checked=!!existing[key]:input.value=existing[key]??''}
 else{
  fields.kind.value=kind;fields.slug.value=slug;
  fields.title.value=$('#builtInSelect').selectedOptions[0].textContent;
  fields.published.checked=false;
 }
 form.scrollIntoView({behavior:'smooth',block:'start'});
 status.textContent=existing?'Existing published content loaded. Review before saving.':'Original page selected. Enter the approved text and publish to override the existing content.';
};
$('#resetEntry').onclick=()=>{form.reset();fields.id.value=''};
$('#loadEnquiries').onclick=async()=>{try{const response=await fetch('/api/enquiries');if(!response.ok)throw Error('Unable to retrieve enquiries');const data=await readApiJson(response);const root=$('#enquiries');root.replaceChildren();for(const e of data.enquiries){const block=document.createElement('div');block.className='item';for(const value of [e.created_at+' • '+e.name+' • '+e.email,e.topic,e.message]){const p=document.createElement('p');p.textContent=value;block.append(p)}root.append(block)}if(!data.enquiries.length)root.textContent='No enquiries yet.'}catch(e){status.textContent=e.message}};




const settingsKeys=["home_eyebrow","home_title","home_description","home_banner_url","home_highlight_title","home_highlight_body","about_intro","about_approach","practice_intro","team_intro","insights_intro","careers_intro","careers_body","contact_intro","contact_office","contact_email","contact_phone","contact_whatsapp","footer_description","footer_disclaimer","brand_name","brand_logo_url","seo_home_title","seo_home_description"];
async function loadSettings(){try{const r=await fetch('/api/site-settings?admin=1',{credentials:'same-origin'});if(!r.ok)throw Error('Could not load website settings');const d=await readApiJson(r);for(const key of settingsKeys)$('#setting_'+key).value=d.settings?.[key]||''}catch(e){status.textContent=e.message}}
$('#settingsForm').addEventListener('submit',async e=>{e.preventDefault();const settings={};for(const key of settingsKeys)settings[key]=$('#setting_'+key).value;try{const r=await fetch('/api/site-settings',{method:'PUT',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({settings})});const d=await readApiJson(r);status.textContent='Website settings saved and published.'}catch(e){status.textContent=e.message}});

function useMedia(url){const key=$('#mediaTarget').value;const input=$('#'+(key==='imageUrl'?'imageUrl':'setting_'+key));input.value=url;input.scrollIntoView({behavior:'smooth',block:'center'});$('#mediaStatus').textContent='Image stored on this website domain. Save the relevant settings or content entry to publish.'}
async function loadMedia(){const root=$('#mediaLibrary');try{const r=await fetch('/api/media',{credentials:'same-origin'});const d=await readApiJson(r);root.replaceChildren();for(const item of d.assets){const row=document.createElement('div');row.className='item';const img=document.createElement('img');img.src='/api/media/'+item.id;img.alt=item.filename;img.style.cssText='width:110px;height:85px;object-fit:cover;vertical-align:middle;margin-right:12px';const btn=document.createElement('button');btn.type='button';btn.textContent='Use image';btn.onclick=()=>useMedia(img.getAttribute('src'));row.append(img,document.createTextNode(item.filename+' '),btn);root.append(row)}if(!d.assets.length)root.textContent='No images uploaded.'}catch(e){root.textContent=e.message}}
$('#mediaForm').addEventListener('submit',async e=>{e.preventDefault();const button=$('#uploadMedia');button.disabled=true;try{const form=new FormData();form.append('image',await prepareSiteImage($('#mediaFile').files[0]));const r=await fetch('/api/media',{method:'POST',body:form,credentials:'same-origin'});const d=await readApiJson(r);useMedia(d.url);$('#mediaFile').value='';await loadMedia()}catch(e){$('#mediaStatus').textContent=e.message}finally{button.disabled=false}});

async function uploadSelectedImage(input){const file=input.files?.[0];if(!file)return;const button=document.querySelector('[data-media-upload="'+input.dataset.uploadFor+'"]');button.disabled=true;try{const form=new FormData();form.append('image',await prepareSiteImage(file));const r=await fetch('/api/media',{method:'POST',body:form,credentials:'same-origin'});const d=await readApiJson(r);const field=document.getElementById(input.dataset.uploadFor);field.value=d.url;const preview=document.querySelector('[data-preview-for="'+input.dataset.uploadFor+'"]');preview.src=d.url;preview.style.display='block';status.textContent='Image uploaded. Save this section or article to publish.';await loadMedia()}catch(e){status.textContent=e.message}finally{button.disabled=false}}
document.querySelectorAll('[data-media-upload]').forEach(button=>button.addEventListener('click',()=>uploadSelectedImage(document.querySelector('[data-upload-for="'+button.dataset.mediaUpload+'"]'))));
document.querySelectorAll('[data-preview-for]').forEach(img=>{const field=document.getElementById(img.dataset.previewFor);const show=()=>{const url=field.value.trim();img.style.display=url?'block':'none';if(url)img.src=url};field.addEventListener('input',show);show()});


/* Dedicated team editor, backed by the existing authenticated CMS and media API. */
const teamFields={id:$('#teamId'),name:$('#teamName'),slug:$('#teamSlug'),role:$('#teamRole'),qualifications:$('#teamQualifications'),affiliations:$('#teamAffiliations'),specialisations:$('#teamSpecialisations'),biography:$('#teamBiography'),order:$('#teamOrder'),image:$('#teamImageUrl'),seoTitle:$('#teamSeoTitle'),seoDescription:$('#teamSeoDescription'),published:$('#teamPublished')};
const originalTeam=[
 {slug:'glory-toritseju-kunu',name:'Glory Toritseju Kunu',role:'Legal Associate — Corporate Practice & Property Law'},
 {slug:'eloho',name:'Eloho Avwaruroro-Okoye, Esq.',role:'Founder & Principal Counsel'},
 {slug:'ejeremedoghene-ejiroghene',name:'Ejeremedoghene Ejiroghene',role:'Family Law'}
];
const parseTeamBody=body=>{try{const obj=JSON.parse(body||'{}');if(obj&&typeof obj==='object'&&!Array.isArray(obj))return obj}catch{}return {biography:body||''}};
const lines=value=>value.split('\n').map(s=>s.trim()).filter(Boolean);
const teamPreview=url=>{teamFields.image.value=url||'';const img=$('#teamPhotoPreview');img.style.display=url?'block':'none';if(url)img.src=url};
function resetTeam(){ $('#teamForm').reset();teamFields.id.value='';teamPreview('') }
$('#resetTeam').onclick=resetTeam;
function editTeam(entry){
 resetTeam();
 teamFields.id.value=entry.id||'';
 teamFields.name.value=entry.title||'';
 teamFields.slug.value=entry.slug;
 teamFields.role.value=entry.slug==='eloho'?'Founder & Principal Counsel':entry.summary||'';
 const body=parseTeamBody(entry.body);
 teamFields.qualifications.value=(body.qualifications||[]).join('\n');
 teamFields.affiliations.value=(body.affiliations||[]).join('\n');
 teamFields.specialisations.value=(body.specialisations||[]).join('\n');
 teamFields.biography.value=body.biography||'';
 teamFields.order.value=Number.isInteger(body.order)?body.order:50;
 teamFields.seoTitle.value=entry.seo_title||'';
 teamFields.seoDescription.value=entry.seo_description||'';
 teamFields.published.checked=!!entry.published;
 teamPreview(entry.image_url);
 $('#teamForm').scrollIntoView({behavior:'smooth',block:'start'});
}
async function refreshTeam(){
 const root=$('#teamEntries');root.replaceChildren();
 const data=await contentRequest();
 const records=data.entries.filter(x=>x.kind==='team');
 for(const base of originalTeam){
  if(!records.some(x=>x.slug===base.slug))records.push({kind:'team',slug:base.slug,title:base.name,summary:base.role,body:'',published:0,image_url:''});
 }
 records.sort((a,b)=>{const order=x=>{const o=parseTeamBody(x.body).order;return x.slug==='eloho'?-100:Number.isInteger(o)?o:50};return order(a)-order(b)||a.title.localeCompare(b.title)});
 for(const entry of records){
  const row=document.createElement('div');row.className='item';
  if(entry.image_url){const img=document.createElement('img');img.src=entry.image_url;img.alt=entry.title;img.style.cssText='width:68px;height:75px;object-fit:cover;float:left;margin-right:14px';row.append(img)}
  const h=document.createElement('h3');h.textContent=entry.title;
  const p=document.createElement('p');p.textContent='Order '+(parseTeamBody(entry.body).order??50)+' • '+(entry.summary||'')+' • '+(entry.published?'Published':entry.id?'Draft':'Original site profile');
  const edit=document.createElement('button');edit.textContent='Edit';edit.onclick=()=>editTeam(entry);
  row.append(h,p,edit);
  const photoLabel=document.createElement('label');photoLabel.textContent='Upload portrait for '+entry.title;
  photoLabel.style.cssText='display:inline-block;margin:8px 10px 8px 0;font-size:13px';
  const photoInput=document.createElement('input');photoInput.type='file';photoInput.accept='image/jpeg,image/png,image/webp';
  photoInput.style.cssText='max-width:230px;font-size:12px;padding:5px';
  const uploadBtn=document.createElement('button');uploadBtn.type='button';uploadBtn.textContent='Save portrait';
  uploadBtn.onclick=async()=>{
   if(!photoInput.files[0]){status.textContent='Choose a portrait image first.';return}
   uploadBtn.disabled=true;
   try{
    const data=new FormData();data.append('image',await prepareSiteImage(photoInput.files[0]));
    const response=await fetch('/api/media',{method:'POST',body:data,credentials:'same-origin'});
    const uploaded=await readApiJson(response);
    await contentRequest('POST',{id:entry.id||undefined,kind:'team',slug:entry.slug,title:entry.title,summary:entry.summary||'',body:entry.body||'',image_url:uploaded.url,seo_title:entry.seo_title||'',seo_description:entry.seo_description||'',published:entry.id?!!entry.published:true});
    status.textContent='Portrait saved for '+entry.title+'.';
    await refreshTeam();await refreshEntries();
   }catch(e){status.textContent=e.message}finally{uploadBtn.disabled=false}
  };
  photoLabel.append(photoInput);row.append(photoLabel,uploadBtn);
  if(entry.id){
   const toggle=document.createElement('button');toggle.textContent=entry.published?'Unpublish':'Publish';
   toggle.onclick=async()=>{try{await contentRequest('POST',{...entry,published:!entry.published});await refreshTeam()}catch(e){status.textContent=e.message}};
   const del=document.createElement('button');del.textContent='Delete';del.onclick=async()=>{if(!confirm('Delete this team profile?'))return;try{await contentRequest('DELETE',{id:entry.id});await refreshTeam()}catch(e){status.textContent=e.message}};
   row.append(toggle,del);
  }
  root.append(row);
 }
}
$('#teamForm').addEventListener('submit',async e=>{
 e.preventDefault();const btn=$('#saveTeam');btn.disabled=true;
 try{
  let photo=teamFields.image.value;
  const file=$('#teamPhoto').files[0];
  if(file){const data=new FormData();data.append('image',await prepareSiteImage(file));const upload=await fetch('/api/media',{method:'POST',body:data,credentials:'same-origin'});photo=(await readApiJson(upload)).url}
  const data={id:teamFields.id.value||undefined,kind:'team',slug:teamFields.slug.value.trim().toLowerCase(),title:teamFields.name.value.trim(),summary:teamFields.role.value.trim(),image_url:photo,seo_title:teamFields.seoTitle.value,seo_description:teamFields.seoDescription.value,published:teamFields.published.checked,body:JSON.stringify({qualifications:lines(teamFields.qualifications.value),affiliations:lines(teamFields.affiliations.value),specialisations:lines(teamFields.specialisations.value),biography:teamFields.biography.value.trim(),order:Number(teamFields.order.value)})};
  await contentRequest('POST',data);status.textContent='Team profile saved successfully.';resetTeam();await refreshTeam();await refreshEntries();
 }catch(err){status.textContent=err.message}finally{btn.disabled=false}
});
$('#teamName').addEventListener('input',()=>{if(!teamFields.id.value)teamFields.slug.value=teamFields.name.value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').replace(/-+/g,'-')});

window.prepareSiteImage=prepareSiteImage;
