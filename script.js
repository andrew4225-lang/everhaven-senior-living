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
  const interest=document.getElementById('interest');
  const investorFields=document.getElementById('investorFields');
  const propertyFields=document.getElementById('propertyFields');
  const propertyLocation=document.getElementById('propertyLocation');
  const updateFields=()=>{
    const isInvestor=interest.value==='investor';
    const isProperty=interest.value==='property';
    investorFields.hidden=!isInvestor;
    propertyFields.hidden=!isProperty;
    propertyLocation.required=isProperty;
  };
  interest.addEventListener('change',updateFields);
  updateFields();

  form.addEventListener('submit',async e=>{
    e.preventDefault();
    if(!form.reportValidity())return;
    const msg=document.getElementById('formMessage');
    const button=form.querySelector('button[type="submit"]');
    const originalButton=button.innerHTML;
    button.disabled=true;
    button.innerHTML='Submitting…';
    msg.textContent='Securely submitting your inquiry. Please wait.';
    msg.classList.add('form-message-visible');

    const value=id=>(document.getElementById(id)?.value||'').trim();
    const type=interest.value;
    let table='everhaven_inquiries';
    let payload={
      inquiry_type:type,
      full_name:value('name'),
      email:value('email'),
      phone:value('phone'),
      message:value('message')
    };
    if(type==='investor'){
      table='everhaven_investor_leads';
      payload={
        full_name:value('name'),
        organization:value('organization'),
        email:value('email'),
        phone:value('phone'),
        interest:value('investorInterest'),
        message:value('message')
      };
    }else if(type==='property'){
      table='everhaven_property_leads';
      payload={
        contact_name:value('name'),
        email:value('email'),
        phone:value('phone'),
        property_location:value('propertyLocation'),
        property_type:value('propertyType'),
        asking_price:value('askingPrice'),
        details:value('message')
      };
    }
    try{
      const response=await fetch('https://rpzmjiiomgjttjjrkkqf.supabase.co/rest/v1/'+table,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'apikey':'sb_publishable_Lwcv2EAfLV4gAn51_JtlVA_iEEimZIi',
          'Authorization':'Bearer sb_publishable_Lwcv2EAfLV4gAn51_JtlVA_iEEimZIi',
          'Prefer':'return=minimal'
        },
        body:JSON.stringify(payload)
      });
      if(!response.ok){
        const detail=await response.text();
        throw new Error(detail||'Submission could not be completed.');
      }
      msg.textContent='Thank you. Your inquiry has been securely submitted to Everhaven for review. This is an expression of interest only; Everhaven is not yet accepting residents or offering care services.';
      msg.classList.add('form-message-visible');
      form.reset();
      updateFields();
    }catch(error){
      console.error('Everhaven inquiry submission failed:',error);
      msg.textContent='We could not submit your inquiry right now. Please try again later or contact the Everhaven team by email.';
      msg.classList.add('form-message-visible');
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
