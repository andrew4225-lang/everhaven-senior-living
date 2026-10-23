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
    button.disabled=true;
    button.innerHTML='Sending inquiry…';
    msg.textContent='Sending your inquiry securely. Please wait.';
    msg.classList.add('form-message-visible');
    try{
      const data=new FormData(form);
      data.append('_subject','New Everhaven Senior Living Website Inquiry');
      data.append('_template','table');
      data.append('_url',window.location.href);
      const response=await fetch('https://formsubmit.co/ajax/evergreenseniorlivingfacity@gmail.com',{
        method:'POST',
        headers:{'Accept':'application/json'},
        body:data
      });
      const result=await response.json();
      if(!response.ok||result.success===false)throw new Error(result.message||'Submission could not be completed.');
      msg.textContent='Thank you for contacting Everhaven. Your inquiry has been submitted. We appreciate your interest.';
      msg.classList.add('form-message-visible');
      form.reset();
    }catch(error){
      msg.textContent='We could not submit your inquiry right now. Please email evergreenseniorlivingfacity@gmail.com directly or try again in a moment.';
      msg.classList.add('form-message-visible');
    }finally{
      button.disabled=false;
      button.innerHTML=originalButton;
    }
  });
}