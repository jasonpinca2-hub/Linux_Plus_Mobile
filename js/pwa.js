(function(){
  var installPrompt=null;
  var installBtn=document.getElementById('installBtn');
  var msg=document.getElementById('pwaMessage');
  var banner=document.getElementById('pwaBanner');
  var standalone=(window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches)||window.navigator.standalone===true;
  if(standalone){ if(msg)msg.textContent='Installed and ready for offline study.'; if(installBtn)installBtn.classList.add('hidden'); }
  if('serviceWorker' in navigator && location.protocol.indexOf('http')===0){
    window.addEventListener('load',function(){
      navigator.serviceWorker.register('./service-worker.js').then(function(){
        if(msg&&!standalone)msg.textContent='Offline support ready. On iPhone: Share → Add to Home Screen.';
      }).catch(function(err){ if(msg)msg.textContent='Online mode active. Offline setup failed: '+err.message; });
    });
  } else if(location.protocol==='file:'){
    if(msg)msg.textContent='PWA features require an HTTPS website. Use the included deployment guide.';
  }
  window.addEventListener('beforeinstallprompt',function(e){
    e.preventDefault(); installPrompt=e;
    if(installBtn)installBtn.classList.remove('hidden');
  });
  if(installBtn){installBtn.addEventListener('click',function(){
    if(!installPrompt)return;
    installPrompt.prompt();
    installPrompt.userChoice.then(function(){installPrompt=null;installBtn.classList.add('hidden');});
  });}
  window.addEventListener('appinstalled',function(){if(msg)msg.textContent='Installed successfully. The trainer is available offline.';});
})();
