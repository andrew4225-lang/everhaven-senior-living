const menu=document.getElementById('menu');
const nav=document.getElementById('nav');
if(menu&&nav){
  menu.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    menu.setAttribute('aria-expanded',String(open));
    menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');
    menu.textContent=open?'×':'☰';
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    nav.classList.remove('open');
    menu.textContent='☰';
    menu.setAttribute('aria-expanded','false');
    menu.setAttribute('aria-label','Open navigation');
  }));
}
const year=document.getElementById('year');
if(year)year.textContent=new Date().getFullYear();

const form=document.getElementById('contactForm');
if(form){
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    if(!form.reportValidity())return;
    const msg=document.getElementById('formMessage');
    const button=form.querySelector('button[type="submit"]');
    const originalButton=button.innerHTML;
    const value=id=>(document.getElementById(id)?.value||'').trim();
    button.disabled=true;
    button.innerHTML='Sending…';
    msg.textContent='Sending your message securely. Please wait.';
    msg.classList.add('form-message-visible');
    try{
      const response=await fetch('https://rpzmjiiomgjttjjrkkqf.supabase.co/rest/v1/everhaven_inquiries',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'apikey':'sb_publishable_Lwcv2EAfLV4gAn51_JtlVA_iEEimZIi',
          'Authorization':'Bearer sb_publishable_Lwcv2EAfLV4gAn51_JtlVA_iEEimZIi',
          'Prefer':'return=minimal'
        },
        body:JSON.stringify({
          inquiry_type:document.getElementById('interest').value,
          full_name:value('name'),
          email:value('email'),
          phone:value('phone'),
          message:value('message')
        })
      });
      if(!response.ok)throw new Error(await response.text());
      msg.textContent='Thank you for reaching out. Your message has been submitted to Everhaven for review. Everhaven is still in planning and is not yet accepting residents or offering care services.';
      form.reset();
    }catch(error){
      console.error('Everhaven inquiry failed:',error);
      msg.textContent='We could not send your message right now. Please try again later.';
    }finally{
      button.disabled=false;
      button.innerHTML=originalButton;
    }
  });
}
const communityForm=document.getElementById('communityForm');
if(communityForm){
  communityForm.addEventListener('submit',async event=>{
    event.preventDefault();
    if(!communityForm.reportValidity())return;
    const button=communityForm.querySelector('button[type="submit"]');
    const status=document.getElementById('communityStatus');
    const original=button.innerHTML;
    const get=id=>(document.getElementById(id)?.value||'').trim();
    button.disabled=true;
    button.textContent='Sending…';
    status.textContent='Sending your message securely. Please wait.';
    try{
      const kind=get('communityType');
      const topic=get('communityTopic');
      const body='['+kind+' | '+topic+'] '+get('communityMessage');
      const response=await fetch('https://rpzmjiiomgjttjjrkkqf.supabase.co/rest/v1/everhaven_inquiries',{
        method:'POST',
        headers:{'Content-Type':'application/json','apikey':'sb_publishable_Lwcv2EAfLV4gAn51_JtlVA_iEEimZIi','Authorization':'Bearer sb_publishable_Lwcv2EAfLV4gAn51_JtlVA_iEEimZIi','Prefer':'return=minimal'},
        body:JSON.stringify({inquiry_type:'general',full_name:get('communityName')||'Community visitor',email:get('communityEmail')||'no-reply@everhaven.invalid',phone:'',message:body})
      });
      if(!response.ok)throw new Error(await response.text());
      status.textContent='Thank you for sharing your voice. Your message has been submitted to Everhaven for review.';
      communityForm.reset();
    }catch(error){
      console.error('Everhaven community message failed:',error);
      status.textContent='We could not send your message right now. Please try again later.';
    }finally{button.disabled=false;button.innerHTML=original;}
  });
}

const expectationsForm=document.getElementById('expectationsForm');
if(expectationsForm){
  expectationsForm.addEventListener('submit',async event=>{
    event.preventDefault();
    if(!expectationsForm.reportValidity())return;
    const groups=['priority','amenities','activities','communication','atmosphere'];
    const answers={};
    groups.forEach(group=>{
      answers[group]=Array.from(expectationsForm.querySelectorAll('input[name="'+group+'"]:checked')).map(input=>input.value);
    });
    answers.most_important_promise=expectationsForm.querySelector('input[name="promise"]:checked')?.value||'Not selected';
    if(!groups.some(group=>answers[group].length)||answers.most_important_promise==='Not selected'){
      document.getElementById('expectationsStatus').textContent='Please select at least one answer in the survey before submitting.';
      return;
    }
    const button=expectationsForm.querySelector('button[type="submit"]');
    const status=document.getElementById('expectationsStatus');
    const original=button.innerHTML;
    const get=id=>(document.getElementById(id)?.value||'').trim();
    const summary='Everhaven expectations survey\\n'+JSON.stringify(answers,null,2)+'\\nAdditional thought: '+(get('expectationOther')||'None');
    button.disabled=true;button.textContent='Submitting…';status.textContent='Submitting your answers securely. Please wait.';
    try{
      const response=await fetch('https://rpzmjiiomgjttjjrkkqf.supabase.co/rest/v1/everhaven_inquiries',{
        method:'POST',
        headers:{'Content-Type':'application/json','apikey':'sb_publishable_Lwcv2EAfLV4gAn51_JtlVA_iEEimZIi','Authorization':'Bearer sb_publishable_Lwcv2EAfLV4gAn51_JtlVA_iEEimZIi','Prefer':'return=minimal'},
        body:JSON.stringify({inquiry_type:'general',full_name:get('expectationName')||'Anonymous survey participant',email:get('expectationEmail')||'no-reply@everhaven.invalid',phone:'',message:summary})
      });
      if(!response.ok)throw new Error(await response.text());
      status.textContent='Thank you. Your answers have been submitted and will help inform Everhaven’s planning.';
      expectationsForm.reset();
    }catch(error){
      console.error('Everhaven expectations survey failed:',error);
      status.textContent='We could not submit your answers right now. Please try again later.';
    }finally{button.disabled=false;button.innerHTML=original;}
  });
}

// Simple display preferences for readers who want larger type, stronger contrast, or less motion.
(()=>{
 const root=document.body;let enlarged=false;
 const smaller=document.getElementById('textSmaller'),larger=document.getElementById('textLarger');
 const contrast=document.getElementById('contrastToggle'),motion=document.getElementById('motionToggle');
 if(smaller)smaller.addEventListener('click',()=>{root.classList.remove('large-text');enlarged=false;larger?.setAttribute('aria-pressed','false');smaller.setAttribute('aria-pressed','true');});
 if(larger)larger.addEventListener('click',()=>{root.classList.add('large-text');enlarged=true;larger.setAttribute('aria-pressed','true');smaller?.setAttribute('aria-pressed','false');});
 if(contrast)contrast.addEventListener('click',()=>{const on=root.classList.toggle('high-contrast');contrast.setAttribute('aria-pressed',String(on));});
 if(motion)motion.addEventListener('click',()=>{const on=root.classList.toggle('reduce-motion');motion.setAttribute('aria-pressed',String(on));});
})();

/* Everhaven private account and message portal */
(()=>{
 const endpoint='https://rpzmjiiomgjttjjrkkqf.supabase.co';
 const anon='sb_publishable_Lwcv2EAfLV4gAn51_JtlVA_iEEimZIi';
 const admin='5d996135-2257-40a4-a306-46ff71388330';
 const $=id=>document.getElementById(id);
 const authBox=$('portalAuth'),work=$('portalWorkspace'),authForm=$('portalAuthForm');
 if(!authBox||!work||!authForm)return;
 let mode='login',session=null;
 const headers=(token,extra={})=>({'apikey':anon,'Authorization':'Bearer '+token,'Content-Type':'application/json',...extra});
 const status=(id,msg)=>$(id).textContent=msg;
 const switchMode=m=>{
  mode=m; $('portalLoginTab').classList.toggle('active',m==='login');$('portalSignupTab').classList.toggle('active',m==='signup');
  $('portalName').hidden=m!=='signup';$('portalNameLabel').hidden=m!=='signup';$('portalType').hidden=m!=='signup';$('portalTypeLabel').hidden=m!=='signup';
  $('portalPassword').autocomplete=m==='signup'?'new-password':'current-password';$('portalAuthButton').textContent=m==='signup'?'Create private account ↗':'Sign in securely ↗';
  status('portalAuthStatus',m==='signup'?'Create an account with an email address you can access. Email confirmation may be required.':'Sign in with your registered email and password.');
 };
 const showSession=async data=>{
  session=data;localStorage.setItem('everhaven_portal_session',JSON.stringify(data));
  authBox.hidden=true;work.hidden=false;$('portalAccountEmail').textContent=data.user.email||'';
  const {data:profiles,error}=await fetch(endpoint+'/rest/v1/everhaven_portal_profiles?select=display_name,account_type&user_id=eq.'+encodeURIComponent(data.user.id),{headers:headers(data.access_token)}).then(async r=>({data:await r.json(),error:r.ok?null:true}));
  const profile=Array.isArray(profiles)?profiles[0]:null;
  $('portalWelcome').textContent='Welcome'+(profile?.display_name?' , '+profile.display_name:'');
  $('portalWorkspaceStatus').textContent='Signed in. Loading your private conversation…';
  await loadMessages();
 };
 const clearSession=()=>{session=null;localStorage.removeItem('everhaven_portal_session');work.hidden=true;authBox.hidden=false;};
 const loadMessages=async()=>{
  if(!session)return;
  const box=$('portalMessages');box.textContent='Loading your messages…';
  try{
   const r=await fetch(endpoint+'/rest/v1/everhaven_portal_messages?select=id,from_user_id,to_user_id,subject,body,created_at,read_at&or=(from_user_id.eq.'+session.user.id+',to_user_id.eq.'+session.user.id+')&order=created_at.desc&limit=100',{headers:headers(session.access_token)});
   if(!r.ok)throw new Error(await r.text());
   const rows=await r.json();box.replaceChildren();
   if(!rows.length){box.textContent='No messages yet. Send a private message to start a conversation.';return;}
   rows.forEach(row=>{
    const card=document.createElement('article');card.className='portal-message';
    const meta=document.createElement('small');meta.textContent=(row.from_user_id===session.user.id?'You sent':'Everhaven sent')+' · '+new Date(row.created_at).toLocaleString();
    const title=document.createElement('h4');title.textContent=row.subject;
    const body=document.createElement('p');body.textContent=row.body;
    card.append(meta,title,body);
    if(session.user.id===admin&&row.from_user_id!==admin){
     const reply=document.createElement('button');reply.type='button';reply.className='portal-text-button';reply.textContent='Reply to this message';
     reply.addEventListener('click',()=>{$('portalSubject').value='Re: '+row.subject;$('portalBody').value='';$('portalMessageForm').dataset.replyto=row.from_user_id;$('portalMessageForm').scrollIntoView({behavior:'smooth',block:'center'});$('portalBody').focus();});card.append(reply);
    }
    box.append(card);
   });
   status('portalWorkspaceStatus','Your private conversation is loaded. Messages are restricted to the sender and intended recipient.');
  }catch(e){console.error(e);box.textContent='We could not load your messages. Please sign in again.';}
 };
 $('portalLoginTab').addEventListener('click',()=>switchMode('login'));
 $('portalSignupTab').addEventListener('click',()=>switchMode('signup'));
 authForm.addEventListener('submit',async e=>{
  e.preventDefault();const button=$('portalAuthButton');button.disabled=true;status('portalAuthStatus',mode==='signup'?'Creating your account…':'Signing in…');
  try{
   const email=$('portalEmail').value.trim(),password=$('portalPassword').value;
   const r=await fetch(endpoint+'/auth/v1/'+(mode==='signup'?'signup':'token?grant_type=password'),{method:'POST',headers:headers(anon),body:JSON.stringify({email,password,...(mode==='signup'?{data:{display_name:$('portalName').value.trim(),account_type:$('portalType').value}}:{})})});
   const data=await r.json();if(!r.ok)throw new Error(data.msg||data.message||data.error_description||'Please check your email and password.');
   if(mode==='signup'){
    if(!data.access_token){status('portalAuthStatus','Account request received. Check your email for a confirmation link, then return here to sign in.');return;}
    const profile=await fetch(endpoint+'/rest/v1/everhaven_portal_profiles',{method:'POST',headers:headers(data.access_token,{Prefer:'resolution=merge-duplicates,return=minimal'}),body:JSON.stringify({user_id:data.user.id,display_name:$('portalName').value.trim(),account_type:$('portalType').value})});
    if(!profile.ok)throw new Error('Your login was created, but your profile could not be saved. Please sign in and contact the team.');
   }
   await showSession(data);
  }catch(err){status('portalAuthStatus',err.message||'Something went wrong. Please try again.');}
  finally{button.disabled=false;}
 });
 $('portalForgot').addEventListener('click',async()=>{
  const email=$('portalEmail').value.trim();if(!email){status('portalAuthStatus','Enter your email address first, then tap Forgot password again.');return;}
  status('portalAuthStatus','Requesting a password reset…');
  try{const r=await fetch(endpoint+'/auth/v1/recover',{method:'POST',headers:headers(anon),body:JSON.stringify({email,redirect_to:location.origin+'/reset-password.html'})});if(!r.ok)throw new Error(await r.text());status('portalAuthStatus','If that account exists, a password reset email will arrive. Check your inbox.');}
  catch(e){status('portalAuthStatus',e.message);}
 });
 $('portalSignOut').addEventListener('click',async()=>{if(session)await fetch(endpoint+'/auth/v1/logout',{method:'POST',headers:headers(session.access_token)}).catch(()=>{});clearSession();});
 $('portalMessageForm').addEventListener('submit',async e=>{
  e.preventDefault();if(!session)return;
  const button=e.currentTarget.querySelector('button');button.disabled=true;status('portalWorkspaceStatus','Sending your private message…');
  try{
   const target=e.currentTarget.dataset.replyto||admin;
   const r=await fetch(endpoint+'/rest/v1/everhaven_portal_messages',{method:'POST',headers:headers(session.access_token,{Prefer:'return=minimal'}),body:JSON.stringify({from_user_id:session.user.id,to_user_id:target,subject:$('portalSubject').value.trim(),body:$('portalBody').value.trim()})});
   if(!r.ok)throw new Error(await r.text());
   $('portalSubject').value='';$('portalBody').value='';delete e.currentTarget.dataset.replyto;status('portalWorkspaceStatus','Message sent. Your private conversation has been updated.');await loadMessages();
  }catch(err){status('portalWorkspaceStatus','Message not sent: '+err.message);}
  finally{button.disabled=false;}
 });
 try{const saved=JSON.parse(localStorage.getItem('everhaven_portal_session')||'null');if(saved?.access_token&&saved?.user?.id){const r=await fetch(endpoint+'/auth/v1/user',{headers:headers(saved.access_token)});if(r.ok){const user=await r.json();saved.user=user;await showSession(saved);}else clearSession();}}catch(e){clearSession();}
})();
