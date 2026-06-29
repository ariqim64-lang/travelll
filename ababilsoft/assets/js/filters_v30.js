/* V30 authoritative filters loaded AFTER app.js */
(function(){
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const FILTER_TARGETS=['txrow','strow','barow'];
  const ALL={service:'كل الخدمات',status:'كل الحالات',customer:'كل العملاء',supplier:'كل الموردين',agent:'كل الوكلاء',office:'كل المكاتب',sale:'الكل',visa_type:'كل الأنواع',remain:'الكل',currency:'كل العملات',activity:'الكل'};
  const PART={service:'الخدمات المحددة فقط',status:'الحالات المحددة فقط',customer:'العملاء المحددون فقط',supplier:'الموردون المحددون فقط',agent:'الوكلاء المحددون فقط',office:'المكاتب المحددة فقط',sale:'المحدد فقط',visa_type:'الأنواع المحددة فقط',remain:'المبالغ المحددة فقط',currency:'العملات المحددة فقط',activity:'نوع النشاط المحدد فقط'};
  function targetName(t){return (t||'txrow').replace(/^\./,'');}
  function boxes(t){return $$('.multi-filter-v16[data-target="'+targetName(t)+'"]');}
  function box(t,k){return $('.multi-filter-v16[data-target="'+targetName(t)+'"][data-key="'+k+'"]');}
  function key(b){return b?.dataset?.key||'';}
  function rawLabels(b){return $$('label',b).filter(l=>!l.classList.contains('no-status-label-v24') && !l.querySelector('input[data-all]'));}
  function isBaseVisible(l){return l.dataset.v30Hidden!=='1';}
  function visibleLabels(b){return rawLabels(b).filter(l=>isBaseVisible(l) && l.style.display!=='none');}
  function activeChecks(b){return visibleLabels(b).map(l=>l.querySelector('input[type="checkbox"]')).filter(c=>c && !c.disabled);}
  function values(b){return activeChecks(b).filter(c=>c.checked).map(c=>String(c.value));}
  function allSelected(b){const a=activeChecks(b); return a.length>0 && a.every(c=>c.checked);}
  function allInput(b){return $('input[data-all]',b);}
  function labelName(l){return (l.dataset.text||l.textContent||'').replace(/\s+/g,' ').trim();}
  function setButton(b){
    const btn=$('.multi-label',b); if(!btn)return; const k=key(b); btn.classList.remove('v30-empty','v30-part');
    const a=activeChecks(b);
    if(k==='status' && a.length===0){btn.textContent='لا توجد حالات لهذه المعاملات'; btn.classList.add('v30-empty'); return;}
    if(allSelected(b)){btn.textContent=ALL[k]||'الكل'; return;}
    const selected=visibleLabels(b).filter(l=>{const c=l.querySelector('input[type="checkbox"]');return c&&c.checked&&!c.disabled;}).map(labelName).filter(Boolean);
    if(k==='status' && selected.length>0 && selected.length<=3){btn.textContent=selected.join('، '); btn.classList.add('v30-part'); return;}
    btn.textContent=PART[k]||'المحدد فقط'; btn.classList.add('v30-part');
  }
  function syncAll(b){const all=allInput(b); if(all){const a=activeChecks(b); all.disabled=(key(b)==='status'&&a.length===0); all.checked=a.length>0 && a.every(c=>c.checked);} setButton(b);}
  function hideBase(l,hide){l.dataset.v30Hidden=hide?'1':'0'; l.style.display=hide?'none':'block'; const c=l.querySelector('input[type="checkbox"]'); if(c){c.disabled=hide; if(hide)c.checked=false;}}
  function selectedServiceValues(t){const sb=box(t,'service'); if(!sb)return []; const a=activeChecks(sb); const selected=a.filter(c=>c.checked).map(c=>String(c.value)); return (a.length>0 && selected.length===a.length)?[]:selected;}
  function updateStatus(t, resetChecked){
    t=targetName(t); const st=box(t,'status'); if(!st)return; const svc=selectedServiceValues(t); const allServices=svc.length===0; let count=0;
    rawLabels(st).forEach(l=>{const sid=String(l.dataset.service||''); const show=allServices || (sid!=='' && svc.includes(sid)); hideBase(l,!show); const c=l.querySelector('input[type="checkbox"]'); if(show){count++; if(resetChecked && c)c.checked=true;}});
    const note=$('.no-status-label-v24',st); if(note) note.style.display=count===0?'block':'none';
    const ai=allInput(st); if(ai){ai.disabled=count===0; if(resetChecked) ai.checked=count>0;}
    syncAll(st);
  }
  function passBox(row,b){
    const k=key(b); const a=activeChecks(b); if(k==='status'&&a.length===0)return true; const vals=values(b); if(vals.length===0 || vals.length===a.length)return true;
    if(k==='remain'){
      if(vals.includes('all'))return true;
      const rv=String(row.dataset.remain||'zero'); return vals.includes(rv);
    }
    if(k==='currency' && row.classList.contains('txrow')){
      const remBox=box('txrow','remain'); const remVals=remBox?values(remBox):['all'];
      const onlyHas=remVals.includes('has') && !remVals.includes('all') && !remVals.includes('zero');
      const rowRemain=String(row.dataset.remain||'zero');
      const remainCurrencies=String(row.dataset.remainCurrencies||'').split(',').filter(Boolean);
      const txCurrency=String(row.dataset.currency||'1');
      if(onlyHas){return rowRemain==='has' && vals.some(v=>remainCurrencies.includes(String(v)));}
      if(rowRemain==='has' && remainCurrencies.length){return vals.some(v=>remainCurrencies.includes(String(v))) || vals.includes(txCurrency);}
      return vals.includes(txCurrency);
    }
    const rv=String(row.dataset[k]??'0'); return vals.includes(rv);
  }
  function apply(t){t=targetName(t); const bs=boxes(t); $$('.'+t).forEach(row=>{let ok=row.dataset.searchHidden!=='1'; if(ok){for(const b of bs){if(!passBox(row,b)){ok=false;break;}}} row.style.display=ok?'':'none';}); bs.forEach(syncAll);}
  window.multiFilterChanged=function(chk){
    const b=chk.closest('.multi-filter-v16'); if(!b)return; const t=targetName(b.dataset.target); const k=key(b);
    if(chk.hasAttribute('data-all')) activeChecks(b).forEach(c=>c.checked=chk.checked); else syncAll(b);
    if(k==='service') updateStatus(t,true);
    syncAll(b); const st=box(t,'status'); if(st)syncAll(st); apply(t);
  };
  window.filterRows=function(input,cls){cls=targetName(cls); const q=String(input.value||'').trim().toLowerCase(); $$('.'+cls).forEach(row=>{row.dataset.searchHidden=(!q || row.innerText.toLowerCase().includes(q))?'0':'1';}); if(FILTER_TARGETS.includes(cls))apply(cls); else $$('.'+cls).forEach(row=>row.style.display=row.dataset.searchHidden==='1'?'none':'');};
  window.filterMultiOptions=function(input){const b=input.closest('.multi-filter-v16'); if(!b)return; const q=String(input.value||'').trim().toLowerCase(); rawLabels(b).forEach(l=>{if(l.dataset.v30Hidden==='1'){l.style.display='none';return;} const text=(l.dataset.text||l.innerText||'').toLowerCase(); l.style.display=(!q||text.includes(q))?'block':'none';}); const note=$('.no-status-label-v24',b); if(note&&key(b)==='status') note.style.display=activeChecks(b).length===0?'block':'none';};
  window.resetV22Filters=function(t){t=targetName(t); boxes(t).forEach(b=>{rawLabels(b).forEach(l=>{hideBase(l,false); const c=l.querySelector('input[type="checkbox"]'); if(c){c.disabled=false;c.checked=true;}}); const ai=allInput(b); if(ai){ai.disabled=false;ai.checked=true;} const note=$('.no-status-label-v24',b); if(note)note.style.display='none'; syncAll(b);}); $$('.'+t).forEach(row=>{row.dataset.searchHidden='0'; row.style.display='';}); updateStatus(t,true); apply(t);};
  window.applyV30Filters=apply;
  function init(){FILTER_TARGETS.forEach(t=>{updateStatus(t,false); boxes(t).forEach(syncAll); apply(t);});}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
