/* V31 authoritative filters - uses classes because old CSS has display:block!important on labels */
(function(){
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const TARGETS=['txrow','strow','barow'];
  const ALL={service:'كل الخدمات',status:'كل الحالات',customer:'كل العملاء',supplier:'كل الموردين',agent:'كل الوكلاء',office:'كل المكاتب',sale:'الكل',visa_type:'كل الأنواع',remain:'الكل',currency:'كل العملات',activity:'الكل'};
  const PART={service:'الخدمات المحددة فقط',status:'الحالات المحددة فقط',customer:'العملاء المحددون فقط',supplier:'الموردون المحددون فقط',agent:'الوكلاء المحددون فقط',office:'المكاتب المحددة فقط',sale:'المحدد فقط',visa_type:'الأنواع المحددة فقط',remain:'المبالغ المحددة فقط',currency:'العملات المحددة فقط',activity:'نوع النشاط المحدد فقط'};
  const targetName=t=>String(t||'txrow').replace(/^\./,'');
  const boxes=t=>$$('.multi-filter-v16[data-target="'+targetName(t)+'"]');
  const box=(t,k)=>$('.multi-filter-v16[data-target="'+targetName(t)+'"][data-key="'+k+'"]');
  const k=b=>b?.dataset?.key||'';
  const isNoStatus=l=>l.classList.contains('no-status-label-v24')||l.classList.contains('v31-no-status');
  const rawLabels=b=>$$('label',b).filter(l=>!isNoStatus(l)&&!l.querySelector('input[data-all]'));
  const isShown=l=>!l.classList.contains('v31-force-hidden')&&!l.classList.contains('v31-search-hidden');
  const shownLabels=b=>rawLabels(b).filter(isShown);
  const activeChecks=b=>shownLabels(b).map(l=>l.querySelector('input[type="checkbox"]')).filter(c=>c&&!c.disabled);
  const vals=b=>activeChecks(b).filter(c=>c.checked).map(c=>String(c.value));
  const allInp=b=>$('input[data-all]',b);
  const allSel=b=>{const a=activeChecks(b);return a.length>0&&a.every(c=>c.checked)};
  const labelText=l=>(l.dataset.text||l.innerText||'').replace(/\s+/g,' ').trim();
  function syncButton(b){
    if(!b)return;
    const btn=$('.multi-label',b); if(!btn)return;
    const key=k(b); const a=activeChecks(b); btn.classList.remove('v31-empty','v31-part');
    if(key==='status'&&a.length===0){btn.textContent='لا توجد حالات لهذه المعاملات';btn.classList.add('v31-empty');return;}
    if(allSel(b)){btn.textContent=ALL[key]||'الكل';return;}
    const selected=shownLabels(b).filter(l=>{const c=l.querySelector('input[type="checkbox"]');return c&&c.checked&&!c.disabled}).map(labelText).filter(Boolean);
    if(key==='status'&&selected.length>0&&selected.length<=4){btn.textContent=selected.join('، ');btn.classList.add('v31-part');return;}
    btn.textContent=PART[key]||'المحدد فقط';btn.classList.add('v31-part');
  }
  function syncAll(b){const ai=allInp(b);if(ai){const a=activeChecks(b);ai.disabled=(k(b)==='status'&&a.length===0);ai.checked=a.length>0&&a.every(c=>c.checked);}syncButton(b)}
  function setLabelHidden(l,hidden){
    l.classList.toggle('v31-force-hidden',!!hidden);
    const c=l.querySelector('input[type="checkbox"]');
    if(c){c.disabled=!!hidden;if(hidden)c.checked=false;}
  }
  function showNoStatus(st,show){
    const n=$('.no-status-label-v24',st); if(!n)return;
    n.classList.toggle('v31-visible',!!show);
  }
  function selectedServices(t){
    const sb=box(t,'service'); if(!sb)return [];
    const a=activeChecks(sb); const selected=a.filter(c=>c.checked).map(c=>String(c.value));
    return (a.length>0&&selected.length===a.length)?[]:selected;
  }
  function updateStatus(t,reset=true){
    t=targetName(t); const st=box(t,'status'); if(!st)return;
    const sel=selectedServices(t); const allServices=sel.length===0; let count=0;
    rawLabels(st).forEach(l=>{
      const sid=String(l.dataset.service||'');
      const show=allServices||(sid!==''&&sel.includes(sid));
      setLabelHidden(l,!show);
      const c=l.querySelector('input[type="checkbox"]');
      if(show){count++; if(reset&&c)c.checked=true;}
    });
    showNoStatus(st,count===0);
    const ai=allInp(st); if(ai){ai.disabled=count===0;if(reset)ai.checked=count>0;}
    syncAll(st);
  }
  function pass(row,b){
    const key=k(b); const a=activeChecks(b); if(key==='status'&&a.length===0)return true;
    const selected=vals(b); if(selected.length===0||selected.length===a.length)return true;
    if(key==='remain'){
      if(selected.includes('all'))return true;
      return selected.includes(String(row.dataset.remain||'zero'));
    }
    if(key==='currency'&&row.classList.contains('txrow')){
      const remainBox=box('txrow','remain'); const rVals=remainBox?vals(remainBox):['all'];
      const filteringHas=rVals.includes('has')&&!rVals.includes('all')&&!rVals.includes('zero');
      const rowRemain=String(row.dataset.remain||'zero');
      const remainCurrencies=String(row.dataset.remainCurrencies||'').split(',').filter(Boolean);
      const txCurrency=String(row.dataset.currency||'1');
      if(filteringHas)return rowRemain==='has'&&selected.some(v=>remainCurrencies.includes(v));
      if(rowRemain==='has'&&remainCurrencies.length)return selected.some(v=>remainCurrencies.includes(v))||selected.includes(txCurrency);
      return selected.includes(txCurrency);
    }
    return selected.includes(String(row.dataset[key]??'0'));
  }
  function apply(t){
    t=targetName(t); const bs=boxes(t);
    $$('.'+t).forEach(row=>{
      let ok=row.dataset.searchHidden!=='1';
      if(ok){for(const b of bs){if(!pass(row,b)){ok=false;break;}}}
      row.classList.toggle('v31-row-hidden',!ok);
      row.style.display=ok?'':'none';
    });
    bs.forEach(syncAll);
  }
  window.multiFilterChanged=function(chk){
    const b=chk.closest('.multi-filter-v16'); if(!b)return;
    const t=targetName(b.dataset.target); const key=k(b);
    if(chk.hasAttribute('data-all'))activeChecks(b).forEach(c=>c.checked=chk.checked); else syncAll(b);
    if(key==='service')updateStatus(t,true);
    syncAll(b); const st=box(t,'status'); if(st)syncAll(st); apply(t);
  };
  window.filterRows=function(input,cls){
    cls=targetName(cls); const q=String(input.value||'').trim().toLowerCase();
    $$('.'+cls).forEach(r=>{r.dataset.searchHidden=(!q||r.innerText.toLowerCase().includes(q))?'0':'1'});
    if(TARGETS.includes(cls))apply(cls); else $$('.'+cls).forEach(r=>{r.style.display=r.dataset.searchHidden==='1'?'none':''});
  };
  window.filterMultiOptions=function(input){
    const b=input.closest('.multi-filter-v16'); if(!b)return; const q=String(input.value||'').trim().toLowerCase();
    rawLabels(b).forEach(l=>{const base=l.classList.contains('v31-force-hidden'); const match=!q||(l.dataset.text||l.innerText||'').toLowerCase().includes(q); l.classList.toggle('v31-search-hidden',base||!match);});
    const st=box(b.dataset.target||'txrow','status'); if(st)showNoStatus(st,activeChecks(st).length===0);
  };
  window.toggleMultiDrop=function(btn){
    const b=btn.closest('.multi-filter-v16'); if(!b)return;
    $$('.multi-filter-v16.open').forEach(x=>{if(x!==b)x.classList.remove('open')});
    b.classList.toggle('open');
    const inp=$('.multi-drop input',b); if(b.classList.contains('open')&&inp){inp.value='';filterMultiOptions(inp);setTimeout(()=>inp.focus(),20);}
  };
  window.resetV22Filters=function(t){
    t=targetName(t); boxes(t).forEach(b=>{rawLabels(b).forEach(l=>{l.classList.remove('v31-force-hidden','v31-search-hidden'); const c=l.querySelector('input[type="checkbox"]'); if(c){c.disabled=false;c.checked=true;}}); const ai=allInp(b); if(ai){ai.disabled=false;ai.checked=true;} showNoStatus(b,false); syncAll(b);});
    $$('.'+t).forEach(r=>{r.dataset.searchHidden='0';r.classList.remove('v31-row-hidden');r.style.display=''});
    updateStatus(t,true); apply(t);
  };
  window.applyV31Filters=apply;
  function init(){TARGETS.forEach(t=>{updateStatus(t,false);boxes(t).forEach(syncAll);apply(t);});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
