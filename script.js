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
