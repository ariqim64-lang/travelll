
(function(){
  const qs=(s,r=document)=>r.querySelector(s), qsa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  window.reportMultiSubmit=function(el){const box=el.closest('.report-dd-v34'); if(!box)return; if(el.hasAttribute('data-all')) qsa('input[type="checkbox"]:not([data-all])',box).forEach(c=>c.checked=el.checked); setTimeout(()=>box.closest('form')?.submit(),60);};
  window.toggleReportColumnV34=function(scopeId,col,show){const scope=document.getElementById(scopeId)||document; qsa('[data-col="'+col+'"]',scope).forEach(el=>el.style.display=show?'':'none'); qsa('.preview-modal-v22 [data-col="'+col+'"]').forEach(el=>el.style.display=show?'':'none');};
  window.openReportPreviewV34=function(modalId,contentId){const m=qs('#'+modalId), c=qs('#'+contentId); if(!m||!c)return; const paper=qs('.a4-paper-v22',m); if(paper){paper.innerHTML='<div class="print-header-v33"><h2>'+ (qs('.page-title h2')?.textContent||'تقرير') +'</h2><p>تاريخ الطباعة: '+new Date().toLocaleString('ar')+'</p></div>'+c.cloneNode(true).outerHTML;} m.classList.remove('hidden');m.style.display='grid';};
})();
