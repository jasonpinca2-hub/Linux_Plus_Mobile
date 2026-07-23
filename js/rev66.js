(function(){
  'use strict';
  var FAVORITES_KEY='linuxplus-v64-favorites';

  function readFavorites(){
    try{return JSON.parse(localStorage.getItem(FAVORITES_KEY)||'[]')||[];}catch(e){return [];}
  }
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function favoriteQuestions(){
    var ids=readFavorites();
    var byId={};
    (window.BANK||BANK||[]).forEach(function(q){byId[q.id]=q;});
    return ids.map(function(id){return byId[id];}).filter(Boolean);
  }
  function imageHtml(q){
    return (q.images||[]).map(function(src){return '<img class="q-image" src="'+esc(src)+'" alt="Question reference image">';}).join('');
  }
  function practiceHtml(includeAnswers){
    var qs=favoriteQuestions();
    var generated=new Date().toLocaleString();
    var questions=qs.map(function(q,i){
      var opts=(q.options||[]).map(function(o){return '<li><span class="bubble"></span><strong>'+esc(o.label)+'.</strong> '+esc(o.text)+'</li>';}).join('');
      return '<section class="question"><div class="q-meta">Favorite '+(i+1)+' of '+qs.length+' • Module '+esc(q.module)+': '+esc(q.moduleTitle)+'</div><h2>'+esc(q.stem)+'</h2>'+imageHtml(q)+'<ol>'+opts+'</ol><div class="notes"><strong>Notes:</strong><div></div><div></div></div></section>';
    }).join('');
    var answerKey='';
    if(includeAnswers){
      answerKey='<section class="answer-key"><h1>Answer Key</h1>'+qs.map(function(q,i){
        var correct=(q.options||[]).filter(function(o){return (q.correct||[]).indexOf(o.label)>=0;}).map(function(o){return '<strong>'+esc(o.label)+'.</strong> '+esc(o.text);}).join('<br>');
        return '<div class="answer"><span>'+(i+1)+'.</span><div>'+correct+'</div></div>';
      }).join('')+'</section>';
    }
    return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Linux+ Favorites Practice Sheet</title><style>'+printCss()+'</style></head><body><header><h1>Linux+ XK0-006 Favorites Practice Sheet</h1><p>'+qs.length+' saved question'+(qs.length===1?'':'s')+' • Generated '+esc(generated)+'</p><p class="instructions">Select the best answer. Questions marked “Choose two” require every correct choice and no extras.</p></header>'+questions+answerKey+'<footer>Linux+ XK0-006 Certification Trainer • Rev 6.6</footer></body></html>';
  }
  function printCss(){return '@page{margin:.55in}*{box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;color:#111;line-height:1.4;margin:0;max-width:900px;margin:auto}header{border-bottom:3px solid #111;margin-bottom:24px}header h1{font-size:25px;margin:0 0 5px}header p{margin:4px 0}.instructions{font-size:13px}.question{break-inside:avoid;page-break-inside:avoid;border-bottom:1px solid #bbb;padding:0 0 22px;margin:0 0 24px}.q-meta{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:#444}.question h2{font-size:17px;margin:8px 0 12px}.question ol{list-style:none;padding:0;margin:0}.question li{margin:8px 0;padding-left:28px;position:relative}.bubble{position:absolute;left:0;top:2px;width:16px;height:16px;border:1.8px solid #111;border-radius:50%}.q-image{display:block;max-width:100%;max-height:320px;margin:10px auto 14px}.notes{font-size:12px;margin-top:14px}.notes div{height:20px;border-bottom:1px solid #aaa}.answer-key{page-break-before:always}.answer-key h1{border-bottom:3px solid #111;padding-bottom:8px}.answer{display:grid;grid-template-columns:34px 1fr;gap:6px;margin:10px 0;padding-bottom:10px;border-bottom:1px solid #ddd}.answer>span{font-weight:700}footer{font-size:10px;color:#666;text-align:center;margin-top:24px}@media print{.question{break-inside:avoid}.answer-key{break-before:page}}';}
  function ensureFavorites(){
    var qs=favoriteQuestions();
    if(!qs.length){
      if(window.setStartupStatus)setStartupStatus('Save at least one question as a favorite before printing.','error');
      else alert('Save at least one question as a favorite before printing.');
      return false;
    }
    return true;
  }
  function openPrint(includeAnswers){
    if(!ensureFavorites())return;
    var win=window.open('','_blank');
    if(!win){alert('Pop-up blocked. Allow pop-ups for this page, then try again.');return;}
    win.document.open();win.document.write(practiceHtml(includeAnswers));win.document.close();
    win.onload=function(){setTimeout(function(){win.focus();win.print();},250);};
  }
  function downloadHtml(includeAnswers){
    if(!ensureFavorites())return;
    var blob=new Blob([practiceHtml(includeAnswers)],{type:'text/html;charset=utf-8'});
    var url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='Linux_Plus_Favorites_Practice_Sheet_Rev6.6.html';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},1000);
  }
  function showExportDialog(){
    if(!ensureFavorites())return;
    var existing=document.getElementById('favoritesExportDialog');if(existing)existing.remove();
    var wrap=document.createElement('div');wrap.id='favoritesExportDialog';wrap.className='export-dialog-backdrop';
    wrap.innerHTML='<div class="export-dialog" role="dialog" aria-modal="true" aria-labelledby="exportTitle"><h2 id="exportTitle">Favorites Practice Sheet</h2><p>Create a clean practice worksheet from all questions saved to Favorites.</p><label class="export-check"><input type="checkbox" id="includeFavoriteAnswers"> Include answer key</label><div class="export-count">'+favoriteQuestions().length+' favorite question'+(favoriteQuestions().length===1?'':'s')+' ready</div><div class="export-actions"><button class="btn primary" id="printFavoritesNow">Print / Save as PDF</button><button class="btn" id="downloadFavoritesNow">Download HTML</button><button class="btn" id="cancelFavoritesExport">Cancel</button></div></div>';
    document.body.appendChild(wrap);
    function answerSetting(){return document.getElementById('includeFavoriteAnswers').checked;}
    document.getElementById('printFavoritesNow').onclick=function(){openPrint(answerSetting());};
    document.getElementById('downloadFavoritesNow').onclick=function(){downloadHtml(answerSetting());};
    document.getElementById('cancelFavoritesExport').onclick=function(){wrap.remove();};
    wrap.onclick=function(e){if(e.target===wrap)wrap.remove();};
  }
  document.addEventListener('DOMContentLoaded',function(){
    var b=document.getElementById('favoritesPrintBtn');if(b)b.onclick=showExportDialog;
  });
  window.LP66={showFavoritesExport:showExportDialog,practiceHtml:practiceHtml};
})();
