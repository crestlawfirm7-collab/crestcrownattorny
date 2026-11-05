const practices=[["Corporate & Commercial Law","corporate-commercial-law","Corporate advisory, company structuring and commercial agreements."],["Regulatory Compliance","regulatory-compliance","Business registrations, statutory filings and regulatory support."],["Property & Real Estate","property-real-estate","Property transactions, title reviews and real estate disputes."],["Family Law","family-law","Family-related legal advice and representation."],["Maritime Law","maritime-law","Advisory on maritime-related Nigerian legal matters."],["Debt Recovery","debt-recovery","Debt recovery and recovery of premises."],["Litigation & Dispute Resolution","litigation-dispute-resolution","Representation and alternative dispute resolution."],["Foreign Investment in Nigeria","foreign-investment-nigeria","Nigerian legal guidance for overseas investors and diaspora clients."]];
const team=[["Glory Toritseju Kunu","Corporate Practice & Property Law","BL, Nigerian Law School Abuja; LLB, Ambrose Alli University. CAC Accredited Agent; NBA Warri."],["Eloho","Corporate & Regulatory Compliance","Full name and professional qualifications pending verification."],["Ejeremedoghene Ejiroghene","Family Law","Professional qualifications pending verification."]];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nav=[["Home","/"],["About","/about"],["Practice Areas","/practice-areas"],["Our Team","/team"],["Insights","/insights"],["Careers","/careers"],["Contact","/contact"]];
const path=decodeURI(location.pathname).replace(/\/$/,"")||"/";
const link=(url,text)=>'<a href="'+url+'">'+esc(text)+'</a>';
const card=(title,desc,url)=>'<article class="card"><h3>'+link(url,title)+'</h3><p>'+esc(desc)+'</p>'+link(url,"Learn more →")+'</article>';
const intro=(tag,title,lead)=>'<section class="intro"><div class="wrap"><p class="eyebrow">'+esc(tag)+'</p><h1>'+esc(title)+'</h1><p class="lead">'+esc(lead)+'</p></div></section>';
const practiceCards=()=>'<div class="grid">'+practices.map(p=>card(p[0],p[2],'/practice-areas/'+p[1])).join('')+'</div>';
let title="Crest Crown Attorneys",body="";
if(path==="/"){title="Legal Services Across Nigeria";body=intro("NIGERIAN LEGAL SERVICES • INTERNATIONAL ENQUIRIES","Strategic Legal Solutions Across Nigeria and Beyond","Practical, client-focused Nigerian legal services for individuals, organisations, investors and international clients.")+'<section class="wrap section"><div class="actions">'+link("/contact","Request a Consultation")+link("/practice-areas","Explore Our Services")+'</div><h2>Our Practice Areas</h2>'+practiceCards()+'</section><section class="band"><div class="wrap"><h2>Local knowledge. National perspective.</h2><p>Our office is in Effurun, Delta State. We welcome enquiries concerning Nigerian legal matters from across the country and internationally.</p></div></section>';}
else if(path==="/about"){title="About Us";body=intro("THE FIRM",title,"Crest Crown Attorneys is committed to principled, client-focused legal services in Nigeria.")+'<section class="wrap section"><h2>Our approach</h2><p>We focus on clear communication, careful legal analysis and practical guidance. Our Effurun office is not a limit on the geographical scope of enquiries we welcome.</p></section>';}
else if(path==="/practice-areas"){title="Practice Areas";body=intro("WHAT WE DO",title,"Explore Nigerian legal services for individuals, companies and overseas clients.")+'<section class="wrap section">'+practiceCards()+'</section>';}
else if(path.startsWith("/practice-areas/")){const p=practices.find(x=>"/practice-areas/"+x[1]===path);if(p){title=p[0];body=intro("PRACTICE AREA",title,p[2])+'<section class="wrap section"><h2>How we can help</h2><p>Contact our team to discuss your specific Nigerian legal matter, applicable jurisdiction and appropriate next steps.</p>'+link("/contact","Request a consultation →")+'</section>';}else{title="Page not found";}}
else if(path==="/team"){title="Our Team";body=intro("OUR PEOPLE",title,"Meet members of the legal team. Professional details are subject to verification.")+'<section class="wrap section"><div class="grid">'+team.map(t=>card(t[0],t[1]+". "+t[2],"/contact")).join('')+'</div></section>';}
else if(path==="/insights"){title="Legal Insights";body=intro("KNOWLEDGE",title,"Practical legal information and updates.")+'<section class="wrap section"><p>Articles will be published after professional review and approval. Content is for general information and is not legal advice.</p></section>';}
else if(path==="/careers"){title="Careers";body=intro("JOIN THE TEAM",title,"Explore future opportunities at Crest Crown Attorneys.")+'<section class="wrap section"><p>There are no verified vacancies listed at present. Contact the firm for official recruitment information.</p></section>';}
else if(path==="/contact"||path==="/consultation"){title="Contact & Consultation";body=intro("GET IN TOUCH",title,"We welcome enquiries from across Nigeria and overseas about Nigerian legal matters.")+'<section class="wrap section"><h2>Contact the firm</h2><p>Office: Effurun, Delta State, Nigeria.</p><p>For verified contact information and consultation arrangements, please contact the firm through its official channels. Do not send confidential case details through unverified channels.</p><p>International enquiries are welcome. Foreign-jurisdiction representation is not implied.</p></section>';}
else if(path==="/privacy-policy"){title="Privacy Policy";body=intro("LEGAL",title,"Privacy information")+'<section class="wrap section"><p>Privacy policy pending legal review. No personal data collection form is enabled on this site.</p></section>';}
else if(path==="/terms-of-use"){title="Terms of Use";body=intro("LEGAL",title,"Website terms")+'<section class="wrap section"><p>Formal terms pending legal review.</p></section>';}
else if(path==="/legal-disclaimer"){title="Legal Disclaimer";body=intro("LEGAL",title,"Important information")+'<section class="wrap section"><p>Website information is general information, not legal advice. Visiting the site does not establish a lawyer-client relationship. Any engagement requires confirmation by the firm.</p></section>';}
else{title="Page not found";}
if(!body)body=intro("404",title,"This page does not exist.")+'<section class="wrap section">'+link("/","Return home")+'</section>';
document.title=title+" | Crest Crown Attorneys";
document.querySelector('meta[name="description"]').setAttribute("content",title+" — Crest Crown Attorneys. Nigerian legal services for national and international clients.");
document.getElementById("app").innerHTML='<a class="skip" href="#main">Skip to content</a><header><div class="wrap header"><a class="brand" href="/">CREST CROWN <span>ATTORNEYS</span></a><nav aria-label="Main navigation">'+nav.map(n=>link(n[1],n[0])).join('')+'</nav></div></header><main id="main">'+body+'</main><footer><div class="wrap"><strong>Crest Crown Attorneys</strong><p>Serving Nigerian legal needs nationwide and welcoming international enquiries.</p><div class="footerlinks">'+nav.map(n=>link(n[1],n[0])).join('')+link("/privacy-policy","Privacy")+link("/terms-of-use","Terms")+link("/legal-disclaimer","Disclaimer")+'</div><small>Information on this website does not constitute legal advice.</small></div></footer>';


// Published custom sections are fetched from Cloudflare D1 and rendered as text,
// never injected as HTML. The admin may create sections for any supported page.
(async function loadPublishedSections(){
 try{
  const response=await fetch('/api/sections?page='+encodeURIComponent(path),{credentials:'omit'});
  if(!response.ok)return;
  const data=await response.json();
  if(!Array.isArray(data.sections)||!data.sections.length)return;
  const target=document.createElement('section');
  target.className='wrap section';
  target.setAttribute('aria-label','Additional information');
  for(const item of data.sections){
   const article=document.createElement('article');article.className='card';article.style.marginBottom='20px';
   const heading=document.createElement('h2');heading.textContent=item.title;
   const text=document.createElement('p');text.textContent=item.body;text.style.whiteSpace='pre-wrap';
   article.append(heading,text);target.append(article);
  }
  document.querySelector('main')?.append(target);
 }catch(error){console.warn('Custom content unavailable',error)}
})();


// Cloudflare D1 CMS entries: pages, legal practices, team and articles.
(async function renderPublishedCMS(){
 try{
  const response=await fetch('/api/content');
  if(!response.ok)return;
  const {entries=[]}=await response.json();
  const routes={page:'',practice:'/practice-areas/',team:'/team/',post:'/insights/'};
  const match=entries.find(e=>e.kind==='page'&&('/'+e.slug)===path||e.kind==='practice'&&'/practice-areas/'+e.slug===path||e.kind==='team'&&'/team/'+e.slug===path||e.kind==='post'&&'/insights/'+e.slug===path);
  const main=document.querySelector('main');if(!main)return;
  if(match){
   main.replaceChildren();
   const section=document.createElement('section');section.className='wrap section';
   const h=document.createElement('h1');h.textContent=match.title;
   const lead=document.createElement('p');lead.className='lead';lead.textContent=match.summary;
   section.append(h,lead);
   if(match.image_url){const image=document.createElement('img');image.src=match.image_url;image.alt=match.title;image.loading='lazy';image.style.maxWidth='100%';section.append(image)}
   const body=document.createElement('p');body.textContent=match.body;body.style.whiteSpace='pre-wrap';section.append(body);main.append(section);
   document.title=(match.seo_title||match.title)+' | Crest Crown Attorneys';
   document.querySelector('meta[name="description"]').content=match.seo_description||match.summary||match.title;
   return;
  }
  const kinds=path==='/practice-areas'?['practice']:path==='/team'?['team']:path==='/insights'?['post']:[];
  if(!kinds.length)return;
  const items=entries.filter(e=>kinds.includes(e.kind));if(!items.length)return;
  const section=document.createElement('section');section.className='wrap section';
  const h=document.createElement('h2');h.textContent='Latest '+(kinds[0]==='post'?'Articles':kinds[0]==='team'?'Team Profiles':'Practice Areas');section.append(h);
  const grid=document.createElement('div');grid.className='grid';
  for(const entry of items){const article=document.createElement('article');article.className='card';const heading=document.createElement('h3');const a=document.createElement('a');a.href=routes[entry.kind]+entry.slug;a.textContent=entry.title;heading.append(a);const p=document.createElement('p');p.textContent=entry.summary;article.append(heading,p);grid.append(article)}
  section.append(grid);main.append(section);
 }catch(e){console.warn('Content unavailable',e)}
})();

// Enquiry form is only enabled when the D1-backed endpoint is available.
if(path==='/contact'||path==='/consultation'){
 const section=document.createElement('section');section.className='wrap section';
 const h=document.createElement('h2');h.textContent='General enquiry';section.append(h);
 const note=document.createElement('p');note.textContent='Please do not submit confidential or sensitive case details. Sending an enquiry does not establish a lawyer-client relationship.';section.append(note);
 const form=document.createElement('form');form.innerHTML='<label>Name <input name="name" required minlength="2" maxlength="100"></label><label>Email <input name="email" type="email" required maxlength="200"></label><label>Subject <input name="topic" required maxlength="120"></label><label>Message <textarea name="message" required minlength="10" maxlength="3000"></textarea></label><input name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px"><button type="submit">Send general enquiry</button><p role="status"></p>';
 form.addEventListener('submit',async event=>{event.preventDefault();const button=form.querySelector('button'),status=form.querySelector('[role="status"]');button.disabled=true;try{const body=Object.fromEntries(new FormData(form));body.turnstileToken=window.turnstile?.getResponse?.(widgetId)||'';const response=await fetch('/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!response.ok)throw Error('Enquiry service unavailable. Please use a verified official contact channel.');form.reset();status.textContent='Enquiry received. This is not confirmation of legal representation.'}catch(e){status.textContent=e.message}finally{button.disabled=false}});
 section.append(form);document.querySelector('main')?.append(section);
 let widgetId;const submit=form.querySelector('button');submit.disabled=true;
 fetch('/api/public-config').then(r=>r.json()).then(({turnstileSiteKey})=>{if(!turnstileSiteKey)throw Error('Enquiry verification not configured');const slot=document.createElement('div');form.insertBefore(slot,submit);const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;script.onload=()=>{widgetId=window.turnstile.render(slot,{sitekey:turnstileSiteKey,callback:()=>{submit.disabled=false},'expired-callback':()=>{submit.disabled=true}})};document.head.append(script)}).catch(()=>{form.querySelector('[role="status"]').textContent='Enquiry form is not yet available. Please use the firm’s verified contact channels.'});
}
