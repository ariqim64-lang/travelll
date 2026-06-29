let dirty=false;
document.addEventListener('input',e=>{ if(e.target.closest('form')) dirty=true; calcVoucherLeft(); });
document.addEventListener('submit',e=>{if(e.defaultPrevented)return;const form=e.target;if(form&&form.dataset.confirmed!=='1'&&form.matches('form[data-v13-confirm]'))return;dirty=false;});
window.addEventListener('beforeunload',e=>{ if(dirty){ e.preventDefault(); e.returnValue='لديك بيانات غير محفوظة'; }});
const appNavKeyV52='ababil.nav.stack.v52';
const sideScrollKeyV52='ababil.sidebar.scroll.v52';
const sideCollapsedKeyV52='ababil.sidebar.collapsed.v52';
function currentAppPathV52(){return location.pathname+location.search+location.hash;}
function appPathFromUrlV52(url){try{const u=new URL(url,location.href);return u.origin===location.origin?(u.pathname+u.search+u.hash):'';}catch(e){return '';}}
function readNavStackV52(){try{const rows=JSON.parse(sessionStorage.getItem(appNavKeyV52)||'[]');return Array.isArray(rows)?rows.filter(Boolean):[];}catch(e){return [];}}
function writeNavStackV52(rows){try{sessionStorage.setItem(appNavKeyV52,JSON.stringify(rows.slice(-40)));}catch(e){}}
function initNavigationHistoryV52(){
  const cur=currentAppPathV52(); let rows=readNavStackV52();
  if(rows[rows.length-1]!==cur){
    if(rows.length>1 && rows[rows.length-2]===cur) rows.pop();
    else rows.push(cur);
    writeNavStackV52(rows);
  }
}
function previousAppPathV52(fallback){
  const cur=currentAppPathV52(); let rows=readNavStackV52();
  if(rows[rows.length-1]===cur) rows.pop();
  let prev='';
  while(rows.length){const p=rows.pop(); if(p&&p!==cur){prev=p;break;}}
  if(prev){rows.push(prev);writeNavStackV52(rows);return prev;}
  const ref=appPathFromUrlV52(document.referrer||''); if(ref&&ref!==cur)return ref;
  return appPathFromUrlV52(fallback||'')||fallback||'';
}
function smartBackV52(fallback){const target=previousAppPathV52(fallback);dirty=false;if(target)location.href=target;else if(history.length>1)history.back();}
function isInternalNavLinkV52(a){
  if(!a||a.target==='_blank'||a.hasAttribute('download'))return false;
  if(a.closest('.system-confirm-overlay-v13,.customer-modal-v16,.account-picker'))return false;
  const raw=a.getAttribute('href')||''; if(!raw||raw[0]==='#'||raw.startsWith('javascript:'))return false;
  const target=appPathFromUrlV52(raw); return !!target && target!==currentAppPathV52();
}
function isSmartBackLinkV52(a){
  if(!a||!isInternalNavLinkV52(a))return false;
  if(a.closest('.sidebar,.quickbar'))return false;
  const txt=(a.textContent||'').trim().replace(/\s+/g,' ');
  return a.classList.contains('doc-back-btn')||a.dataset.smartBack==='1'||txt==='رجوع'||txt==='عودة'||txt.startsWith('العودة');
}
function saveSidebarStateV52(){
  const sidebar=document.querySelector('.sidebar'); if(!sidebar)return;
  try{localStorage.setItem(sideScrollKeyV52,String(sidebar.scrollTop));localStorage.setItem(sideCollapsedKeyV52,document.body.classList.contains('sidebar-collapsed')?'1':'0');}catch(e){}
}
function initSidebarStateV52(){
  const sidebar=document.querySelector('.sidebar'); if(!sidebar)return;
  try{document.body.classList.toggle('sidebar-collapsed',localStorage.getItem(sideCollapsedKeyV52)==='1');}catch(e){}
  const restore=()=>{try{const y=parseInt(localStorage.getItem(sideScrollKeyV52)||'0',10); if(y>0)sidebar.scrollTop=y; else sidebar.querySelector('a.active')?.scrollIntoView({block:'center'});}catch(e){}};
  restore(); setTimeout(restore,80);
  sidebar.addEventListener('scroll',saveSidebarStateV52,{passive:true});
  sidebar.querySelectorAll('a').forEach(a=>a.addEventListener('click',saveSidebarStateV52));
}
function showSystemNoticeV52(title,msg,type){
  const old=document.querySelector('.system-notice-v52'); if(old)old.remove();
  const el=document.createElement('div'); el.className='system-notice-v52 '+(type||'success');
  el.innerHTML='<button type="button" class="notice-close">×</button><b></b><p></p>';
  el.querySelector('b').textContent=title||'تنبيه';
  el.querySelector('p').textContent=msg||'';
  el.querySelector('.notice-close').onclick=()=>el.remove();
  document.body.appendChild(el);
  setTimeout(()=>el.classList.add('show'),20);
  setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.remove(),220);},5200);
}
function showFlashAsSystemNoticeV52(){
  const flash=document.querySelector('.flash'); if(!flash)return;
  const msg=(flash.textContent||'').trim(); if(!msg)return;
  const type=flash.classList.contains('error')?'error':'success';
  flash.style.display='none';
  showSystemNoticeV52(type==='error'?'تنبيه':'تمت العملية',msg,type);
}
document.addEventListener('DOMContentLoaded',()=>{initNavigationHistoryV52();initSidebarStateV52();showFlashAsSystemNoticeV52();});
document.addEventListener('click',e=>{
  if(e.target.closest('[data-print]')) window.print();
  const hamb=e.target.closest('.hamb'); if(hamb){document.body.classList.toggle('sidebar-collapsed');saveSidebarStateV52();}
  const add=e.target.closest('[data-add-row]'); if(add){ addRow(add.dataset.addRow, add.dataset.target); }
  const del=e.target.closest('[data-del-row]'); if(del){ del.closest('tr,.rowline').remove(); dirty=true; calcVoucherLeft(); }
  const preset=e.target.closest('[data-journal-preset]'); if(preset){ applyJournalPreset(preset.dataset.journalPreset); }
});
document.addEventListener('click',async e=>{
  if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  const a=e.target.closest('a[href]'); if(!a||!isInternalNavLinkV52(a))return;
  const activeEdit=document.querySelector('.doc-view-form[data-editing="1"]');
  if(a.classList.contains('doc-back-btn')&&activeEdit)return;
  const smartBack=isSmartBackLinkV52(a);
  if(a.dataset.v13ConfirmedNav==='1'){delete a.dataset.v13ConfirmedNav;return;}
  const needsNavConfirm=!a.closest('[data-v13-no-nav-confirm]')&&a.dataset.v13NoNavConfirm!=='1';
  if(dirty||smartBack||needsNavConfirm){
    e.preventDefault();
    const msg=dirty?'لديك بيانات غير محفوظة. هل تريد مغادرة هذه الصفحة؟':(smartBack?'هل تريد الرجوع إلى الصفحة السابقة؟':'هل تريد الانتقال إلى هذه الصفحة؟');
    const ok=await systemConfirmV13(msg);
    if(!ok)return;
    dirty=false;
    if(smartBack) smartBackV52(a.href); else location.href=a.href;
    return;
  }
  if(smartBack){e.preventDefault();smartBackV52(a.href);}
});
function addRow(tplId,targetId){ const tpl=document.getElementById(tplId); const target=document.getElementById(targetId); if(tpl&&target){ target.appendChild(tpl.content.cloneNode(true)); dirty=true; calcVoucherLeft(); } }
function calcVoucherLeft(){ const total=document.querySelector('[name=amount_total]'); const out=document.getElementById('remaining_amount'); if(!total||!out)return; let sum=0; document.querySelectorAll('.split-amount').forEach(i=>sum+=parseFloat(i.value||0)); let left=parseFloat(total.value||0)-sum; out.textContent=left.toFixed(2); out.style.color=Math.abs(left)<0.001?'green':'#d9222a'; }
function filterRows(input,cls){ const v=input.value.trim(); document.querySelectorAll('.'+cls).forEach(r=>r.style.display=r.innerText.includes(v)?'':'none'); }
function applyJournalPreset(kind){ const d=document.querySelector('[name=description]'); if(!d)return; const texts={
  sar_yer:'مضاربة وتحويل من حساب سعودي إلى حساب يمني', yer_sar:'مضاربة وتحويل من حساب يمني إلى حساب سعودي', bank_bank:'تحويل من بنك إلى بنك', same_bank:'تحويل داخلي في نفس البنك', employee_cash:'توريد الموظف المبلغ من الصندوق إلى الصرافة', cash_bank:'تحويل من الصندوق إلى البنك'}; d.value=texts[kind]||''; dirty=true; }
function toggleAddCustomerBtn(v){const b=document.getElementById('quickAddCustomerBtn'); if(!b)return; b.classList.toggle('ready',(v||'').trim().length>2); const n=document.getElementById('newCustomerName'); if(n&&!n.value)n.value=v;}
function openCustomerBox(){const box=document.getElementById('customerAddBox'); if(box){box.style.display='block'; const s=document.getElementById('customerMainSearch'); const n=document.getElementById('newCustomerName'); if(s&&n)n.value=s.value;}}
function toggleCol(cls,show){document.querySelectorAll('.'+cls).forEach(e=>e.style.display=show?'':'none');}
function paginateRows(cls,limit){const rows=[...document.querySelectorAll('.'+cls)]; const pager=document.getElementById('custPager'); if(!pager)return; pager.innerHTML=''; if(limit==='all'){rows.forEach(r=>r.style.display='');return;} limit=parseInt(limit||50); let pages=Math.ceil(rows.length/limit); function show(p){rows.forEach((r,i)=>r.style.display=(i>=p*limit&&i<(p+1)*limit)?'':'none'); [...pager.children].forEach((b,i)=>b.classList.toggle('active',i===p));} for(let i=0;i<pages;i++){let b=document.createElement('button');b.textContent=i+1;b.onclick=()=>show(i);pager.appendChild(b);} show(0);}
function addRow(tplId,targetId){const tpl=document.getElementById(tplId); const target=document.getElementById(targetId); if(tpl&&target){target.appendChild(tpl.content.cloneNode(true));dirty=true;}}
CSS_FIX='';
function filterTableAdvanced(formSel,rowCls){const f=document.querySelector(formSel);if(!f)return;const vals=[...f.querySelectorAll('input,select')].map(i=>String(i.value||'').trim()).filter(Boolean);document.querySelectorAll('.'+rowCls).forEach(r=>{const txt=r.innerText; r.style.display=vals.every(v=>txt.includes(v))?'':'none';});}
document.addEventListener('DOMContentLoaded',()=>{const p=document.getElementById('custPager'); if(p&&typeof customerFilterAndPaginate==='function') customerFilterAndPaginate(); else if(p) paginateRows('custrow','50');});

function toggleBox(id,show){const el=document.getElementById(id); if(el) el.classList.toggle('hidden',!show);}
function togglePaymentFields(){const m=document.getElementById('paymentMethod'); if(!m)return; const isTransfer=m.value==='حوالة'; document.querySelectorAll('.payment-transfer').forEach(e=>e.classList.toggle('hidden',!isTransfer)); document.querySelectorAll('.payment-cash').forEach(e=>e.classList.toggle('hidden',isTransfer));}
function calcRemaining(){calcVoucherLeft();}
function calcVoucherFx(){const total=parseFloat(document.getElementById('voucherTotal')?.value||0);const paid=parseFloat(document.getElementById('paidAmount')?.value||0);const cur=document.getElementById('voucherCurrency')?.value;const paidCur=document.getElementById('paidCurrency')?.value;const rate=parseFloat(document.getElementById('exchangeRate')?.value||1);const out=document.getElementById('fxResult');if(!out)return;let converted=paid;if(cur!==paidCur){converted=rate>0?paid/rate:0;}let diff=converted-total;let status=Math.abs(diff)<0.01?'مكتمل':(diff>0?'زائد يرجع للعميل':'ناقص باقي على العميل');out.value='الناتج: '+converted.toFixed(2)+' | الفارق: '+diff.toFixed(2)+' | '+status;}
function fillVoucherStatement(sel){const opt=sel.selectedOptions&&sel.selectedOptions[0]; if(!opt)return; const name=opt.dataset.name||opt.textContent; const type=opt.dataset.type||''; const party=document.getElementById('voucherParty'); const desc=document.getElementById('voucherDescription'); if(party&&!party.value)party.value=name; if(desc&&!desc.value){const isReceipt=(document.querySelector('[name=type]')?.value||'قبض')==='قبض'; const label=type==='عميل'?'الأخ':'حساب'; desc.value=(isReceipt?'استلمنا من ':'صرفنا إلى ')+label+' / '+name+' مقابل دفعة من حساب المعاملة';}}
function expandAccountTree(show){document.querySelectorAll('.account-tree .tree-children').forEach(u=>u.classList.toggle('hidden',!show));document.querySelectorAll('.account-tree .tree-toggle').forEach(b=>{if(b.textContent!=='•')b.textContent=show?'-':'+';});}
function filterTree(v){v=(v||'').trim();document.querySelectorAll('.account-tree li').forEach(li=>{li.style.display=!v||li.innerText.includes(v)?'':'none';});}
document.addEventListener('click',e=>{const t=e.target.closest('.tree-toggle'); if(t&&t.textContent!=='•'){const li=t.closest('li'); const ul=li.querySelector(':scope > .tree-children'); if(ul){const will=ul.classList.contains('hidden'); ul.classList.toggle('hidden',!will); t.textContent=will?'-':'+';}}});
document.addEventListener('DOMContentLoaded',()=>{togglePaymentFields();calcVoucherFx();});

function currencyLabelByValue(v){return {1:'ريال يمني',2:'ريال سعودي',3:'دولار'}[String(v)]||'ريال سعودي';}
function refreshCurrencyMiniLabels(){document.querySelectorAll('[data-currency-mini]').forEach(box=>{const checked=box.querySelector('input:checked');const label=box.querySelector('[data-currency-label]');if(label&&checked)label.textContent=currencyLabelByValue(checked.value);});document.querySelectorAll('[data-price-preview]').forEach(prev=>{const field=prev.closest('.field');const input=field?.querySelector('input[type=number]');const checked=field?.querySelector('[data-currency-mini] input:checked');prev.textContent=(input&&input.value)?(input.value+' '+currencyLabelByValue(checked?.value||2)):'';});}
document.addEventListener('change',e=>{if(e.target.closest('[data-currency-mini]'))refreshCurrencyMiniLabels();});
document.addEventListener('input',e=>{if(e.target.closest('.price-inline'))refreshCurrencyMiniLabels();});
function toggleVisaStockBox(){const s=document.getElementById('transactionService');const box=document.getElementById('visaStockBox');if(!s||!box)return;const opt=s.selectedOptions&&s.selectedOptions[0];const name=(opt?.dataset.name||opt?.textContent||'').trim();const isVisa=name.includes('فيز')||name.includes('فيزا')||name.includes('تأشيرة')||name.includes('تاشيرة');box.classList.toggle('hidden',!isVisa);const sel=document.getElementById('visaStockSelect');if(sel)sel.required=isVisa;}
function showVisaDetails(sel){const opt=sel?.selectedOptions&&sel.selectedOptions[0];const out=document.getElementById('visaDetailsLine');if(out)out.textContent=opt&&opt.value?(opt.dataset.details||''):'';if(opt&&opt.dataset.price){const price=document.getElementById('transactionPrice');if(price&&!price.value)price.value=opt.dataset.price;const cur=opt.dataset.currency;if(cur){const radio=document.querySelector('[name="currency_id"][value="'+cur+'"]');if(radio)radio.checked=true;}refreshCurrencyMiniLabels();}}
function applyCustomerSaleType(){const sel=document.getElementById('transactionCustomer');const opt=sel?.selectedOptions&&sel.selectedOptions[0];if(!opt)return;const source=opt.dataset.source||'مباشر';const agentId=opt.dataset.agentId||'';const isAgent=(source==='وكيل'&&agentId);document.getElementById('saleTypeDisplay').value=isAgent?'تبع وكيل':'مباشر';document.getElementById('isAgentSaleHidden').value=isAgent?'1':'';document.getElementById('customerAgentHidden').value=isAgent?agentId:'';toggleBox('agentSaleBox',!!isAgent);toggleBox('agentCommissionBox',!!isAgent);const agentName=document.getElementById('agentNameDisplay');if(agentName)agentName.value=isAgent?(opt.dataset.agentName||''):'';const commission=document.getElementById('agentCommissionInput');if(commission&&isAgent&&!parseFloat(commission.value||0))commission.value=opt.dataset.commission||0;}
document.addEventListener('DOMContentLoaded',()=>{refreshCurrencyMiniLabels();toggleVisaStockBox();showVisaDetails(document.getElementById('visaStockSelect'));applyCustomerSaleType();});
function filterSelectOptions(selectId,term){const sel=document.getElementById(selectId);if(!sel)return;term=(term||'').trim();[...sel.options].forEach((o,i)=>{if(i===0){o.hidden=false;return;}o.hidden=term && !o.textContent.includes(term) && !(o.dataset.details||'').includes(term);});}

// ===== Unified account picker + exchange rates =====
let accountPickerTargetId=null, accountPickerTargetName=null, pickedAccount=null, pickerGroup='';
function openAccountPicker(targetId,targetName){accountPickerTargetId=targetId;accountPickerTargetName=targetName;pickedAccount=null;const m=document.getElementById('accountPicker');if(m)m.classList.remove('hidden');filterAccountPicker();}
function closeAccountPicker(){const m=document.getElementById('accountPicker');if(m)m.classList.add('hidden');}
function openAccountPickerForLine(input){const tr=input.closest('tr');const hidden=tr.querySelector('.account-id-input');if(!hidden.id)hidden.id='acc_'+Math.random().toString(36).slice(2);if(!input.id)input.id='accn_'+Math.random().toString(36).slice(2);openAccountPicker(hidden.id,input.id);}
function setAccountPickerGroup(type,btn){pickerGroup=type||'';document.querySelectorAll('.account-picker-tabs button').forEach(b=>b.classList.remove('active'));if(btn)btn.classList.add('active');filterAccountPicker();}
function filterAccountPicker(){const q=(document.getElementById('accountPickerSearch')?.value||'').trim();document.querySelectorAll('#accountPickerRows tr').forEach(r=>{const text=r.dataset.text||r.innerText;const okGroup=!pickerGroup||r.dataset.type===pickerGroup;const okSearch=!q||text.includes(q);r.style.display=(okGroup&&okSearch)?'':'none';});}
function selectAccountPickerRow(row){document.querySelectorAll('#accountPickerRows tr').forEach(r=>r.classList.remove('picked'));row.classList.add('picked');pickedAccount={id:row.dataset.id,name:row.dataset.name,type:row.dataset.type,display:row.children[0].innerText+' - '+row.dataset.name};}
function applyPickedAccount(){if(!pickedAccount)return;const hid=document.getElementById(accountPickerTargetId);const name=document.getElementById(accountPickerTargetName);if(hid)hid.value=pickedAccount.id;if(name)name.value=pickedAccount.display;const party=document.getElementById('voucherParty');const desc=document.getElementById('voucherDescription');if(accountPickerTargetId==='mainAccountId'&&party)party.value=pickedAccount.name;if(desc&&!desc.value){const isReceipt=(document.querySelector('[name=type]')?.value||'قبض')==='قبض';const label=pickedAccount.type==='عميل'?'الأخ':'حساب';desc.value=(isReceipt?'استلمنا من ':'صرفنا إلى ')+label+' / '+pickedAccount.name+' مقابل دفعة من حساب المعاملة';}closeAccountPicker();dirty=true;}
function rateToYer(cur){cur=String(cur); if(cur==='1')return 1; if(cur==='2')return 150; if(cur==='3')return 525; return 1;}
function defaultRateBetween(from,to){from=String(from);to=String(to);return rateToYer(from)/rateToYer(to);}
function setDefaultVoucherRate(){const vc=document.getElementById('voucherCurrency');const pc=document.getElementById('paidCurrency');const er=document.getElementById('exchangeRate');if(vc&&pc&&er)er.value=defaultRateBetween(pc.value,vc.value).toFixed(6).replace(/0+$/,'').replace(/\.$/,'');}
const oldCalcVoucherFx=window.calcVoucherFx;
window.calcVoucherFx=function(){const total=parseFloat(document.getElementById('voucherTotal')?.value||0);const paid=parseFloat(document.getElementById('paidAmount')?.value||0);const cur=document.getElementById('voucherCurrency')?.value||'1';const paidCur=document.getElementById('paidCurrency')?.value||cur;const rate=parseFloat(document.getElementById('exchangeRate')?.value||defaultRateBetween(paidCur,cur));const out=document.getElementById('fxResult');if(!out)return;let converted=paid;if(cur!==paidCur)converted=paid*rate;let diff=converted-total;let status=Math.abs(diff)<0.01?'مكتمل':(diff>0?'زائد يرجع للعميل':'ناقص باقي على العميل');out.value='الناتج: '+converted.toFixed(2)+' | الفارق: '+diff.toFixed(2)+' | '+status;};
function setJournalRate(sel){const tr=sel.closest('tr');const rate=tr.querySelector('.j-rate');if(rate)rate.value=rateToYer(sel.value);}
function calcJournalTotals(){let d=0,c=0;document.querySelectorAll('#jlines tr').forEach(tr=>{const de=parseFloat(tr.querySelector('.j-debit')?.value||0);const cr=parseFloat(tr.querySelector('.j-credit')?.value||0);const rate=parseFloat(tr.querySelector('.j-rate')?.value||rateToYer(tr.querySelector('.j-currency')?.value||1));const out=tr.querySelector('.j-converted');const val=(de||cr)*rate;if(out)out.value=val?val.toFixed(2)+' يمني':'';d+=de*rate;c+=cr*rate;});const de=document.getElementById('jDebitTotal'), cr=document.getElementById('jCreditTotal'), df=document.getElementById('jDiffTotal');if(de)de.textContent=d.toFixed(2);if(cr)cr.textContent=c.toFixed(2);if(df){df.textContent=(d-c).toFixed(2);df.style.color=Math.abs(d-c)<0.01?'green':'#d9222a';}}
document.addEventListener('DOMContentLoaded',()=>{setDefaultVoucherRate();calcVoucherFx();document.querySelectorAll('.j-currency').forEach(setJournalRate);calcJournalTotals();});

// richer visa stock selection details
function fillVisaDetailFields(opt){['company','visa','registry','type'].forEach(k=>{const el=document.getElementById('visa_'+k); if(el) el.value='';});if(!opt||!opt.value)return;const map={company:'company',visa:'visa',registry:'registry',type:'vtype'};Object.entries(map).forEach(([id,key])=>{const el=document.getElementById('visa_'+id);if(el)el.value=opt.dataset[key]||'';});}
const oldShowVisaDetails=window.showVisaDetails;
window.showVisaDetails=function(sel){if(oldShowVisaDetails)oldShowVisaDetails(sel);const opt=sel?.selectedOptions&&sel.selectedOptions[0];fillVisaDetailFields(opt);};
function filterVisaByCustomerProfession(){const cust=document.getElementById('transactionCustomer');const prof=(cust?.selectedOptions?.[0]?.dataset.profession||'').trim();const sel=document.getElementById('visaStockSelect');if(!sel)return;[...sel.options].forEach((o,i)=>{if(i===0)return;const ok=!prof || (o.dataset.profession||'').trim()===prof; o.disabled=!ok;});}
const oldApplyCustomerSaleType2=window.applyCustomerSaleType;
window.applyCustomerSaleType=function(){if(oldApplyCustomerSaleType2)oldApplyCustomerSaleType2();filterVisaByCustomerProfession();};
document.addEventListener('DOMContentLoaded',filterVisaByCustomerProfession);

// ===== v9 final voucher / journal / statement fixes =====
function fxRateV9(from,to){from=String(from);to=String(to); if(from===to)return 1; if(from==='2'&&to==='1')return 150; if(from==='1'&&to==='2')return 1/150; if(from==='3'&&to==='2')return 3.83; if(from==='2'&&to==='3')return 1/3.83; if(from==='3'&&to==='1')return 525; if(from==='1'&&to==='3')return 1/525; return 1;}
function curCodeV9(id){return {'1':'YE','2':'SR','3':'USD'}[String(id)]||'YE';}
function amountWordsV9(n,cur){n=parseFloat(n||0);if(!n)return '';return 'فقط '+n.toLocaleString('en-US',{maximumFractionDigits:2})+' '+({'1':'ريال يمني','2':'ريال سعودي','3':'دولار'}[String(cur)]||'ريال')+' لا غير';}
function voucherV9RepeatDescription(){const main=document.getElementById('voucherDescription')?.value||''; if(!document.getElementById('repeatDesc')?.checked)return; document.querySelectorAll('#v9Lines .line-desc').forEach(i=>{i.value=main;i.title=main;});}
function voucherV9UpdateLine(tr){if(!tr)return; const topAmt=parseFloat(document.getElementById('voucherTotal')?.value||0); const topCur=document.getElementById('voucherCurrency')?.value||'2'; const amt=parseFloat(tr.querySelector('.line-amount')?.value||0); const cur=tr.querySelector('.line-currency')?.value||topCur; const rateInput=tr.querySelector('.line-rate'); let rate=parseFloat(rateInput?.value||0); const defaultRate=fxRateV9(topCur,cur); if(rateInput){ if(!rate || rate<=0 || rateInput.dataset.auto==='1' || rateInput.value===''){rate=defaultRate; rateInput.value=(rate===1?'':Number(rate.toFixed(6)).toString()); rateInput.dataset.auto='1';} rateInput.style.visibility=(cur===topCur)?'hidden':'visible'; }
 const expected=topAmt*(rate||defaultRate); const diff=amt-expected; const res=tr.querySelector('.line-result'); const df=tr.querySelector('.line-diff'); if(res)res.value=amt?amt.toLocaleString('en-US',{maximumFractionDigits:2})+' '+curCodeV9(cur):''; if(df){ if(!amt&&!topAmt){df.value='';df.classList.remove('bad','ok');} else if(Math.abs(diff)<0.01){df.value='0 '+curCodeV9(cur);df.classList.remove('bad');df.classList.add('ok');} else {df.value=(diff>0?'زائد ':'ناقص ')+Math.abs(diff).toLocaleString('en-US',{maximumFractionDigits:2})+' '+curCodeV9(cur);df.classList.add('bad');df.classList.remove('ok');}}
}
function voucherV9UpdateSummary(){const topAmt=parseFloat(document.getElementById('voucherTotal')?.value||0); const topCur=document.getElementById('voucherCurrency')?.value||'2'; let totalTop=0; document.querySelectorAll('#v9Lines tr').forEach(tr=>{const amt=parseFloat(tr.querySelector('.line-amount')?.value||0); const cur=tr.querySelector('.line-currency')?.value||topCur; {const r=parseFloat(tr.querySelector('.line-rate')?.value||fxRateV9(topCur,cur)); totalTop+=(cur===topCur?amt:(r>0?amt/r:0));}}); const diff=totalTop-topAmt; const el=document.getElementById('voucherSummary'); if(el){let status=Math.abs(diff)<0.01?'مكتمل':(diff>0?'زائد':'ناقص');el.textContent='المبلغ: '+topAmt.toLocaleString('en-US',{maximumFractionDigits:2})+' '+curCodeV9(topCur)+' | إجمالي السطور: '+totalTop.toLocaleString('en-US',{maximumFractionDigits:2})+' '+curCodeV9(topCur)+' | الفارق: '+(diff>=0?'+':'')+diff.toLocaleString('en-US',{maximumFractionDigits:2})+' '+curCodeV9(topCur)+' | الحالة: '+status;el.classList.toggle('ok',Math.abs(diff)<0.01);el.classList.toggle('bad',Math.abs(diff)>=0.01);} }
function voucherV9UpdateAll(){const top=document.getElementById('voucherTotal');const cur=document.getElementById('voucherCurrency');const words=document.getElementById('amountInWords');if(words)words.value=amountWordsV9(top?.value,cur?.value);document.querySelectorAll('#v9Lines tr').forEach(voucherV9UpdateLine);voucherV9UpdateSummary();voucherV9RepeatDescription();}
function voucherV9AddLine(){const tpl=document.getElementById('v9LineTpl');const body=document.getElementById('v9Lines');if(!tpl||!body)return;body.appendChild(tpl.content.cloneNode(true));voucherV9UpdateAll();}

// override picker apply to update voucher payer and statement form
const __oldApplyPickedAccountV9 = window.applyPickedAccount;
window.applyPickedAccount=function(){ if(!pickedAccount){return;} const targetId=accountPickerTargetId; if(__oldApplyPickedAccountV9)__oldApplyPickedAccountV9(); const party=document.getElementById('voucherParty'); const mainDesc=document.getElementById('voucherDescription'); if(targetId && targetId.startsWith('acc_')){ if(party)party.value=pickedAccount.name; if(mainDesc){const type=document.querySelector('input[name="type"]')?.value||'قبض'; const label=document.querySelector('.voucher-row-party .field.party label')?.textContent?.trim()||(type==='صرف'?'صرفنا إلى الأخ':'استلمنا من الأخ'); mainDesc.value=label+' / '+pickedAccount.name+' مقابل دفعة من حساب المعاملة';} const input=document.getElementById(accountPickerTargetName); const tr=input?.closest('tr'); if(tr){const d=tr.querySelector('.line-desc'); if(d){d.value=mainDesc?.value||''; d.title=d.value;}} voucherV9UpdateAll(); }
 if(targetId==='statementAccountId'){document.getElementById('statementForm')?.submit();}
};

function journalV9SetRate(tr){if(!tr)return; const from=tr.querySelector('.j-currency')?.value||'1'; const to=tr.querySelector('.j-target')?.value||'1'; const r=tr.querySelector('.j-rate'); if(r){const rate=fxRateV9(from,to);r.value=rate===1?'':Number(rate.toFixed(6)).toString();}}
function journalV9Totals(){const review=document.getElementById('reviewCurrency')?.value||'1'; let d=0,c=0; document.querySelectorAll('#jlines tr').forEach(tr=>{const de=parseFloat(tr.querySelector('.j-debit')?.value||0); const cr=parseFloat(tr.querySelector('.j-credit')?.value||0); const from=tr.querySelector('.j-currency')?.value||'1'; const to=tr.querySelector('.j-target')?.value||review; let rate=parseFloat(tr.querySelector('.j-rate')?.value||0); if(!rate)rate=fxRateV9(from,to); const amount=de>0?de:cr; const result=amount*rate; const out=tr.querySelector('.j-result'); if(out)out.value=amount?result.toLocaleString('en-US',{maximumFractionDigits:2})+' '+curCodeV9(to):''; const reviewVal=amount*fxRateV9(from,review); if(de>0)d+=reviewVal; if(cr>0)c+=reviewVal; }); const diff=d-c; const el=document.getElementById('journalSummary'); if(el){el.textContent='إجمالي المدين: '+d.toLocaleString('en-US',{maximumFractionDigits:2})+' '+curCodeV9(review)+' | إجمالي الدائن: '+c.toLocaleString('en-US',{maximumFractionDigits:2})+' '+curCodeV9(review)+' | الفارق: '+diff.toLocaleString('en-US',{maximumFractionDigits:2})+' '+curCodeV9(review)+' | '+(Math.abs(diff)<0.01?'القيد متوازن':'القيد غير متوازن');el.classList.toggle('ok',Math.abs(diff)<0.01);el.classList.toggle('bad',Math.abs(diff)>=0.01);} }
function journalV9InitLast(){const rows=document.querySelectorAll('#jlines tr');const tr=rows[rows.length-1];journalV9SetRate(tr);journalV9Totals();}
function exportTableToExcel(tableId,filename){const table=document.getElementById(tableId);if(!table)return;const html='\ufeff'+table.outerHTML;const blob=new Blob([html],{type:'application/vnd.ms-excel'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename||'export.xls';a.click();URL.revokeObjectURL(a.href);}

document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('#jlines tr').forEach(journalV9SetRate);journalV9Totals();voucherV9UpdateAll();togglePaymentFields&&togglePaymentFields();document.querySelectorAll('.fixed-text,.clip-cell').forEach(el=>{el.addEventListener('input',()=>{el.title=el.value||el.textContent||''});el.title=el.value||el.textContent||'';});});

// ===== v10 statement preview, resizable columns, readonly/edit document view =====
function initResizableTables(){
  document.querySelectorAll('.resizable-table th').forEach(th=>{
    if(th.querySelector('.col-resizer')) return;
    const grip=document.createElement('span'); grip.className='col-resizer'; th.appendChild(grip);
    let startX=0,startW=0;
    grip.addEventListener('mousedown',e=>{startX=e.pageX;startW=th.offsetWidth;document.body.classList.add('resizing-col');
      const move=ev=>{const w=Math.max(45,startW+(startX-ev.pageX)); th.style.width=w+'px'; th.style.minWidth=w+'px';};
      const up=()=>{document.removeEventListener('mousemove',move);document.removeEventListener('mouseup',up);document.body.classList.remove('resizing-col');};
      document.addEventListener('mousemove',move);document.addEventListener('mouseup',up);e.preventDefault();
    });
  });
}
function initStatementCellTitles(){
  document.querySelectorAll('.statement-table-v11 td,.statement-table-v11 th').forEach(el=>{ if(!el.title){ const t=(el.textContent||'').trim(); if(t) el.title=t; } });
}
function initPrintToggles(){
  const paper=document.querySelector('.printable-statement'); if(!paper)return;
  document.querySelectorAll('[data-print-toggle]').forEach(ch=>{
    const cls=ch.dataset.printToggle;
    const apply=()=>{paper.classList.toggle(cls, ch.checked);};
    ch.addEventListener('change',apply); apply();
  });
  const orientation=document.getElementById('paperOrientation');
  if(orientation){
    const applyOrientation=()=>{paper.classList.toggle('landscape',orientation.value==='landscape');paper.classList.toggle('portrait',orientation.value!=='landscape');document.body.classList.toggle('paper-landscape',orientation.value==='landscape');};
    orientation.addEventListener('change',applyOrientation); applyOrientation();
  }
}
async function enableDocumentEdit(){
  const doc=document.querySelector('.read-only-doc'); if(!doc)return;
  if(!await systemConfirmV13('سيتم تحويل الصفحة من وضع القراءة فقط إلى وضع التعديل. هل تريد المتابعة؟')) return;
  doc.classList.remove('read-only-doc'); doc.classList.add('edit-mode-doc');
  const form=doc.matches('form')?doc:doc.querySelector('form'); if(form){form.classList.add('edit-mode-active');form.dataset.editing='1';}
  doc.querySelectorAll('.ro-control').forEach(el=>{el.disabled=false; el.removeAttribute('disabled');});
  doc.querySelectorAll('.repeat-desc input').forEach(el=>{el.disabled=false; el.removeAttribute('disabled');});
  document.querySelectorAll('.edit-only').forEach(el=>{el.style.display='';});
  try{togglePaymentFields();voucherV9UpdateAll();journalV9Totals();}catch(e){}
}
function journalRepeatDescription(){
  const chk=document.getElementById('journalRepeatDesc'); const main=document.getElementById('journalMainDesc');
  if(!chk||!chk.checked||!main) return;
  document.querySelectorAll('#jlines .j-line-desc,[name="line_description[]"]').forEach(i=>{i.value=main.value;i.title=main.value;});
}
function initJournalReviewCurrencyConfirm(){
  const review=document.getElementById('reviewCurrency'); if(!review||review.dataset.v10Init)return; review.dataset.v10Init='1'; review.dataset.old=review.value;
  review.addEventListener('change',async e=>{
    if(!await systemConfirmV13('تغيير عملة مراجعة القيد سيعيد ضبط عملة التحويل وسعر التحويل في جميع الأسطر. هل تريد المتابعة؟')){review.value=review.dataset.old||'1'; journalV9Totals(); return;}
    document.querySelectorAll('#jlines tr').forEach(tr=>{const target=tr.querySelector('.j-target'); if(target) target.value=review.value; journalV9SetRate(tr);});
    review.dataset.old=review.value; journalV9Totals();
  });
  document.querySelectorAll('#jlines .j-target').forEach(sel=>{
    if(sel.dataset.v10Target)return; sel.dataset.v10Target='1'; sel.addEventListener('change',async ()=>{
      if(sel.value!==review.value){if(!await systemConfirmV13('أنت تحاول تغيير عملة التحويل لهذا السطر عن عملة مراجعة القيد. هل تريد المتابعة؟')){sel.value=review.value;}}
      journalV9SetRate(sel.closest('tr')); journalV9Totals();
    });
  });
}
document.addEventListener('input',e=>{if(e.target.id==='journalMainDesc')journalRepeatDescription(); if(e.target.id==='voucherDescription')voucherV9RepeatDescription();});

function initDocEditGuards(){
  document.querySelectorAll('.doc-view-form').forEach(form=>{
    if(form.dataset.guardInit) return; form.dataset.guardInit='1';
    form.querySelectorAll('.doc-save-btn').forEach(btn=>{
      btn.addEventListener('click',async e=>{
        if(form.dataset.editing!=='1'){form.dataset.saving='1';return;}
        e.preventDefault();
        const ok=await systemConfirmV13('هل أنت متأكد أنك تريد حفظ التعديل؟');
        if(!ok)return;
        form.dataset.saving='1';
        form.requestSubmit ? form.requestSubmit(btn) : form.submit();
      });
    });
    document.querySelectorAll('.doc-back-btn').forEach(a=>{
      if(a.dataset.backGuard) return; a.dataset.backGuard='1';
      a.addEventListener('click',async e=>{
        const active=document.querySelector('.doc-view-form[data-editing="1"]');
        if(!active || active.dataset.saving==='1') return;
        e.preventDefault();
        const choice=await systemChoiceV52('أنت في وضع التعديل. ماذا تريد أن تفعل قبل الرجوع؟',[
          {value:'save',text:'حفظ ثم رجوع',red:true},
          {value:'leave',text:'رجوع بدون حفظ'},
          {value:'cancel',text:'إلغاء'}
        ],'الخروج من وضع التعديل');
        if(choice==='save'){ active.dataset.saving='1'; active.requestSubmit ? active.requestSubmit() : active.submit(); }
        else if(choice==='leave'){ active.dataset.saving='1'; dirty=false; smartBackV52(a.href); }
      });
    });
  });
  window.addEventListener('beforeunload',e=>{
    const active=document.querySelector('.doc-view-form[data-editing="1"]');
    if(active && active.dataset.saving!=='1'){ e.preventDefault(); e.returnValue=''; }
  });
}

document.addEventListener('DOMContentLoaded',()=>{initResizableTables();initStatementCellTitles();initPrintToggles();initJournalReviewCurrencyConfirm();initDocEditGuards();});

// ===== v12 customers page interactions =====
function customerApplyPagination(visibleRows,limit){
  const pager=document.getElementById('custPager'); if(!pager)return;
  pager.innerHTML='';
  document.querySelectorAll('#customersTbody .custrow').forEach(r=>{if(!visibleRows.includes(r))r.style.display='none';});
  if(limit==='all'){visibleRows.forEach(r=>r.style.display='');return;}
  limit=parseInt(limit||50);
  const pages=Math.max(1,Math.ceil(visibleRows.length/limit));
  function show(p){
    visibleRows.forEach((r,i)=>r.style.display=(i>=p*limit&&i<(p+1)*limit)?'':'none');
    [...pager.children].forEach((b,i)=>b.classList.toggle('active',i===p));
  }
  for(let i=0;i<pages;i++){let b=document.createElement('button');b.type='button';b.textContent=i+1;b.onclick=()=>show(i);pager.appendChild(b);}
  show(0);
}
function customerFilterAndPaginate(){
  const inp=document.getElementById('customerMainSearch');
  const agent=document.getElementById('customerAgentFilter');
  const rows=[...document.querySelectorAll('#customersTbody .custrow')];
  const q=(inp&&inp.value||'').trim().toLowerCase();
  const a=(agent&&agent.options[agent.selectedIndex]?agent.options[agent.selectedIndex].text:'').trim().toLowerCase();
  const visible=[];
  rows.forEach(r=>{
    const detail=document.getElementById('customerInlineRow'+r.dataset.cid); if(detail) detail.style.display='none';
    const txt=(r.textContent||'').toLowerCase();
    const agentTxt=((r.querySelector('.agent-col')||{}).textContent||'').trim().toLowerCase();
    const okQ=!q || txt.includes(q);
    const okA=!agent || !agent.value || agentTxt===a || agentTxt.includes(a);
    if(okQ&&okA) visible.push(r);
    r.classList.remove('customer-selected');
  });
  const page=document.getElementById('customerPageSize')?.value || '50';
  customerApplyPagination(visible,page);
  const pager=document.getElementById('custPager'); if(pager) pager.style.display='';
}
function clearCustomerSearch(){
  const inp=document.getElementById('customerMainSearch');
  if(inp){inp.value='';toggleAddCustomerBtn('');}
  resetCustomerInline(false);
  customerFilterAndPaginate();
  if(inp) inp.focus();
}
function showCustomerInline(id){
  const tbody=document.getElementById('customersTbody');
  const selected=tbody?tbody.querySelector('.custrow[data-cid="'+id+'"]'):null;
  const panel=document.getElementById('customerInlineRow'+id);
  if(!selected) return;
  // Put the chosen customer at the top of the visible list so the user sees it immediately.
  if(tbody){ tbody.insertBefore(selected, tbody.firstChild); if(panel) tbody.insertBefore(panel, selected.nextSibling); }
  const name=(selected.querySelector('.customer-name-btn')?.textContent||'').trim();
  const inp=document.getElementById('customerMainSearch');
  if(inp){ inp.value=name; inp.title=name; toggleAddCustomerBtn(name); }
  document.querySelectorAll('#customersTbody .custrow').forEach(r=>{
    const isSel=String(r.dataset.cid)===String(id);
    r.style.display=isSel?'':'none';
    r.classList.toggle('customer-selected',isSel);
  });
  document.querySelectorAll('.customer-inline-row').forEach(r=>r.style.display='none');
  if(panel) panel.style.display='';
  const pager=document.getElementById('custPager'); if(pager) pager.style.display='none';
  setTimeout(()=>{selected.scrollIntoView({behavior:'smooth',block:'start'});},20);
}
function resetCustomerInline(refilter=true){
  document.querySelectorAll('#customersTbody .custrow').forEach(r=>{r.style.display='';r.classList.remove('customer-selected');});
  document.querySelectorAll('.customer-inline-row').forEach(r=>r.style.display='none');
  const pager=document.getElementById('custPager'); if(pager) pager.style.display='';
  if(refilter) customerFilterAndPaginate();
}
function sortCustomerRows(mode){
  const tbody=document.getElementById('customersTbody'); if(!tbody)return;
  const pairs=[]; const children=[...tbody.children];
  for(let i=0;i<children.length;i++){
    const row=children[i];
    if(row.classList.contains('custrow')){
      const detail=children[i+1]&&children[i+1].classList.contains('customer-inline-row')?children[i+1]:document.getElementById('customerInlineRow'+row.dataset.cid);
      pairs.push([row,detail]);
    }
  }
  pairs.sort((a,b)=>{const ai=parseInt(a[0].dataset.id||0), bi=parseInt(b[0].dataset.id||0); return mode==='first'?ai-bi:bi-ai;});
  pairs.forEach(pair=>{tbody.appendChild(pair[0]); if(pair[1])tbody.appendChild(pair[1]);});
  resetCustomerInline(false);
  customerFilterAndPaginate();
}
function initCustomerActionsMenus(){
  document.querySelectorAll('.actions-menu-v12>button').forEach(btn=>{
    if(btn.dataset.menuReady) return; btn.dataset.menuReady='1';
    btn.addEventListener('click',e=>{
      e.preventDefault(); e.stopPropagation();
      const menu=btn.closest('.actions-menu-v12');
      document.querySelectorAll('.actions-menu-v12.open').forEach(m=>{if(m!==menu)m.classList.remove('open');});
      menu.classList.toggle('open');
    });
  });
  document.addEventListener('click',()=>document.querySelectorAll('.actions-menu-v12.open').forEach(m=>m.classList.remove('open')));
  document.querySelectorAll('.actions-menu-v12 .actions-menu-content').forEach(box=>box.addEventListener('click',e=>e.stopPropagation()));
}
function initCustomerTitles(){
  document.querySelectorAll('.customers-table-v12 td,.customers-table-v12 th,.inline-trans-table td,.inline-trans-table th').forEach(el=>{
    const t=(el.textContent||'').trim(); if(t&&!el.title)el.title=t;
  });
}
document.addEventListener('DOMContentLoaded',()=>{initCustomerActionsMenus();initCustomerTitles();});

// ===== v13 internal modal confirmations and linked quantity selectors =====
function systemChoiceV52(message,buttons,title){
  return new Promise(resolve=>{
    const old=document.querySelector('.system-confirm-overlay-v13'); if(old) old.remove();
    const ov=document.createElement('div'); ov.className='system-confirm-overlay-v13';
    ov.innerHTML='<div class="system-confirm-box-v13"><div class="system-modal-icon">⚠</div><h3></h3><p></p><div class="actions"></div></div>';
    ov.querySelector('h3').textContent=title||'تأكيد العملية';
    ov.querySelector('p').textContent=message||'هل تريد المتابعة؟';
    document.body.appendChild(ov);
    const act=ov.querySelector('.actions');
    (buttons||[]).forEach(b=>{
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='btn '+(b.red?'btn-red':'btn-outline');
      btn.textContent=b.text||b.t||'اختيار';
      btn.onclick=()=>{ov.remove();resolve(b.value??false);};
      act.appendChild(btn);
    });
    ov.addEventListener('click',e=>{if(e.target===ov){ov.remove();resolve(false);}});
  });
}
function systemConfirmV13(message){
  return systemChoiceV52(message,[{value:true,text:'نعم',red:true},{value:false,text:'إلغاء'}],'تأكيد العملية');
}
function initV13LinkedQty(){
  document.querySelectorAll('.v13-qty-check').forEach(ch=>{
    if(ch.dataset.ready)return; ch.dataset.ready='1';
    ch.addEventListener('change',()=>{
      const inp=document.getElementById(ch.dataset.target); if(!inp)return;
      if(ch.checked && (!parseInt(inp.value||0))) inp.value=ch.dataset.max||0;
      if(!ch.checked) inp.value=0;
    });
  });
  document.querySelectorAll('.v13-qty-input').forEach(inp=>{
    if(inp.dataset.ready)return; inp.dataset.ready='1';
    inp.addEventListener('input',()=>{
      const tr=inp.closest('tr'); const ch=tr?tr.querySelector('.v13-qty-check'):null;
      if(ch) ch.checked=parseInt(inp.value||0)>0;
    });
  });
}
function initV13ConfirmForms(){
  document.querySelectorAll('form').forEach(form=>{
    const method=(form.getAttribute('method')||'get').toLowerCase();
    if(method!=='post'||form.dataset.v13Silent==='1'||form.dataset.v13NoConfirm==='1')return;
    if(form.dataset.confirmReady)return; form.dataset.confirmReady='1';
    form.addEventListener('submit',async e=>{
      if(form.dataset.confirmed==='1'){setTimeout(()=>{form.dataset.confirmed='';},0);return;}
      e.preventDefault();
      const ok=await systemConfirmV13(form.dataset.v13Confirm||v13FormConfirmMessageV54(form));
      if(ok){dirty=false;form.dataset.confirmed='1'; form.requestSubmit ? form.requestSubmit() : form.submit();}
    });
  });
}
function v13TextV54(el){return ((el?.value||el?.textContent||el?.getAttribute?.('aria-label')||el?.title||'')+'').trim().replace(/\s+/g,' ');}
function v13FormConfirmMessageV54(form){
  const action=((form.getAttribute('action')||'')+' '+v13TextV54(form.querySelector('button,[type=submit]'))).toLowerCase();
  if(/delete|حذف/.test(action))return 'هل تريد تنفيذ الحذف؟';
  if(/update|edit|تعديل/.test(action))return 'هل تريد حفظ التعديل؟';
  if(/reverse|cancel|إلغاء|الغاء|عكس/.test(action))return 'هل تريد تنفيذ هذا الإجراء؟';
  if(/read|ack|موافقة|قراءة/.test(action))return 'هل تريد تأكيد هذا الإجراء؟';
  if(/save|حفظ|إرسال|ارسال/.test(action))return 'هل تريد حفظ البيانات؟';
  return 'هل تريد تنفيذ هذا الإجراء؟';
}
function v13ClickConfirmMessageV54(el){
  if(!el||el.closest('.system-confirm-overlay-v13')||el.closest('[data-v13-no-confirm]')||el.dataset.v13NoConfirm==='1')return '';
  const tag=(el.tagName||'').toLowerCase();
  const type=((el.getAttribute('type')||'')+'').toLowerCase();
  if(tag==='a'||type==='submit')return '';
  const txt=v13TextV54(el);
  if(type==='reset'||/تراجع|تفريغ|مسح/.test(txt))return 'هل تريد التراجع أو تفريغ البيانات؟';
  if(el.classList.contains('modal-x')||/^(×|x)$/i.test(txt)||/إغلاق|اغلاق|إقفال|اقفال/.test(txt))return 'هل تريد الإغلاق؟';
  if(/رجوع|عودة|العودة/.test(txt))return 'هل تريد الرجوع إلى الصفحة السابقة؟';
  if(/حفظ/.test(txt))return 'هل تريد حفظ البيانات؟';
  if(/تعديل/.test(txt))return 'هل تريد فتح التعديل؟';
  if(/حذف|إلغاء|الغاء|عكس|ترحيل|إرسال|ارسال|تسليم|موافقة|قراءة|اعتماد|إنشاء|اضافة|إضافة/.test(txt))return 'هل تريد تنفيذ هذا الإجراء؟';
  return '';
}
function initV13ActionConfirmV54(){
  if(window.v13ActionConfirmReadyV54)return; window.v13ActionConfirmReadyV54='1';
  document.addEventListener('click',async e=>{
    if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    const el=e.target.closest('button,input[type=button],input[type=reset]');
    if(!el||el.dataset.v13ConfirmedClick==='1')return;
    const msg=el.dataset.v13Confirm||v13ClickConfirmMessageV54(el);
    if(!msg)return;
    e.preventDefault();e.stopImmediatePropagation();
    const ok=await systemConfirmV13(msg);
    if(!ok)return;
    el.dataset.v13ConfirmedClick='1';
    el.click();
    setTimeout(()=>{delete el.dataset.v13ConfirmedClick;},0);
  },true);
}
function initResizableV13(){
  document.querySelectorAll('.resizable-table-v13 th').forEach(th=>{
    if(th.querySelector('.col-resizer'))return;
    const grip=document.createElement('span');grip.className='col-resizer';th.appendChild(grip);
    let sx=0,sw=0;
    grip.addEventListener('mousedown',e=>{sx=e.pageX;sw=th.offsetWidth;document.body.classList.add('resizing-col');
      const move=ev=>{const w=Math.max(42,sw+(sx-ev.pageX));th.style.width=w+'px';th.style.minWidth=w+'px'};
      const up=()=>{document.removeEventListener('mousemove',move);document.removeEventListener('mouseup',up);document.body.classList.remove('resizing-col')};
      document.addEventListener('mousemove',move);document.addEventListener('mouseup',up);e.preventDefault();
    });
  });
}
document.addEventListener('DOMContentLoaded',()=>{initV13LinkedQty();initV13ConfirmForms();initV13ActionConfirmV54();initResizableV13();});

// ===== v14 transfer reverse discount display =====
function toggleTransferReverseDiscount(){
  const sel=document.getElementById('transferReverseDiscountType');
  const box=document.getElementById('transferReverseDiscountBox');
  if(!sel||!box)return;
  box.style.display=(sel.value==='none')?'none':'';
}
document.addEventListener('DOMContentLoaded',()=>{toggleTransferReverseDiscount();});

// ===== V16 real customer shortcuts and transfer filters =====
function v16Play(kind){try{const a=new (window.AudioContext||window.webkitAudioContext)();const o=a.createOscillator();const g=a.createGain();o.connect(g);g.connect(a.destination);o.frequency.value=kind==='error'?220:520;g.gain.value=.055;o.start();setTimeout(()=>{o.stop();a.close();},kind==='error'?150:105);}catch(e){}}
function v16SystemBox(title,msg,buttons,type){
  const old=document.getElementById('v16Sys'); if(old)old.remove();
  const ov=document.createElement('div'); ov.id='v16Sys'; ov.className='system-confirm-overlay-v13 v16-system-overlay';
  ov.innerHTML='<div class="system-confirm-box-v13 v16-system-box"><button class="modal-x" onclick="document.getElementById(\'v16Sys\')?.remove()">×</button><h3>'+title+'</h3><p>'+msg+'</p><div class="actions"></div></div>';
  document.body.appendChild(ov); const act=ov.querySelector('.actions');
  (buttons||[{t:'إغلاق',c:()=>ov.remove()}]).forEach(b=>{const bt=document.createElement('button');bt.type='button';bt.className='btn '+(b.red?'btn-red':'btn-outline');bt.textContent=b.t;bt.onclick=()=>{if(b.c)b.c();else ov.remove();};act.appendChild(bt);});
  if(type==='error')v16Play('error'); else v16Play('ok');
}
function closeCustomerModal(){document.getElementById('customerActionModal')?.classList.add('hidden');}
function openCustomerModal(html){const m=document.getElementById('customerActionModal');const b=document.getElementById('customerModalBody');if(!m||!b)return;b.innerHTML=html;m.classList.remove('hidden'); if(typeof initV13ConfirmForms==='function') initV13ConfirmForms(); refreshCurrencyMiniLabels&&refreshCurrencyMiniLabels();}
function v16OptionsFrom(selId){const sel=document.getElementById(selId);return sel?[...sel.options].map(o=>'<option value="'+o.value+'" data-name="'+(o.dataset.name||o.textContent)+'">'+o.textContent+'</option>').join(''):'';}
function openCustomerActionPicker(cid,cname,txs,action){
  if(!txs||!txs.length){v16SystemBox('تنبيه','لا توجد خدمات أو معاملات لهذا العميل.',null,'error');return;}
  if(txs.length===1){openTxAction(cname,txs[0],action);return;}
  const title={office:'اختر المعاملة للمكتب المخلص',status:'اختر المعاملة لتغيير الحالة',refund:'اختر المعاملة للمردود',visa:'اختر المعاملة للتأشيرة'}[action]||'اختر المعاملة';
  let html='<h3>'+title+'</h3><p class="muted">العميل: <b>'+cname+'</b> — الأحدث تظهر أولاً</p><div class="v16-tx-list">';
  txs.forEach((t,i)=>{let btn=t.actions&&t.actions[action]?t.actions[action]:'اختيار';html+='<div class="v16-tx-item"><div><b>'+t.service+'</b><small>الحالة: '+(t.status||'بدون')+' | التأشيرة: '+(t.visa_number||'لا يوجد')+' | المكتب: '+(t.office||'غير مرسلة')+'</small></div><button type="button" class="btn btn-sm btn-red" onclick="openTxAction(\''+cname.replace(/'/g,'')+'\', window.v16CurrentTxs['+i+'], \''+action+'\')">'+btn+'</button></div>';});
  html+='</div><div class="actions"><button class="btn btn-outline" onclick="closeCustomerModal()">إغلاق</button></div>';window.v16CurrentTxs=txs;openCustomerModal(html);
}
function openTxAction(cname,t,action){ if(action==='office') return openOfficeModal(cname,t); if(action==='status') return openStatusModal(cname,t); if(action==='refund') return openRefundModal(cname,t); if(action==='visa') return openVisaViewModal(t); openTransactionViewModal(t); }
function openOfficeModal(cname,t){
  const officeOptions=v16OptionsFrom('v16OfficeOptions');
  let sent=parseInt(t.is_relayed||0)===1;
  let html='<h3>'+(sent?'عرض المكتب المخلص':'إرسال إلى مكتب مخلص')+'</h3><p class="muted">'+cname+' — '+t.service+'</p>';
  html+='<form method="post" action="index.php?r=transfer_save" data-v13-confirm="هل أنت متأكد من إرسال المعاملة إلى المكتب المخلص؟"><input type="hidden" name="_csrf" value="'+document.querySelector('[name=_csrf]')?.value+'"><input type="hidden" name="ids[]" value="'+t.id+'"><div class="form-grid"><div class="field"><label>المكتب المخلص</label><select name="office_id" '+(sent?'disabled':'required')+'>'+officeOptions+'</select></div><div class="field price-inline"><label>السعر</label><div class="price-currency-line"><input name="price" type="number" step="0.01" value="'+(t.price||0)+'" '+(sent?'readonly':'required')+'><span>'+currencyMiniHtml('currency_id',t.currency_id||1)+'</span></div></div><div class="field"><label>البيان</label><input name="description" value="ترحيل معاملة إلى مكتب مخلص - العميل '+cname+'" '+(sent?'readonly':'')+'></div></div><div class="actions"><button class="btn btn-red" '+(sent?'disabled':'')+'>إرسال</button><button type="button" class="btn btn-outline" onclick="v16SystemBox(\'تنبيه\',\'يجب الضغط على إرسال أولاً قبل الحفظ.\')">حفظ</button><button type="button" class="btn btn-outline" onclick="closeCustomerModal()">إغلاق</button></div></form>';
  if(sent) html+='<div class="notice">هذه المعاملة مرسلة مسبقاً للمكتب المخلص. للتعديل استخدم صفحة الترحيل أو إلغاء الترحيل.</div>';
  openCustomerModal(html);
}
function currencyMiniHtml(name,cur){cur=String(cur||1);return '<span data-currency-mini><label><input type="radio" name="'+name+'" value="1" '+(cur==='1'?'checked':'')+'>YE</label><label><input type="radio" name="'+name+'" value="2" '+(cur==='2'?'checked':'')+'>SR</label><label><input type="radio" name="'+name+'" value="3" '+(cur==='3'?'checked':'')+'>USD</label></span>';}
function openStatusModal(cname,t){
  const statuses=(window.V16_SERVICE_STATUSES&&window.V16_SERVICE_STATUSES[t.service_id])||[]; if(!statuses.length){v16SystemBox('تنبيه','لا توجد حالات مرتبطة بهذه الخدمة.',null,'error');return;}
  let idx=Math.max(0,statuses.findIndex(s=>String(s.id)===String(t.status_id))); if(idx<0)idx=0;
  let html='<h3>تغيير حالة المعاملة</h3><p class="muted">'+cname+' — '+t.service+'</p><form method="post" action="index.php?r=transaction_status_update" id="v16StatusForm"><input type="hidden" name="_csrf" value="'+document.querySelector('[name=_csrf]')?.value+'"><input type="hidden" name="id" value="'+t.id+'"><input type="hidden" name="status_id" id="v16StatusId" value="'+statuses[idx].id+'"><div class="status-wheel-v16"><button type="button" onclick="v16ShiftStatus(-1)">›</button><div id="v16StatusItems"></div><button type="button" onclick="v16ShiftStatus(1)">‹</button></div><div class="actions"><button type="button" class="btn btn-outline" onclick="v16ResetStatus()">تراجع</button><button type="button" class="btn btn-red" onclick="v16ConfirmStatus()">حفظ</button><button type="button" class="btn btn-outline" onclick="closeCustomerModal()">إغلاق</button></div></form>';
  openCustomerModal(html); window.v16StatusList=statuses; window.v16StatusOriginal=idx; window.v16StatusIndex=idx; v16RenderStatus();
}
function v16RenderStatus(){const box=document.getElementById('v16StatusItems');if(!box)return;const list=window.v16StatusList||[];box.innerHTML='';list.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.className='status-chip-v16 '+(i===window.v16StatusIndex?'active':'')+(i===window.v16StatusOriginal?' original':'');b.textContent=s.name;b.onclick=()=>{if(i===window.v16StatusIndex){v16ConfirmStatus();}else{window.v16StatusIndex=i;v16RenderStatus();}};box.appendChild(b);});document.getElementById('v16StatusId').value=list[window.v16StatusIndex]?.id||'';}
function v16ShiftStatus(d){const list=window.v16StatusList||[];window.v16StatusIndex=Math.max(0,Math.min(list.length-1,(window.v16StatusIndex||0)+d));v16RenderStatus();}
function v16ResetStatus(){window.v16StatusIndex=window.v16StatusOriginal||0;v16RenderStatus();}
function v16ConfirmStatus(){v16SystemBox('تأكيد تعديل الحالة','هل أنت متأكد أنك تريد تعديل حالة المعاملة؟',[{t:'نعم، حفظ',red:true,c:()=>document.getElementById('v16StatusForm').submit()},{t:'لا',c:()=>document.getElementById('v16Sys')?.remove()}]);}
function openRefundModal(cname,t){
  let html='<h3>مردود / إرجاع مبلغ للعميل</h3><p class="muted">'+cname+' — '+t.service+'</p><form method="post" action="index.php?r=refund_save" data-v13-confirm="هل أنت متأكد من تنفيذ المردود؟"><input type="hidden" name="_csrf" value="'+document.querySelector('[name=_csrf]')?.value+'"><input type="hidden" name="id" value="'+t.id+'"><div class="form-grid"><div class="field"><label>خصم المكتب</label><input name="office_discount" type="number" step="0.01" value="0"></div><div class="field"><label>خصم المكتب المخلص</label><input name="clearing_discount" type="number" step="0.01" value="0"></div><div class="field"><label>البيان</label><input name="description" value="تم عمل مردود للعميل '+cname+' عن خدمة '+t.service+'"></div></div><div class="actions"><button class="btn btn-red">تنفيذ المردود</button><button type="button" class="btn btn-outline" onclick="closeCustomerModal()">إغلاق</button></div></form>';openCustomerModal(html);
}
function openCustomerServiceModal(cid,cname){
  const serviceOptions=v16OptionsFrom('v16ServiceOptions');
  let html='<h3>إضافة خدمة للعميل</h3><p class="muted">'+cname+'</p><form method="post" action="index.php?r=transaction_save" data-v13-confirm="هل تريد حفظ الخدمة؟"><input type="hidden" name="_csrf" value="'+document.querySelector('[name=_csrf]')?.value+'"><input type="hidden" name="customer_id" value="'+cid+'"><div class="form-grid"><div class="field"><label>الخدمة</label><select name="service_id" id="v16AddServiceSelect" required onchange="v16ServiceChanged()"><option value="">اختر الخدمة</option>'+serviceOptions+'</select></div><div class="field price-inline v16-short-price"><label>السعر</label><div class="price-currency-line"><input name="price" type="number" step="0.01" required><span>'+currencyMiniHtml('currency_id',2)+'</span></div></div><div class="field"><label>التاريخ</label><input type="date" name="transaction_date" value="'+new Date().toISOString().slice(0,10)+'"></div><div class="field"><label>بيان</label><input name="notes"></div></div><input type="hidden" name="visa_profession_id" id="v16AddVisaId"><div id="v16VisaNote" class="visa-note-v16 hidden" onclick="openVisaPickOverlay()">لم يتم تنزيل تأشيرة لهذا العميل</div><div id="v16ChosenVisa" class="visa-chosen-v16 hidden"></div><div class="actions"><button class="btn btn-red">حفظ الخدمة</button><button type="button" class="btn btn-outline" onclick="closeCustomerModal()">إغلاق</button></div></form>';openCustomerModal(html);
}
function v16ServiceChanged(){const s=document.getElementById('v16AddServiceSelect');const name=s?.selectedOptions[0]?.textContent||'';document.getElementById('v16VisaNote')?.classList.toggle('hidden',!name.includes('فيز')&&!name.includes('تأش')&&!name.includes('تاش'));}
function openVisaPickOverlay(){const opts=[...document.getElementById('v16VisaOptions').options];let html='<h3>اختيار تأشيرة من المخزون</h3><input class="big-search" placeholder="بحث في المخزون" oninput="v16FilterVisaPick(this.value)"><div class="v16-visa-list">';opts.forEach((o,i)=>{html+='<button type="button" class="v16-visa-option" data-text="'+(o.textContent+' '+o.dataset.details)+'" onclick="v16ChooseVisa('+i+')"><b>'+o.textContent+'</b><small>'+o.dataset.details+'</small></button>';});html+='</div><div class="actions"><button class="btn btn-outline" onclick="document.getElementById(\'v16Sys\')?.remove()">رجوع</button></div>';v16SystemBox('اختيار التأشيرة',html,[{t:'إغلاق',c:()=>document.getElementById('v16Sys')?.remove()}]);window.v16VisaOptionList=opts;}
function v16FilterVisaPick(v){v=(v||'').trim();document.querySelectorAll('.v16-visa-option').forEach(b=>b.style.display=!v||b.dataset.text.includes(v)?'block':'none');}
function v16ChooseVisa(i){const o=window.v16VisaOptionList[i];if(!o)return;document.getElementById('v16AddVisaId').value=o.value;document.getElementById('v16ChosenVisa').classList.remove('hidden');document.getElementById('v16ChosenVisa').innerHTML='<b>✓ تم اختيار تأشيرة من المخزون</b><br>'+o.dataset.details+'<br><b>المهنة:</b> '+(o.dataset.profession||'');document.getElementById('v16VisaNote').textContent='✓ تم تنزيل تأشيرة لهذا العميل';document.getElementById('v16VisaNote').classList.remove('hidden');document.getElementById('v16VisaNote').classList.add('done');document.getElementById('v16Sys')?.remove();v16SystemBox('تم الاختيار','تم اختيار التأشيرة وحفظها داخل نموذج الخدمة. اضغط حفظ الخدمة لإتمام العملية.',null,'ok');}
function openVisaViewModal(t){
  if(!t.has_visa){openCustomerServiceModal(t.customer_id||'', ''); return;}
  let sent=parseInt(t.is_relayed||0)===1;
  let html='<h3>عرض التأشيرة</h3><div class="readonly-card-v16"><div><b>رقم التأشيرة:</b> '+(t.visa_number||'')+'</div><div><b>السجل:</b> '+(t.registry_number||'')+'</div><div><b>الشركة:</b> '+(t.company_name||'')+'</div><div><b>النوع:</b> '+(t.visa_type||'')+'</div><div><b>المورد:</b> '+(t.supplier||'')+'</div></div><div class="actions"><button class="btn btn-red" onclick="'+(sent?'v16SystemBox(\'لا يمكن التعديل\',\'لا يمكن تعديل التأشيرة لأنها مرسلة إلى المكتب المخلص. يرجى إرجاعها من المكتب المخلص أولاً ثم تعديلها وإرسالها مرة أخرى.\',null,\'error\')':'v16AskVisaEdit('+t.id+')')+'">تعديل</button><button class="btn btn-outline" onclick="closeCustomerModal()">إغلاق</button></div>';openCustomerModal(html);
}
function v16AskVisaEdit(id){ if(!window.V16_CAN_EDIT){v16SystemBox('عذراً عزيزي المستخدم','لا توجد لديك صلاحيات لتنفيذ هذه العملية.',null,'error');return;} v16SystemBox('تأكيد','هل أنت متأكد أنك تريد تعديل بيانات التأشيرة؟',[{t:'نعم',red:true,c:()=>location.href='index.php?r=transaction_form&id='+id},{t:'لا',c:()=>document.getElementById('v16Sys')?.remove()}]); }
function openTransactionViewModal(t){let html='<h3>عرض الخدمة / المعاملة</h3><div class="readonly-card-v16"><div><b>الخدمة:</b> '+(t.service||'')+'</div><div><b>الحالة:</b> '+(t.status||'')+'</div><div><b>السعر:</b> '+(t.price||'')+'</div><div><b>المكتب:</b> '+(t.office||'')+'</div><div><b>التأشيرة:</b> '+(t.visa_number||'')+'</div><div><b>الشركة:</b> '+(t.company_name||'')+'</div></div><div class="actions"><button class="btn btn-red" onclick="v16AskVisaEdit('+t.id+')">تعديل</button><button class="btn btn-outline" onclick="closeCustomerModal()">إغلاق</button></div>';openCustomerModal(html);}
function toggleMultiDrop(btn){btn.closest('.multi-filter-v16').classList.toggle('open');}
function filterMultiOptions(inp){let v=inp.value.trim();inp.closest('.multi-drop').querySelectorAll('label').forEach(l=>{if(l.querySelector('[data-all]'))return;l.style.display=!v||l.innerText.includes(v)?'block':'none';});}
function multiFilterChanged(chk){let box=chk.closest('.multi-filter-v16');let checks=[...box.querySelectorAll('input[type=checkbox]:not([data-all])')];let all=box.querySelector('[data-all]');if(chk.hasAttribute('data-all'))checks.forEach(c=>c.checked=chk.checked);else all.checked=checks.every(c=>c.checked);let selected=checks.filter(c=>c.checked).map(c=>c.value);box.querySelector('.multi-label').textContent=selected.length===checks.length?(box.dataset.key==='office'?'كل المكاتب المخلصة':'كل الخدمات'):(box.dataset.key==='office'?'المكاتب المخلصة المحددة فقط':'الخدمات المحددة فقط');applyV16MultiFilters();}
function applyV16MultiFilters(){let boxes=[...document.querySelectorAll('.multi-filter-v16')];document.querySelectorAll('.trrow').forEach(r=>{let show=true;boxes.forEach(box=>{let key=box.dataset.key;let vals=[...box.querySelectorAll('input[type=checkbox]:not([data-all]):checked')].map(c=>c.value);let all=box.querySelectorAll('input[type=checkbox]:not([data-all])').length===vals.length;if(!all && !vals.includes(String(r.dataset[key]||'0')))show=false;});r.style.display=show?'':'none';});}
function filterReverseByService(v){document.querySelectorAll('.reverseRow').forEach(r=>r.style.display=!v||String(r.dataset.service)===String(v)?'':'none');}
// V16: fill profession field in transaction visa details
const _showVisaDetailsOld = window.showVisaDetails;
window.showVisaDetails = function(sel){ if(typeof _showVisaDetailsOld==='function') _showVisaDetailsOld(sel); const opt=sel?.selectedOptions&&sel.selectedOptions[0]; const p=document.getElementById('visa_profession'); if(p) p.value=(opt&&opt.dataset.profession)||''; };

// V17: stable customer shortcuts + compact searchable selects
function v17ToggleCustomerMenu(btn,e){
  if(e){e.preventDefault();e.stopPropagation();}
  const menu=btn.closest('.actions-menu-v12');
  document.querySelectorAll('.actions-menu-v12.open').forEach(m=>{if(m!==menu)m.classList.remove('open');});
  menu.classList.toggle('open');
}
document.addEventListener('click',e=>{
  if(!e.target.closest('.actions-menu-v12')) document.querySelectorAll('.actions-menu-v12.open').forEach(m=>m.classList.remove('open'));
  if(!e.target.closest('.search-select-v17')) document.querySelectorAll('.search-select-v17.open').forEach(s=>s.classList.remove('open'));
});
function v17CustomerShortcut(el,e){
  if(e){e.preventDefault();e.stopPropagation();}
  const menu=el.closest('.actions-menu-v12'); if(!menu){return;}
  const action=el.dataset.action;
  const cid=menu.dataset.cid||'';
  const cname=menu.dataset.cname||'';
  let txs=[];
  try{ txs=JSON.parse(menu.dataset.txs||'[]'); }catch(err){ txs=[]; }
  menu.classList.remove('open');
  if(action==='add_service') return openCustomerServiceModal(cid,cname);
  return openCustomerActionPicker(cid,cname,txs,action);
}
function v17ToggleSearchSelect(btn,e){
  if(e){e.preventDefault();e.stopPropagation();}
  const box=btn.closest('.search-select-v17');
  document.querySelectorAll('.search-select-v17.open').forEach(s=>{if(s!==box)s.classList.remove('open');});
  box.classList.toggle('open');
  const search=box.querySelector('.ss-menu input');
  if(box.classList.contains('open')&&search){search.value='';v17FilterSearchSelect(search);setTimeout(()=>search.focus(),20);}
}
function v17FilterSearchSelect(inp){
  const v=(inp.value||'').trim().toLowerCase();
  inp.closest('.ss-menu').querySelectorAll('button[data-value]').forEach(b=>{b.style.display=(!v||b.textContent.toLowerCase().includes(v))?'block':'none';});
}
function v17PickSearchSelect(btn){
  const box=btn.closest('.search-select-v17');
  box.querySelector('input[type=hidden]').value=btn.dataset.value||'';
  box.querySelector('.ss-label').textContent=btn.textContent.trim();
  box.classList.remove('open');
}

// V17: safer system box accepts HTML content for inventory picker without wrapping it inside <p>
(function(){
  const old=window.v16SystemBox;
  window.v16SystemBox=function(title,msg,buttons,type){
    const oldBox=document.getElementById('v16Sys'); if(oldBox) oldBox.remove();
    const ov=document.createElement('div'); ov.id='v16Sys'; ov.className='system-confirm-overlay-v13 v16-system-overlay';
    const box=document.createElement('div'); box.className='system-confirm-box-v13 v16-system-box';
    box.innerHTML='<button class="modal-x" type="button">×</button><h3></h3><div class="v16-system-message"></div><div class="actions"></div>';
    box.querySelector('h3').textContent=title||'';
    const msgBox=box.querySelector('.v16-system-message');
    if(typeof msg==='string' && /<\w+|<\/\w+/.test(msg)) msgBox.innerHTML=msg; else msgBox.textContent=msg||'';
    box.querySelector('.modal-x').onclick=()=>ov.remove();
    ov.appendChild(box); document.body.appendChild(ov);
    const act=box.querySelector('.actions');
    (buttons||[{t:'إغلاق',c:()=>ov.remove()}]).forEach(b=>{const bt=document.createElement('button');bt.type='button';bt.className='btn '+(b.red?'btn-red':'btn-outline');bt.textContent=b.t;bt.onclick=()=>{if(b.c)b.c();else ov.remove();};act.appendChild(bt);});
    if(typeof v16Play==='function'){ if(type==='error')v16Play('error'); else if(type==='ok')v16Play('ok'); }
  };
})();

/* ===== V18 REAL FIX: customer shortcuts and transfer dropdown stability ===== */
(function(){
  function qs(s,root){return (root||document).querySelector(s);} 
  function qsa(s,root){return Array.from((root||document).querySelectorAll(s));}
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
  function ensureModal(){
    let m=document.getElementById('customerActionModal');
    if(!m){
      m=document.createElement('div');m.id='customerActionModal';m.className='customer-modal-v16 hidden';
      m.innerHTML='<div class="customer-modal-box"><button type="button" class="modal-x" onclick="closeCustomerModal()">×</button><div id="customerModalBody"></div></div>';
      document.body.appendChild(m);
    }
    let b=document.getElementById('customerModalBody');
    if(!b){ b=document.createElement('div'); b.id='customerModalBody'; m.querySelector('.customer-modal-box').appendChild(b); }
    return {m,b};
  }
  window.closeCustomerModal=function(){const m=document.getElementById('customerActionModal'); if(m){m.classList.add('hidden'); const b=document.getElementById('customerModalBody'); if(b)b.innerHTML='';}};
  window.openCustomerModal=function(html){
    const {m,b}=ensureModal();
    b.innerHTML=html;
    m.classList.remove('hidden');
    m.style.display='grid';
    setTimeout(()=>{m.classList.remove('hidden'); const first=b.querySelector('input,select,textarea,button'); if(first) first.focus({preventScroll:true});},10);
    if(typeof initV13ConfirmForms==='function') initV13ConfirmForms();
    if(typeof refreshCurrencyMiniLabels==='function') refreshCurrencyMiniLabels();
  };
  function closeMenus(){qsa('.actions-menu-v12.open').forEach(m=>{m.classList.remove('open'); const c=qs('.actions-menu-content',m); if(c){c.style.top='';c.style.left='';}});} 
  window.v17ToggleCustomerMenu=function(btn,e){
    if(e){e.preventDefault();e.stopPropagation(); if(e.stopImmediatePropagation)e.stopImmediatePropagation();}
    const menu=btn.closest('.actions-menu-v12'); if(!menu)return;
    const was=menu.classList.contains('open'); closeMenus(); if(was)return;
    menu.classList.add('open');
    const content=qs('.actions-menu-content',menu);
    if(content){
      const r=btn.getBoundingClientRect();
      content.style.position='fixed';
      content.style.top=(r.bottom+4)+'px';
      const w=Math.max(220,content.offsetWidth||220);
      let left=r.left-w+btn.offsetWidth;
      if(left<8) left=8;
      if(left+w>window.innerWidth-8) left=window.innerWidth-w-8;
      content.style.left=left+'px';
    }
  };
  function parseTxs(menu){try{return JSON.parse(menu.getAttribute('data-txs')||'[]')||[];}catch(e){return [];}}
  function openPicker(cname,txs,action){
    if(!txs.length){ if(typeof v16SystemBox==='function') v16SystemBox('تنبيه','لا توجد خدمات أو معاملات لهذا العميل.',null,'error'); return; }
    if(txs.length===1){ return window.openTxAction(cname,txs[0],action); }
    window.v18PickerTxs=txs; window.v18PickerCname=cname; window.v18PickerAction=action;
    const title={office:'اختر المعاملة للمكتب المخلص',status:'اختر المعاملة لتغيير الحالة',refund:'اختر المعاملة للمردود',visa:'اختر المعاملة للتأشيرة'}[action]||'اختر المعاملة';
    let html='<h3>'+esc(title)+'</h3><p class="muted">العميل: <b>'+esc(cname)+'</b> — الأحدث تظهر أولاً</p><div class="v16-tx-list">';
    txs.forEach((t,i)=>{const btn=(t.actions&&t.actions[action])?t.actions[action]:'اختيار'; html+='<div class="v16-tx-item"><div><b>'+esc(t.service||'خدمة')+'</b><small>الحالة: '+esc(t.status||'بدون')+' | التأشيرة: '+esc(t.visa_number||'لا يوجد')+' | المكتب: '+esc(t.office||'غير مرسلة')+'</small></div><button type="button" class="btn btn-sm btn-red" onclick="v18PickTx('+i+')">'+esc(btn)+'</button></div>';});
    html+='</div><div class="actions"><button type="button" class="btn btn-outline" onclick="closeCustomerModal()">إغلاق</button></div>';
    openCustomerModal(html);
  }
  window.v18PickTx=function(i){const t=(window.v18PickerTxs||[])[i]; if(t) window.openTxAction(window.v18PickerCname||'',t,window.v18PickerAction||'');};
  window.openCustomerActionPicker=function(cid,cname,txs,action){return openPicker(cname,txs,action);};
  window.openTxAction=function(cname,t,action){
    if(action==='office' && typeof openOfficeModal==='function') return openOfficeModal(cname,t);
    if(action==='status' && typeof openStatusModal==='function') return openStatusModal(cname,t);
    if(action==='refund' && typeof openRefundModal==='function') return openRefundModal(cname,t);
    if(action==='visa' && typeof openVisaViewModal==='function') return openVisaViewModal(t);
    if(typeof openTransactionViewModal==='function') return openTransactionViewModal(t);
  };
  window.v17CustomerShortcut=function(el,e){
    if(e){e.preventDefault();e.stopPropagation(); if(e.stopImmediatePropagation)e.stopImmediatePropagation();}
    const menu=el.closest('.actions-menu-v12'); if(!menu)return false;
    const action=el.getAttribute('data-action')||'';
    const cid=menu.getAttribute('data-cid')||''; const cname=menu.getAttribute('data-cname')||'';
    const txs=parseTxs(menu); closeMenus();
    if(action==='add_service'){ if(typeof openCustomerServiceModal==='function') openCustomerServiceModal(cid,cname); return false; }
    openPicker(cname,txs,action); return false;
  };
  document.addEventListener('click',function(e){
    const item=e.target.closest('.v17-menu-item');
    if(item){window.v17CustomerShortcut(item,e);return;}
    const menuBtn=e.target.closest('.actions-menu-v12>button');
    if(menuBtn){window.v17ToggleCustomerMenu(menuBtn,e);return;}
    if(!e.target.closest('.actions-menu-v12')&&!e.target.closest('.actions-menu-content')) closeMenus();
  },true);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeMenus();closeCustomerModal(); const sys=document.getElementById('v16Sys'); if(sys)sys.remove();}});

  window.toggleMultiDrop=function(btn){
    const box=btn.closest('.multi-filter-v16'); if(!box)return;
    qsa('.multi-filter-v16.open').forEach(b=>{if(b!==box)b.classList.remove('open');});
    box.classList.toggle('open');
    const inp=qs('.multi-drop input',box); if(box.classList.contains('open')&&inp){inp.value=''; if(typeof filterMultiOptions==='function')filterMultiOptions(inp); setTimeout(()=>inp.focus(),20);}
  };
  document.addEventListener('click',function(e){if(!e.target.closest('.multi-filter-v16')) qsa('.multi-filter-v16.open').forEach(b=>b.classList.remove('open'));},true);
  window.filterRows=function(input,cls){const v=String(input.value||'').trim().toLowerCase();qsa('.'+cls).forEach(r=>{r.style.display=(!v||r.innerText.toLowerCase().includes(v))?'':'none';});};
})();

/* ===== V19 FINAL: direct customer shortcuts + modal proof + cache-busted ===== */
(function(){
  function q(s,r){return (r||document).querySelector(s)}
  function qa(s,r){return Array.from((r||document).querySelectorAll(s))}
  function esc(v){return String(v??'').replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]})}
  function csrf(){return (q('input[name="_csrf"]')||{}).value||''}
  function ensureCustomerModal(){
    let m=q('#customerActionModal');
    if(!m){
      m=document.createElement('div');
      m.id='customerActionModal';
      m.className='customer-modal-v16 hidden';
      m.innerHTML='<div class="customer-modal-box"><button type="button" class="modal-x" onclick="closeCustomerModal()">×</button><div id="customerModalBody"></div></div>';
      document.body.appendChild(m);
    }
    let b=q('#customerModalBody',m) || q('#customerModalBody');
    if(!b){b=document.createElement('div'); b.id='customerModalBody'; q('.customer-modal-box',m).appendChild(b)}
    return {m,b};
  }
  window.closeCustomerModal=function(){const m=q('#customerActionModal'); if(m){m.classList.add('hidden'); m.style.display='none'; const b=q('#customerModalBody'); if(b)b.innerHTML='';}};
  window.openCustomerModal=function(html){
    const mb=ensureCustomerModal();
    mb.b.innerHTML=html;
    mb.m.classList.remove('hidden');
    mb.m.style.display='grid';
    mb.m.style.visibility='visible';
    mb.m.style.opacity='1';
    document.body.classList.add('modal-open-v19');
    if(typeof initV13ConfirmForms==='function') initV13ConfirmForms();
    if(typeof refreshCurrencyMiniLabels==='function') refreshCurrencyMiniLabels();
    setTimeout(function(){const first=mb.b.querySelector('input,select,textarea,button:not(.modal-x)'); if(first) first.focus({preventScroll:true});},20);
  };
  function menuByCid(cid){return q('.actions-menu-v12[data-cid="'+cid+'"]')}
  function closeMenus(){qa('.actions-menu-v12.open').forEach(function(x){x.classList.remove('open')})}
  function txsFor(cid){const m=menuByCid(cid); try{return JSON.parse((m&&m.getAttribute('data-txs'))||'[]')||[]}catch(e){return []}}
  function cnameFor(cid){const m=menuByCid(cid); return (m&&m.getAttribute('data-cname'))||''}
  function optionsFrom(id){const s=q('#'+id); if(!s)return ''; return qa('option',s).map(function(o){return '<option value="'+esc(o.value)+'">'+esc(o.textContent)+'</option>'}).join('')}
  function currencyMini(name,cur){cur=String(cur||2); return '<span data-currency-mini><label><input type="radio" name="'+esc(name)+'" value="1" '+(cur==='1'?'checked':'')+'>YE</label><label><input type="radio" name="'+esc(name)+'" value="2" '+(cur==='2'?'checked':'')+'>SR</label><label><input type="radio" name="'+esc(name)+'" value="3" '+(cur==='3'?'checked':'')+'>USD</label></span>'}
  window.v19OpenAddService=function(cid,cname){
    const serviceOptions=optionsFrom('v16ServiceOptions');
    const html='<h3>إضافة خدمة للعميل</h3><p class="muted">'+esc(cname)+'</p><form method="post" action="index.php?r=transaction_save" class="guard-form" data-v13-confirm="هل تريد حفظ الخدمة؟"><input type="hidden" name="_csrf" value="'+esc(csrf())+'"><input type="hidden" name="customer_id" value="'+esc(cid)+'"><div class="form-grid"><div class="field"><label>الخدمة</label><select name="service_id" id="v19AddServiceSelect" required onchange="v19ServiceChanged()"><option value="">اختر الخدمة</option>'+serviceOptions+'</select></div><div class="field price-inline v16-short-price"><label>السعر</label><div class="price-currency-line"><input name="price" type="number" step="0.01" required><span>'+currencyMini('currency_id',2)+'</span></div></div><div class="field"><label>التاريخ</label><input type="date" name="transaction_date" value="'+new Date().toISOString().slice(0,10)+'"></div><div class="field"><label>بيان</label><input name="notes"></div></div><input type="hidden" name="visa_profession_id" id="v19AddVisaId"><div id="v19ChosenVisa" class="visa-chosen-v16 hidden"></div><div id="v19VisaNote" class="visa-note-v16 hidden" onclick="v19OpenVisaPicker()">لم يتم تنزيل تأشيرة لهذا العميل</div><div class="actions"><button class="btn btn-red">حفظ الخدمة</button><button type="button" class="btn btn-outline" onclick="closeCustomerModal()">إغلاق</button></div></form>';
    openCustomerModal(html);
  };
  window.v19ServiceChanged=function(){
    const s=q('#v19AddServiceSelect'); const name=(s&&s.selectedOptions[0]&&s.selectedOptions[0].textContent)||'';
    const isVisa=/فيز|فيزا|تأش|تاش/.test(name);
    const n=q('#v19VisaNote'); if(n)n.classList.toggle('hidden',!isVisa);
  };
  window.v19OpenVisaPicker=function(){
    const opts=qa('#v16VisaOptions option');
    let list='<h3>اختيار تأشيرة من المخزون</h3><input class="big-search" placeholder="ابحث برقم التأشيرة أو الشركة أو المورد أو المهنة" oninput="v19FilterVisa(this.value)"><div class="v16-visa-list">';
    opts.forEach(function(o,i){const txt=(o.textContent+' '+(o.dataset.details||'')+' '+(o.dataset.profession||'')); list+='<button type="button" class="v16-visa-option" data-text="'+esc(txt)+'" onclick="v19ChooseVisa('+i+')"><b>'+esc(o.textContent)+'</b><small>'+esc(o.dataset.details||'')+'</small><small>المهنة: '+esc(o.dataset.profession||'')+'</small></button>'});
    list+='</div><div class="actions"><button type="button" class="btn btn-outline" onclick="document.getElementById(\'v16Sys\')?.remove()">رجوع</button></div>';
    window.v19VisaOptions=opts;
    if(typeof v16SystemBox==='function') v16SystemBox('اختيار التأشيرة',list,[{t:'إغلاق',c:function(){q('#v16Sys')?.remove()}}]); else openCustomerModal(list);
  };
  window.v19FilterVisa=function(v){v=String(v||'').toLowerCase(); qa('.v16-visa-option').forEach(function(b){b.style.display=(!v||b.dataset.text.toLowerCase().includes(v))?'block':'none'})};
  window.v19ChooseVisa=function(i){const o=(window.v19VisaOptions||[])[i]; if(!o)return; const id=q('#v19AddVisaId')||q('#v16AddVisaId'); if(id)id.value=o.value; const chosen=q('#v19ChosenVisa')||q('#v16ChosenVisa'); if(chosen){chosen.classList.remove('hidden'); chosen.innerHTML='<b>✓ تم اختيار تأشيرة من المخزون</b><br>'+esc(o.dataset.details||'')+'<br><b>المهنة:</b> '+esc(o.dataset.profession||'')} const note=q('#v19VisaNote')||q('#v16VisaNote'); if(note){note.textContent='✓ تم تنزيل تأشيرة لهذا العميل'; note.classList.remove('hidden'); note.classList.add('done')} q('#v16Sys')?.remove(); if(typeof v16SystemBox==='function') v16SystemBox('تم الاختيار','تم اختيار التأشيرة داخل نموذج الخدمة. اضغط حفظ الخدمة لإتمام العملية.',null,'ok')};
  function pickTx(cname,txs,action){
    if(!txs.length){if(typeof v16SystemBox==='function') v16SystemBox('تنبيه','لا توجد خدمات أو معاملات لهذا العميل.',null,'error'); return}
    if(txs.length===1){return openAction(cname,txs[0],action)}
    window.v19Picker={cname:cname,txs:txs,action:action};
    let title={office:'اختر المعاملة للمكتب المخلص',status:'اختر المعاملة لتغيير الحالة',refund:'اختر المعاملة للمردود',visa:'اختر المعاملة للتأشيرة'}[action]||'اختر المعاملة';
    let html='<h3>'+esc(title)+'</h3><p class="muted">العميل: <b>'+esc(cname)+'</b> — الأحدث تظهر أولاً</p><div class="v16-tx-list">';
    txs.forEach(function(t,i){let b=(t.actions&&t.actions[action])?t.actions[action]:'اختيار'; html+='<div class="v16-tx-item"><div><b>'+esc(t.service||'خدمة')+'</b><small>الحالة: '+esc(t.status||'بدون')+' | التأشيرة: '+esc(t.visa_number||'لا يوجد')+' | المكتب: '+esc(t.office||'غير مرسلة')+'</small></div><button type="button" class="btn btn-sm btn-red" onclick="v19PickTx('+i+')">'+esc(b)+'</button></div>'});
    html+='</div><div class="actions"><button type="button" class="btn btn-outline" onclick="closeCustomerModal()">إغلاق</button></div>'; openCustomerModal(html);
  }
  window.v19PickTx=function(i){const p=window.v19Picker||{}; const t=(p.txs||[])[i]; if(t)openAction(p.cname,t,p.action)};
  function openAction(cname,t,action){
    if(action==='office' && typeof openOfficeModal==='function') return openOfficeModal(cname,t);
    if(action==='status' && typeof openStatusModal==='function') return openStatusModal(cname,t);
    if(action==='refund' && typeof openRefundModal==='function') return openRefundModal(cname,t);
    if(action==='visa' && typeof openVisaViewModal==='function') return openVisaViewModal(t);
    if(typeof openTransactionViewModal==='function') return openTransactionViewModal(t);
  }
  window.v19CustomerShortcut=function(cid,action,e){
    if(e){e.preventDefault();e.stopPropagation(); if(e.stopImmediatePropagation)e.stopImmediatePropagation()}
    closeMenus(); const cname=cnameFor(cid); if(action==='add_service') return v19OpenAddService(cid,cname); pickTx(cname,txsFor(cid),action); return false;
  };
  document.addEventListener('DOMContentLoaded',function(){ensureCustomerModal();});
})();


/* ===== V20 final behavioral fixes ===== */
(function(){
  function qs(s,r){return (r||document).querySelector(s)}
  function qsa(s,r){return Array.from((r||document).querySelectorAll(s))}
  function closeAllCustomerMenus(){
    qsa('.actions-menu-v12.open').forEach(function(m){
      m.classList.remove('open');
      const c=qs('.actions-menu-content',m);
      if(c){c.style.top='';c.style.left='';c.style.right='';}
    });
  }
  window.closeCustomerModal=function(){
    const sys=qs('#v16Sys'); if(sys) sys.remove();
    const m=qs('#customerActionModal');
    if(m){m.classList.add('hidden');m.style.display='none';const b=qs('#customerModalBody');if(b)b.innerHTML='';}
    document.body.classList.remove('modal-open-v19');
  };
  window.v16SystemBox=function(title,msg,buttons,type){
    const old=qs('#v16Sys'); if(old)old.remove();
    const ov=document.createElement('div');
    ov.id='v16Sys'; ov.className='system-confirm-overlay-v13 v16-system-overlay';
    ov.style.zIndex='2147483646';
    const box=document.createElement('div');
    box.className='system-confirm-box-v13 v16-system-box';
    box.innerHTML='<button class="modal-x" type="button">×</button><h3></h3><div class="v16-system-message"></div><div class="actions"></div>';
    box.querySelector('h3').textContent=title||'';
    const msgBox=box.querySelector('.v16-system-message');
    if(typeof msg==='string' && /<\w+|<\/\w+/.test(msg)) msgBox.innerHTML=msg; else msgBox.textContent=msg||'';
    box.querySelector('.modal-x').onclick=function(){ov.remove();};
    ov.appendChild(box); document.body.appendChild(ov);
    const act=box.querySelector('.actions');
    (buttons||[{t:'إغلاق',c:function(){ov.remove();}}]).forEach(function(b){
      const bt=document.createElement('button');bt.type='button';bt.className='btn '+(b.red?'btn-red':'btn-outline');bt.textContent=b.t;
      bt.onclick=function(){ if(b.c)b.c(); else ov.remove(); };
      act.appendChild(bt);
    });
    if(typeof v16Play==='function'){ if(type==='error')v16Play('error'); else if(type==='ok')v16Play('ok'); }
  };
  window.v17ToggleCustomerMenu=function(btn,e){
    if(e){e.preventDefault();e.stopPropagation(); if(e.stopImmediatePropagation)e.stopImmediatePropagation();}
    const menu=btn.closest('.actions-menu-v12'); if(!menu)return false;
    const was=menu.classList.contains('open'); closeAllCustomerMenus(); if(was)return false;
    menu.classList.add('open');
    const content=qs('.actions-menu-content',menu);
    if(content){
      content.style.display='block';
      const r=btn.getBoundingClientRect();
      const w=Math.max(225, content.offsetWidth||225);
      let left=r.right-w;
      if(left<8) left=8;
      if(left+w>window.innerWidth-8) left=window.innerWidth-w-8;
      let top=r.bottom+6;
      const h=Math.min(380, content.offsetHeight||260);
      if(top+h>window.innerHeight-8) top=Math.max(8,r.top-h-6);
      content.style.position='fixed';
      content.style.left=left+'px';
      content.style.top=top+'px';
      content.style.right='auto';
    }
    return false;
  };
  document.addEventListener('click',function(e){
    const btn=e.target.closest('.actions-menu-v12>button');
    if(btn){window.v17ToggleCustomerMenu(btn,e);return;}
    const item=e.target.closest('.actions-menu-content .v17-menu-item');
    if(item){
      e.preventDefault();e.stopPropagation(); if(e.stopImmediatePropagation)e.stopImmediatePropagation();
      const onclick=item.getAttribute('onclick');
      if(onclick && onclick.indexOf('v19CustomerShortcut')>=0){return;}
      if(typeof window.v17CustomerShortcut==='function') window.v17CustomerShortcut(item,e);
      return;
    }
    if(!e.target.closest('.actions-menu-content')&&!e.target.closest('.actions-menu-v12')) closeAllCustomerMenus();
  },true);
  window.toggleMultiDrop=function(btn){
    const box=btn.closest('.multi-filter-v16'); if(!box)return;
    qsa('.multi-filter-v16.open').forEach(function(b){if(b!==box)b.classList.remove('open');});
    box.classList.toggle('open');
    const inp=qs('.multi-drop input',box);
    if(box.classList.contains('open')&&inp){inp.value=''; if(typeof filterMultiOptions==='function')filterMultiOptions(inp); setTimeout(function(){inp.focus();},20);}
  };
  window.multiFilterChanged=function(chk){
    const box=chk.closest('.multi-filter-v16'); if(!box)return;
    const checks=qsa('input[type=checkbox]:not([data-all])',box);
    const all=qs('input[data-all]',box);
    if(chk.hasAttribute('data-all')) checks.forEach(function(c){c.checked=chk.checked;});
    else if(all) all.checked=checks.length>0 && checks.every(function(c){return c.checked;});
    const selected=checks.filter(function(c){return c.checked;}).map(function(c){return String(c.value);});
    const label=qs('.multi-label',box);
    const allSelected=selected.length===checks.length;
    const key=box.dataset.key;
    if(label) label.textContent=allSelected?(key==='office'?'كل المكاتب المخلصة':'كل الخدمات'):(key==='office'?'المكاتب المخلصة المحددة فقط':'الخدمات المحددة فقط');
    applyV20MultiFilters(box.dataset.target||'trrow');
  };
  window.applyV20MultiFilters=function(target){
    target=target||'trrow';
    const boxes=qsa('.multi-filter-v16[data-target="'+target+'"]');
    qsa('.'+target).forEach(function(r){
      let show=true;
      boxes.forEach(function(box){
        const key=box.dataset.key;
        const checks=qsa('input[type=checkbox]:not([data-all])',box);
        const vals=checks.filter(function(c){return c.checked;}).map(function(c){return String(c.value);});
        const all=vals.length===checks.length;
        if(!all && vals.indexOf(String(r.dataset[key]||'0'))<0) show=false;
      });
      r.style.display=show?'':'none';
    });
  };
  const oldFilterRows=window.filterRows;
  window.filterRows=function(input,cls){
    const v=String(input.value||'').trim().toLowerCase();
    qsa('.'+cls).forEach(function(r){
      const text=r.innerText.toLowerCase();
      const pass=!v || text.indexOf(v)>=0;
      r.dataset.searchHidden=pass?'0':'1';
      r.style.display=pass?'':'none';
    });
    if(cls==='reverseRow' || cls==='trrow'){
      // re-apply dropdown filters without breaking text search
      qsa('.'+cls).forEach(function(r){ if(r.dataset.searchHidden==='1') return; });
    }
  };
})();

/* ===== V20.1 combined search + dropdown filtering ===== */
(function(){
  function qa(s,r){return Array.from((r||document).querySelectorAll(s))}
  window.applyV20MultiFilters=function(target){
    target=target||'trrow';
    const boxes=qa('.multi-filter-v16[data-target="'+target+'"]');
    qa('.'+target).forEach(function(r){
      let show=(r.dataset.searchHidden!=='1');
      boxes.forEach(function(box){
        const key=box.dataset.key;
        const checks=qa('input[type=checkbox]:not([data-all])',box);
        const vals=checks.filter(function(c){return c.checked;}).map(function(c){return String(c.value);});
        const all=vals.length===checks.length;
        if(!all && vals.indexOf(String(r.dataset[key]||'0'))<0) show=false;
      });
      r.style.display=show?'':'none';
    });
  };
  window.filterRows=function(input,cls){
    const v=String(input.value||'').trim().toLowerCase();
    qa('.'+cls).forEach(function(r){
      const pass=!v || r.innerText.toLowerCase().indexOf(v)>=0;
      r.dataset.searchHidden=pass?'0':'1';
    });
    if(cls==='reverseRow'||cls==='trrow') window.applyV20MultiFilters(cls);
    else qa('.'+cls).forEach(function(r){r.style.display=(r.dataset.searchHidden==='1')?'none':'';});
  };
})();

/* ===== V21 customer menu/action fix: no wrong action, menu beside dots ===== */
(function(){
  function qs(s,r){return (r||document).querySelector(s)}
  function qsa(s,r){return Array.from((r||document).querySelectorAll(s))}
  function parseAction(el){
    let a=el.getAttribute('data-action')||'';
    if(!a){
      const oc=el.getAttribute('onclick')||'';
      const m=oc.match(/v19CustomerShortcut\([^,]+,'([^']+)'/); if(m)a=m[1];
    }
    return a;
  }
  function getMenu(el){return el.closest('.actions-menu-v12')}
  function closeMenus(){qsa('.actions-menu-v12.open').forEach(function(m){m.classList.remove('open')})}
  window.v17ToggleCustomerMenu=function(btn,e){
    if(e){e.preventDefault();e.stopPropagation(); if(e.stopImmediatePropagation)e.stopImmediatePropagation();}
    const menu=getMenu(btn); if(!menu)return false;
    const was=menu.classList.contains('open'); closeMenus(); if(was)return false;
    menu.classList.add('open');
    const box=qs('.actions-menu-content',menu);
    if(box){box.style.position='absolute';box.style.top='36px';box.style.right='0';box.style.left='auto';box.style.display='block';}
    return false;
  };
  window.v17CustomerShortcut=function(el,e){
    if(e){e.preventDefault();e.stopPropagation(); if(e.stopImmediatePropagation)e.stopImmediatePropagation();}
    const menu=getMenu(el); if(!menu)return false;
    const action=parseAction(el); const cid=menu.dataset.cid||''; const cname=menu.dataset.cname||'';
    let txs=[]; try{txs=JSON.parse(menu.dataset.txs||'[]')||[]}catch(err){txs=[]}
    closeMenus();
    if(action==='add_service'){ if(typeof v19OpenAddService==='function') v19OpenAddService(cid,cname); else if(typeof openCustomerServiceModal==='function') openCustomerServiceModal(cid,cname); return false; }
    if(typeof openCustomerActionPicker==='function') openCustomerActionPicker(cid,cname,txs,action);
    return false;
  };
  window.v19CustomerShortcut=function(cid,action,e){
    if(e){e.preventDefault();e.stopPropagation(); if(e.stopImmediatePropagation)e.stopImmediatePropagation();}
    const menu=qs('.actions-menu-v12[data-cid="'+cid+'"]'); if(!menu)return false;
    let txs=[]; try{txs=JSON.parse(menu.dataset.txs||'[]')||[]}catch(err){txs=[]}
    const cname=menu.dataset.cname||''; closeMenus();
    if(action==='add_service'){ if(typeof v19OpenAddService==='function') v19OpenAddService(cid,cname); else if(typeof openCustomerServiceModal==='function') openCustomerServiceModal(cid,cname); return false; }
    if(typeof openCustomerActionPicker==='function') openCustomerActionPicker(cid,cname,txs,action);
    return false;
  };
  document.addEventListener('click',function(e){
    const btn=e.target.closest('.actions-menu-v12>button');
    if(btn){window.v17ToggleCustomerMenu(btn,e);return;}
    const item=e.target.closest('.actions-menu-content .v17-menu-item');
    if(item){window.v17CustomerShortcut(item,e);return;}
    if(!e.target.closest('.actions-menu-v12'))closeMenus();
  },true);
})();

/* ===== V22 comprehensive fixes ===== */
(function(){
  function qs(s,r){return (r||document).querySelector(s)}
  function qsa(s,r){return Array.from((r||document).querySelectorAll(s))}
  function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
  window.filterMultiOptions=function(inp){const v=String(inp.value||'').trim().toLowerCase();qsa('label',inp.closest('.multi-drop')).forEach(l=>{if(l.querySelector('[data-all]'))return;l.style.display=(!v||l.innerText.toLowerCase().includes(v))?'block':'none';});}
  window.multiFilterChanged=function(chk){const box=chk.closest('.multi-filter-v16');if(!box)return;const checks=qsa('input[type=checkbox]:not([data-all])',box);const all=qs('input[data-all]',box);if(chk.hasAttribute('data-all'))checks.forEach(c=>c.checked=chk.checked);else if(all)all.checked=checks.every(c=>c.checked);const key=box.dataset.key;const selected=checks.filter(c=>c.checked).map(c=>String(c.value));const label=qs('.multi-label',box);if(label){let allText= key==='service'?'كل الخدمات':key==='status'?'كل الحالات':key==='customer'?'كل العملاء':key==='supplier'?'كل الموردين':key==='agent'?'كل الوكلاء':key==='office'?'كل المكاتب المخلصة':key==='currency'?'كل العملات':'الكل';let partText= key==='service'?'الخدمات المحددة فقط':key==='status'?'الحالات المحددة فقط':key==='customer'?'العملاء المحددين فقط':key==='supplier'?'الموردين المحددين فقط':key==='agent'?'الوكلاء المحددين فقط':key==='office'?'المكاتب المحددة فقط':key==='currency'?'العملات المحددة فقط':'المحدد فقط';label.textContent=(selected.length===checks.length)?allText:partText;}
    if(key==='service') updateStatusFilterByServices(box.dataset.target);
    applyV22Filters(box.dataset.target||'txrow');}
  window.toggleMultiDrop=function(btn){const box=btn.closest('.multi-filter-v16');if(!box)return;qsa('.multi-filter-v16.open').forEach(b=>{if(b!==box)b.classList.remove('open')});box.classList.toggle('open');const inp=qs('.multi-drop input',box);if(box.classList.contains('open')&&inp){inp.value='';filterMultiOptions(inp);setTimeout(()=>inp.focus(),10);}};
  document.addEventListener('click',e=>{if(!e.target.closest('.multi-filter-v16'))qsa('.multi-filter-v16.open').forEach(b=>b.classList.remove('open'));});
  function updateStatusFilterByServices(target){const serviceBox=qs('.multi-filter-v16[data-target="'+target+'"][data-key="service"]');const statusBox=qs('.multi-filter-v16[data-target="'+target+'"][data-key="status"]');if(!serviceBox||!statusBox)return;const svcChecks=qsa('input[type=checkbox]:not([data-all])',serviceBox);const selected=svcChecks.filter(c=>c.checked).map(c=>String(c.value));const all=selected.length===svcChecks.length; qsa('.multi-drop label[data-service]',statusBox).forEach(l=>{const sid=String(l.dataset.service||'');const show=all||selected.includes(sid);l.style.display=show?'block':'none';if(!show){const c=qs('input',l);if(c)c.checked=false;}}); const allChk=qs('input[data-all]',statusBox); if(allChk) allChk.checked=qsa('input[type=checkbox]:not([data-all])',statusBox).filter(c=>c.closest('label').style.display!=='none').every(c=>c.checked);}
  window.applyV22Filters=function(target){target=target||'txrow';const boxes=qsa('.multi-filter-v16[data-target="'+target+'"]');qsa('.'+target).forEach(r=>{let show=r.dataset.searchHidden!=='1';boxes.forEach(box=>{const key=box.dataset.key;const checks=qsa('input[type=checkbox]:not([data-all])',box).filter(c=>c.closest('label').style.display!=='none');const vals=checks.filter(c=>c.checked).map(c=>String(c.value));const all=vals.length===checks.length;let rv=String(r.dataset[key]||'0');if(key==='remain'&&vals.includes('all'))return;if(!all && !vals.includes(rv))show=false;});r.style.display=show?'':'none';});}
  window.filterRows=function(input,cls){const v=String(input.value||'').trim().toLowerCase();qsa('.'+cls).forEach(r=>{const pass=!v||r.innerText.toLowerCase().includes(v);r.dataset.searchHidden=pass?'0':'1';});if(['txrow','strow','authLiveRow','authEditRow','reverseRow','trrow'].includes(cls))applyV22Filters(cls);else qsa('.'+cls).forEach(r=>r.style.display=r.dataset.searchHidden==='1'?'none':'');}
  window.resetV22Filters=function(target){qsa('.multi-filter-v16[data-target="'+target+'"] input[type=checkbox]').forEach(c=>c.checked=true);qsa('.multi-filter-v16[data-target="'+target+'"] .multi-label').forEach(b=>{const key=b.closest('.multi-filter-v16').dataset.key;b.textContent=key==='service'?'كل الخدمات':key==='status'?'كل الحالات':key==='office'?'كل المكاتب المخلصة':key==='currency'?'كل العملات':'الكل';});qsa('.'+target).forEach(r=>{r.dataset.searchHidden='0';r.style.display='';});}
  window.openPrintPreviewV22=function(modalId,contentId){const m=qs('#'+modalId), c=qs('#'+contentId); if(!m||!c)return; const paper=qs('.a4-paper-v22',m); if(paper){paper.innerHTML=c.cloneNode(true).outerHTML;} m.classList.remove('hidden');m.style.display='grid';}
  window.closePreviewV22=function(id){const m=qs('#'+id); if(m){m.classList.add('hidden');m.style.display='none';}}
  window.setPreviewOrientation=function(v){qsa('.a4-paper-v22').forEach(p=>{p.classList.toggle('landscape',v==='landscape')});}
  window.v22ConfirmGo=function(msg,url){v16SystemBox('تأكيد',msg,[{t:'نعم',red:true,c:()=>{location.href=url}},{t:'إلغاء',c:()=>qs('#v16Sys')?.remove()}]);return false;}
  window.v22TxEdit=function(url,can){if(!can){v16SystemBox('عذراً عزيزي المستخدم','لا توجد لديك صلاحيات لتعديل المعاملة.',null,'error');return false;}v16SystemBox('تأكيد التعديل','هل أنت متأكد أنك تريد تعديل هذه المعاملة؟',[{t:'نعم',red:true,c:()=>{location.href=url}},{t:'إلغاء',c:()=>qs('#v16Sys')?.remove()}]);return false;}
  window.openDeliveryModalV22=function(tid,cname,cid,service,balance){balance=parseFloat(balance||0);let balMsg='';if(Math.abs(balance)>0.001){balMsg='<div class="notice error-note"><b>تنبيه:</b> العميل لديه متبقي: '+balance.toFixed(2)+' حسب كشف الحساب. لا تكمل إلا إذا لديك صلاحية التسليم مع وجود متبقي.</div>'}let html='<h3>تسليم معاملة</h3><p><b>العميل:</b> '+esc(cname)+' | <b>الخدمة:</b> '+esc(service||'')+'</p>'+balMsg+'<form method="post" action="index.php?r=delivery_save"><input type="hidden" name="_csrf" value="'+(qs('input[name=_csrf]')?.value||'')+'"><input type="hidden" name="transaction_id" value="'+tid+'"><div class="form-grid"><div class="field"><label>اسم المستلم</label><input name="receiver_name" value="'+esc(cname)+'" required></div><div class="field"><label>البيان</label><input name="description" value="تم تسليم المعاملة للعميل"></div></div><div class="actions"><button type="button" class="btn btn-outline" onclick="window.open(\'index.php?r=delivery&id='+tid+'\',\'_blank\')">طباعة سند التسليم</button><button class="btn btn-red">نعم، تنفيذ التسليم</button><button type="button" class="btn btn-outline" onclick="closeCustomerModal()">إغلاق</button></div></form>';openCustomerModal(html);}
  const oldOpenTx=window.openTxAction; window.openTxAction=function(cname,t,action){if(action==='delivery')return openDeliveryModalV22(t.id,cname,t.customer_id||0,t.service,t.balance||t.customer_balance||t.remaining_balance||0); if(oldOpenTx)return oldOpenTx(cname,t,action);}
  window.openBatchStatusModalV22=function(){const checked=qsa('.stcheck:checked');if(!checked.length){v16SystemBox('تنبيه','حدد معاملة واحدة على الأقل.',null,'error');return;}const serviceIds=[...new Set(checked.map(c=>String(c.dataset.service)))];if(serviceIds.length>1){v16SystemBox('لا يمكن تغيير الحالة','هناك خدمات من نوع آخر. اختر معاملات لنفس الخدمة فقط.',null,'error');return;}const sid=serviceIds[0];const list=(window.V22_STATUS_BY_SERVICE&&window.V22_STATUS_BY_SERVICE[sid])||[];if(!list.length){v16SystemBox('تنبيه','لا توجد حالات لهذه الخدمة.',null,'error');return;}let opts=list.map(s=>'<option value="'+s.id+'">'+esc(s.name)+'</option>').join('');let html='<h3>تغيير حالة المعاملات المحددة</h3><p>عدد المحدد: '+checked.length+'</p><div class="field"><label>الحالة الجديدة</label><select id="v22BatchStatusSelect">'+opts+'</select></div><div class="actions"><button class="btn btn-red" onclick="v22SubmitBatchStatus()">تغيير الحالة</button><button class="btn btn-outline" onclick="document.getElementById(\'v16Sys\')?.remove()">إلغاء</button></div>';v16SystemBox('تأكيد تغيير الحالة',html,[]);}
  window.v22SubmitBatchStatus=function(){const sel=qs('#v22BatchStatusSelect');if(!sel)return;qs('#batchNewStatus').value=sel.value;v16SystemBox('تأكيد نهائي','هل أنت متأكد من تغيير حالة المعاملات المحددة؟',[{t:'نعم',red:true,c:()=>qs('#batchStatusForm').submit()},{t:'إلغاء',c:()=>qs('#v16Sys')?.remove()}]);}
})();


/* ===== V24: ربط قائمة الحالات بالخدمات المختارة في صفحة حالة المعاملات ===== */
(function(){
  function qs(s,r){return (r||document).querySelector(s)}
  function qsa(s,r){return Array.from((r||document).querySelectorAll(s))}
  function labelAllText(key){return key==='service'?'كل الخدمات':key==='status'?'كل الحالات':key==='customer'?'كل العملاء':key==='supplier'?'كل الموردين':key==='agent'?'كل الوكلاء':key==='office'?'كل المكاتب المخلصة':key==='currency'?'كل العملات':'الكل'}
  function labelPartText(key){return key==='service'?'الخدمات المحددة فقط':key==='status'?'الحالات المحددة فقط':key==='customer'?'العملاء المحددين فقط':key==='supplier'?'الموردين المحددين فقط':key==='agent'?'الوكلاء المحددين فقط':key==='office'?'المكاتب المحددة فقط':key==='currency'?'العملات المحددة فقط':'المحدد فقط'}
  function updateStatusFilterBySelectedServices(target){
    const serviceBox=qs('.multi-filter-v16[data-target="'+target+'"][data-key="service"]');
    const statusBox=qs('.multi-filter-v16[data-target="'+target+'"][data-key="status"]');
    if(!serviceBox||!statusBox)return;
    const svcChecks=qsa('input[type=checkbox]:not([data-all])',serviceBox);
    const selected=svcChecks.filter(c=>c.checked).map(c=>String(c.value));
    const allServices=selected.length===svcChecks.length;
    const statusLabels=qsa('.multi-drop label[data-service]',statusBox);
    const noStatus=qs('.no-status-label-v24',statusBox);
    let visibleCount=0;
    statusLabels.forEach(l=>{
      const sid=String(l.dataset.service||'');
      const show=allServices || selected.includes(sid);
      l.style.display=show?'block':'none';
      const c=qs('input[type=checkbox]',l);
      if(c){ c.disabled=!show; c.checked=!!show; }
      if(show)visibleCount++;
    });
    if(noStatus) noStatus.style.display=visibleCount===0?'block':'none';
    const allChk=qs('input[data-all]',statusBox);
    if(allChk){ allChk.checked=visibleCount>0; allChk.disabled=visibleCount===0; }
    const label=qs('.multi-label',statusBox);
    if(label){ label.textContent=visibleCount===0?'لا توجد حالات لهذه المعاملات':(allServices?'كل الحالات':'كل حالات الخدمات المحددة'); }
  }
  window.multiFilterChanged=function(chk){
    const box=chk.closest('.multi-filter-v16'); if(!box)return;
    const key=box.dataset.key; const target=box.dataset.target||'txrow';
    const checks=qsa('input[type=checkbox]:not([data-all])',box);
    const all=qs('input[data-all]',box);
    if(chk.hasAttribute('data-all')) checks.forEach(c=>{ if(!c.disabled && c.closest('label').style.display!=='none') c.checked=chk.checked; });
    else if(all){ const active=checks.filter(c=>!c.disabled && c.closest('label').style.display!=='none'); all.checked=active.length>0 && active.every(c=>c.checked); }
    if(key==='service') updateStatusFilterBySelectedServices(target);
    const selected=checks.filter(c=>c.checked && !c.disabled && c.closest('label').style.display!=='none').map(c=>String(c.value));
    const activeCount=checks.filter(c=>!c.disabled && c.closest('label').style.display!=='none').length;
    const label=qs('.multi-label',box);
    if(label && key!=='status') label.textContent=(selected.length===activeCount)?labelAllText(key):labelPartText(key);
    if(label && key==='status' && activeCount>0) label.textContent=(selected.length===activeCount)?'كل الحالات':'الحالات المحددة فقط';
    window.applyV22Filters(target);
  };
  window.applyV22Filters=function(target){
    target=target||'txrow';
    const boxes=qsa('.multi-filter-v16[data-target="'+target+'"]');
    qsa('.'+target).forEach(r=>{
      let show=r.dataset.searchHidden!=='1';
      boxes.forEach(box=>{
        const key=box.dataset.key;
        const checks=qsa('input[type=checkbox]:not([data-all])',box).filter(c=>!c.disabled && c.closest('label').style.display!=='none');
        if(key==='status' && checks.length===0) return;
        const vals=checks.filter(c=>c.checked).map(c=>String(c.value));
        const all=vals.length===checks.length;
        const rv=String(r.dataset[key]||'0');
        if(key==='remain'&&vals.includes('all'))return;
        if(!all && !vals.includes(rv)) show=false;
      });
      r.style.display=show?'':'none';
    });
  };
  window.resetV22Filters=function(target){
    qsa('.multi-filter-v16[data-target="'+target+'"] input[type=checkbox]').forEach(c=>{c.disabled=false;c.checked=true;});
    qsa('.multi-filter-v16[data-target="'+target+'"] label[data-service]').forEach(l=>l.style.display='block');
    qsa('.multi-filter-v16[data-target="'+target+'"] .no-status-label-v24').forEach(l=>l.style.display='none');
    qsa('.multi-filter-v16[data-target="'+target+'"] .multi-label').forEach(b=>{const key=b.closest('.multi-filter-v16').dataset.key;b.textContent=labelAllText(key);});
    qsa('.'+target).forEach(r=>{r.dataset.searchHidden='0';r.style.display='';});
  };
  document.addEventListener('DOMContentLoaded',function(){qsa('.multi-filter-v16[data-key="service"]').forEach(box=>updateStatusFilterBySelectedServices(box.dataset.target||'txrow'));});
})();


/* ===== V25: دليل المعاملات - ربط الخدمة/الحالة وربط المبالغ/العملة وفهرس الأعمدة ===== */
(function(){
  function qs(s,r){return (r||document).querySelector(s)}
  function qsa(s,r){return Array.from((r||document).querySelectorAll(s))}
  function labelAllText(key){return key==='service'?'كل الخدمات':key==='status'?'كل الحالات':key==='customer'?'كل العملاء':key==='supplier'?'كل الموردين':key==='agent'?'كل الوكلاء':key==='office'?'كل المكاتب المخلصة':key==='currency'?'كل العملات':key==='remain'?'الكل':key==='sale'?'الكل':'الكل'}
  function labelPartText(key){return key==='service'?'الخدمات المحددة فقط':key==='status'?'الحالات المحددة فقط':key==='customer'?'العملاء المحددين فقط':key==='supplier'?'الموردين المحددين فقط':key==='agent'?'الوكلاء المحددين فقط':key==='office'?'المكاتب المحددة فقط':key==='currency'?'العملات المحددة فقط':key==='remain'?'المبالغ المحددة فقط':key==='sale'?'نوع العميل المحدد فقط':'المحدد فقط'}
  function activeChecks(box){return qsa('input[type=checkbox]:not([data-all])',box).filter(c=>!c.disabled && c.closest('label').style.display!=='none')}
  function selectedVals(box){return activeChecks(box).filter(c=>c.checked).map(c=>String(c.value))}
  function isAll(box){const a=activeChecks(box);return a.length>0 && selectedVals(box).length===a.length}
  function updateStatusBox(target){
    const serviceBox=qs('.multi-filter-v16[data-target="'+target+'"][data-key="service"]');
    const statusBox=qs('.multi-filter-v16[data-target="'+target+'"][data-key="status"]');
    if(!serviceBox||!statusBox)return;
    const svcActive=activeChecks(serviceBox); const svcSelected=selectedVals(serviceBox); const allServices=svcSelected.length===svcActive.length;
    let visible=0;
    qsa('.multi-drop label[data-service]',statusBox).forEach(l=>{
      const sid=String(l.dataset.service||''); const show=allServices||svcSelected.includes(sid);
      l.style.display=show?'block':'none'; const c=qs('input[type=checkbox]',l); if(c){c.disabled=!show;c.checked=show;} if(show)visible++;
    });
    const no=qs('.no-status-label-v24',statusBox); if(no)no.style.display=visible?'none':'block';
    const all=qs('input[data-all]',statusBox); if(all){all.disabled=!visible;all.checked=!!visible;}
    const lab=qs('.multi-label',statusBox); if(lab)lab.textContent=visible?(allServices?'كل الحالات':'كل حالات الخدمات المحددة'):'لا توجد حالات لهذه المعاملات';
  }
  function updateLabel(box){const key=box.dataset.key; const lab=qs('.multi-label',box); if(!lab)return; const a=activeChecks(box); if(!a.length && key==='status'){lab.textContent='لا توجد حالات لهذه المعاملات';return;} lab.textContent=isAll(box)?labelAllText(key):labelPartText(key);}
  window.multiFilterChanged=function(chk){
    const box=chk.closest('.multi-filter-v16'); if(!box)return;
    const target=box.dataset.target||'txrow'; const key=box.dataset.key;
    const checks=qsa('input[type=checkbox]:not([data-all])',box); const all=qs('input[data-all]',box);
    if(chk.hasAttribute('data-all')){checks.forEach(c=>{if(!c.disabled && c.closest('label').style.display!=='none')c.checked=chk.checked;});}
    else if(all){const a=activeChecks(box); all.checked=a.length>0 && a.every(c=>c.checked);}
    if(key==='service') updateStatusBox(target);
    updateLabel(box);
    if(key==='service'){const st=qs('.multi-filter-v16[data-target="'+target+'"][data-key="status"]'); if(st)updateLabel(st);}    
    applyV25Filters(target);
  };
  window.applyV25Filters=function(target){
    target=target||'txrow'; const boxes=qsa('.multi-filter-v16[data-target="'+target+'"]');
    const remainBox=qs('.multi-filter-v16[data-target="'+target+'"][data-key="remain"]');
    const curBox=qs('.multi-filter-v16[data-target="'+target+'"][data-key="currency"]');
    const remainVals=remainBox?selectedVals(remainBox):['all']; const curVals=curBox?selectedVals(curBox):[]; const curAll=curBox?isAll(curBox):true;
    qsa('.'+target).forEach(r=>{
      let show=r.dataset.searchHidden!=='1';
      boxes.forEach(box=>{
        const key=box.dataset.key; if(key==='currency'||key==='remain')return;
        const a=activeChecks(box); if(key==='status' && a.length===0) return;
        const vals=selectedVals(box); const all=vals.length===a.length; const rv=String(r.dataset[key]||'0');
        if(!all && !vals.includes(rv)) show=false;
      });
      if(show && remainBox){
        const rstate=String(r.dataset.remain||'zero'); const rcurs=(r.dataset.remainCurrencies||'').split(',').filter(Boolean);
        if(!remainVals.includes('all') && !remainVals.includes(rstate)) show=false;
        if(show && rstate==='has' && curBox && !curAll){ if(!curVals.some(v=>rcurs.includes(String(v)))) show=false; }
        if(show && rstate==='zero' && curBox && !curAll){ /* لا يوجد مبلغ في العملات المحددة أيضاً */ show=true; }
      } else if(show && curBox && !curAll){
        const txcur=String(r.dataset.currency||'1'); if(!curVals.includes(txcur)) show=false;
      }
      r.style.display=show?'':'none';
    });
  };
  window.filterRows=function(input,cls){
    const v=String(input.value||'').trim().toLowerCase(); qsa('.'+cls).forEach(r=>{r.dataset.searchHidden=(!v||r.innerText.toLowerCase().includes(v))?'0':'1';});
    if(cls==='txrow'||cls==='strow'||cls==='trrow'||cls==='reverseRow') applyV25Filters(cls); else qsa('.'+cls).forEach(r=>r.style.display=r.dataset.searchHidden==='1'?'none':'');
  };
  window.resetV22Filters=function(target){
    target=target||'txrow'; qsa('.multi-filter-v16[data-target="'+target+'"] input[type=checkbox]').forEach(c=>{c.disabled=false;c.checked=true;});
    qsa('.multi-filter-v16[data-target="'+target+'"] label[data-service]').forEach(l=>l.style.display='block');
    qsa('.multi-filter-v16[data-target="'+target+'"] .no-status-label-v24').forEach(l=>l.style.display='none');
    qsa('.multi-filter-v16[data-target="'+target+'"] .multi-label').forEach(b=>{const box=b.closest('.multi-filter-v16');b.textContent=labelAllText(box.dataset.key);});
    const search=qs('#txMainSearch'); if(search)search.value='';
    qsa('.'+target).forEach(r=>{r.dataset.searchHidden='0';r.style.display='';}); updateStatusBox(target); applyV25Filters(target);
  };
  window.toggleTxColumnV25=function(col,show){
    qsa('#transactionsTable [data-col="'+col+'"]').forEach(el=>{el.style.display=show?'':'none';});
    qsa('#transactionsPreview [data-col="'+col+'"], .preview-modal-v22 [data-col="'+col+'"]').forEach(el=>{el.style.display=show?'':'none';});
  };
  document.addEventListener('DOMContentLoaded',()=>{qsa('.multi-filter-v16[data-key="service"]').forEach(box=>updateStatusBox(box.dataset.target||'txrow'));applyV25Filters('txrow');});
})();

/* ===== V26 final linked filters: status/service note + all check ===== */
(function(){
  function qs(s,r){return (r||document).querySelector(s)}
  function qsa(s,r){return Array.from((r||document).querySelectorAll(s))}
  function activeStatusLabels(box){return qsa('label[data-service]',box).filter(l=>l.style.display!=='none')}
  function activeChecks(box){return qsa('input[type=checkbox]:not([data-all])',box).filter(c=>!c.disabled && c.closest('label') && c.closest('label').style.display!=='none')}
  function labelAll(k){return k==='service'?'كل الخدمات':k==='status'?'كل الحالات':k==='currency'?'كل العملات':k==='activity'?'الكل':k==='visa_type'?'كل الأنواع':k==='remain'?'الكل':'الكل'}
  function labelPart(k){return k==='service'?'الخدمات المحددة فقط':k==='status'?'الحالات المحددة فقط':k==='currency'?'العملات المحددة فقط':k==='activity'?'نوع النشاط المحدد فقط':k==='visa_type'?'الأنواع المحددة فقط':k==='remain'?'المبالغ المحددة فقط':'المحدد فقط'}
  function selected(box){return activeChecks(box).filter(c=>c.checked).map(c=>String(c.value))}
  function setLabel(box){const lab=qs('.multi-label',box),key=box.dataset.key;if(!lab)return;const a=activeChecks(box),sel=selected(box);if(key==='status'&&a.length===0){lab.textContent='لا توجد حالات لهذه المعاملات';return;}lab.textContent=(a.length>0&&sel.length===a.length)?labelAll(key):labelPart(key)}
  window.updateLinkedStatusV26=function(target){
    const serviceBox=qs('.multi-filter-v16[data-target="'+target+'"][data-key="service"]');
    const statusBox=qs('.multi-filter-v16[data-target="'+target+'"][data-key="status"]'); if(!serviceBox||!statusBox)return;
    const svcChecks=activeChecks(serviceBox), svcSel=selected(serviceBox), allSvc=(svcChecks.length>0&&svcSel.length===svcChecks.length);
    let visible=0;
    qsa('label[data-service]',statusBox).forEach(l=>{const sid=String(l.dataset.service||'');const show=allSvc||svcSel.includes(sid);l.style.display=show?'block':'none';const c=qs('input[type=checkbox]',l);if(c){c.disabled=!show;if(!show)c.checked=false;else c.checked=true;}if(show)visible++;});
    const no=qs('.no-status-label-v24',statusBox);if(no)no.style.display=visible===0?'block':'none';
    const all=qs('input[data-all]',statusBox);if(all){all.disabled=visible===0;all.checked=visible>0;}
    setLabel(statusBox);
  }
  window.multiFilterChanged=function(chk){
    const box=chk.closest('.multi-filter-v16'); if(!box)return; const target=box.dataset.target||'txrow'; const key=box.dataset.key;
    const all=qs('input[data-all]',box);
    if(chk.hasAttribute('data-all')) activeChecks(box).forEach(c=>c.checked=chk.checked);
    else if(all){const a=activeChecks(box);all.checked=a.length>0&&a.every(c=>c.checked);}
    if(key==='service') updateLinkedStatusV26(target);
    setLabel(box); const st=qs('.multi-filter-v16[data-target="'+target+'"][data-key="status"]'); if(st)setLabel(st);
    applyV26Filters(target);
  }
  window.applyV26Filters=function(target){target=target||'txrow';const boxes=qsa('.multi-filter-v16[data-target="'+target+'"]');qsa('.'+target).forEach(r=>{let show=r.dataset.searchHidden!=='1';boxes.forEach(box=>{const key=box.dataset.key;const a=activeChecks(box);if(key==='status'&&a.length===0)return;const vals=selected(box);const all=a.length>0&&vals.length===a.length;if(key==='remain'){if(!vals.includes('all')&&!vals.includes(String(r.dataset.remain||'zero')))show=false;return;}if(key==='currency'&&target==='txrow'){const rc=(r.dataset.remainCurrencies||'').split(',').filter(Boolean);const txcur=String(r.dataset.currency||'1');if(!all&&!vals.includes(txcur)&&!vals.some(v=>rc.includes(v)))show=false;return;}const rv=String(r.dataset[key]||'0');if(!all&&!vals.includes(rv))show=false;});r.style.display=show?'':'none';});}
  window.filterRows=function(input,cls){const v=String(input.value||'').trim().toLowerCase();qsa('.'+cls).forEach(r=>{r.dataset.searchHidden=(!v||r.innerText.toLowerCase().includes(v))?'0':'1';});applyV26Filters(cls)}
  window.resetV22Filters=function(target){target=target||'txrow';qsa('.multi-filter-v16[data-target="'+target+'"] input[type=checkbox]').forEach(c=>{c.disabled=false;c.checked=true});qsa('.multi-filter-v16[data-target="'+target+'"] label[data-service]').forEach(l=>l.style.display='block');qsa('.multi-filter-v16[data-target="'+target+'"] .no-status-label-v24').forEach(l=>l.style.display='none');qsa('.'+target).forEach(r=>{r.dataset.searchHidden='0';r.style.display=''});qsa('.multi-filter-v16[data-target="'+target+'"]').forEach(setLabel);updateLinkedStatusV26(target);applyV26Filters(target)}
  window.showActivityViewV26=function(id){qsa('.activity-view-v26').forEach(v=>v.classList.add('hidden'));const el=qs('#'+id);if(el)el.classList.remove('hidden')}
  window.toggleBaColumnV26=function(col,show){qsa('#baTable [data-ba-col="'+col+'"]').forEach(el=>el.style.display=show?'':'none')}
  document.addEventListener('DOMContentLoaded',()=>{qsa('.multi-filter-v16[data-key="service"]').forEach(b=>updateLinkedStatusV26(b.dataset.target||'txrow'));['txrow','strow','barow'].forEach(applyV26Filters)})
})();


/* ===== V27 final stable linked filters for transactions/status/activity ===== */
(function(){
  function qs(s,r){return (r||document).querySelector(s)}
  function qsa(s,r){return Array.from((r||document).querySelectorAll(s))}
  function getBox(target,key){return qs('.multi-filter-v16[data-target="'+target+'"][data-key="'+key+'"]')}
  function rowClass(target){return target||'txrow'}
  function labelAll(k){return k==='service'?'كل الخدمات':k==='status'?'كل الحالات':k==='currency'?'كل العملات':k==='activity'?'الكل':k==='visa_type'?'كل الأنواع':k==='remain'?'الكل':k==='customer'?'كل العملاء':k==='supplier'?'كل الموردين':k==='agent'?'كل الوكلاء':k==='office'?'كل المكاتب المخلصة':k==='sale'?'الكل':'الكل'}
  function labelPart(k){return k==='service'?'الخدمات المحددة فقط':k==='status'?'الحالات المحددة فقط':k==='currency'?'العملات المحددة فقط':k==='activity'?'نوع النشاط المحدد فقط':k==='visa_type'?'الأنواع المحددة فقط':k==='remain'?'المبالغ المحددة فقط':k==='customer'?'العملاء المحددين فقط':k==='supplier'?'الموردين المحددين فقط':k==='agent'?'الوكلاء المحددين فقط':k==='office'?'المكاتب المحددة فقط':k==='sale'?'نوع العميل المحدد فقط':'المحدد فقط'}
  function isVisibleLabel(l){return l && l.style.display!=='none'}
  function itemLabels(box){return qsa('label',box).filter(function(l){return !l.querySelector('[data-all]') && !l.classList.contains('no-status-label-v24')})}
  function activeChecks(box){return itemLabels(box).filter(isVisibleLabel).map(function(l){return qs('input[type=checkbox]',l)}).filter(function(c){return c && !c.disabled})}
  function selectedVals(box){return activeChecks(box).filter(function(c){return c.checked}).map(function(c){return String(c.value)})}
  function allSelected(box){const a=activeChecks(box), s=selectedVals(box); return a.length>0 && s.length===a.length}
  function setLabel(box){if(!box)return; const lab=qs('.multi-label',box); if(!lab)return; const key=box.dataset.key; const a=activeChecks(box); if(key==='status' && a.length===0){lab.textContent='لا توجد حالات لهذه المعاملات';return;} lab.textContent=allSelected(box)?labelAll(key):labelPart(key)}
  function syncAllCheckbox(box){const all=qs('input[data-all]',box); if(!all)return; const a=activeChecks(box); all.disabled=a.length===0; all.checked=a.length>0 && a.every(function(c){return c.checked})}
  window.filterMultiOptions=function(inp){
    const v=String(inp.value||'').trim().toLowerCase(); const drop=inp.closest('.multi-drop'); if(!drop)return;
    qsa('label',drop).forEach(function(l){
      if(l.querySelector('[data-all]') || l.classList.contains('no-status-label-v24')) return;
      const baseDisplay=l.dataset.v27BaseDisplay || l.style.display || 'block';
      if(baseDisplay==='none'){l.style.display='none';return;}
      l.style.display=(!v || l.innerText.toLowerCase().includes(v))?'block':'none';
    });
  };
  window.updateLinkedStatusV27=function(target){
    target=rowClass(target); const svc=getBox(target,'service'), st=getBox(target,'status'); if(!svc||!st)return;
    const svcChecks=activeChecks(svc); const svcSel=selectedVals(svc); const allSvc=svcChecks.length>0 && svcSel.length===svcChecks.length;
    let visible=0;
    qsa('label[data-service]',st).forEach(function(l){
      const sid=String(l.dataset.service||''); const show=allSvc || svcSel.includes(sid);
      l.dataset.v27BaseDisplay=show?'block':'none'; l.style.display=show?'block':'none';
      const c=qs('input[type=checkbox]',l); if(c){c.disabled=!show; if(show)c.checked=true; else c.checked=false;}
      if(show)visible++;
    });
    const no=qs('.no-status-label-v24',st); if(no)no.style.display=visible===0?'block':'none';
    syncAllCheckbox(st); setLabel(st);
  };
  window.multiFilterChanged=function(chk){
    const box=chk.closest('.multi-filter-v16'); if(!box)return; const key=box.dataset.key, target=rowClass(box.dataset.target);
    if(chk.hasAttribute('data-all')){activeChecks(box).forEach(function(c){c.checked=chk.checked})} else syncAllCheckbox(box);
    if(key==='service') updateLinkedStatusV27(target);
    syncAllCheckbox(box); setLabel(box);
    const st=getBox(target,'status'); if(st){syncAllCheckbox(st);setLabel(st)}
    applyV27Filters(target);
  };
  window.applyV27Filters=function(target){
    target=rowClass(target); const boxes=qsa('.multi-filter-v16[data-target="'+target+'"]');
    qsa('.'+target).forEach(function(r){
      let show=r.dataset.searchHidden!=='1';
      boxes.forEach(function(box){
        const key=box.dataset.key; const vals=selectedVals(box); const a=activeChecks(box); const all=a.length>0 && vals.length===a.length;
        if(key==='status' && a.length===0) return;
        if(key==='remain'){
          const rv=String(r.dataset.remain||'zero'); if(!vals.includes('all') && !vals.includes(rv)) show=false; return;
        }
        if(key==='currency'){
          const txcur=String(r.dataset.currency||'1'); const rc=(r.dataset.remainCurrencies||'').split(',').filter(Boolean);
          if(!all && !vals.includes(txcur) && !vals.some(function(v){return rc.includes(v)})) show=false; return;
        }
        const rv=String(r.dataset[key]||'0'); if(!all && !vals.includes(rv)) show=false;
      });
      r.style.display=show?'':'none';
    });
  };
  window.filterRows=function(input,cls){
    const v=String(input.value||'').trim().toLowerCase();
    qsa('.'+cls).forEach(function(r){r.dataset.searchHidden=(!v || r.innerText.toLowerCase().includes(v))?'0':'1'});
    if(qs('.multi-filter-v16[data-target="'+cls+'"]')) applyV27Filters(cls); else qsa('.'+cls).forEach(function(r){r.style.display=r.dataset.searchHidden==='1'?'none':''});
  };
  window.resetV22Filters=function(target){
    target=rowClass(target); qsa('.multi-filter-v16[data-target="'+target+'"] input[type=checkbox]').forEach(function(c){c.disabled=false;c.checked=true});
    qsa('.multi-filter-v16[data-target="'+target+'"] label[data-service]').forEach(function(l){l.style.display='block';l.dataset.v27BaseDisplay='block'});
    qsa('.multi-filter-v16[data-target="'+target+'"] .no-status-label-v24').forEach(function(l){l.style.display='none'});
    qsa('.'+target).forEach(function(r){r.dataset.searchHidden='0';r.style.display=''});
    updateLinkedStatusV27(target); qsa('.multi-filter-v16[data-target="'+target+'"]').forEach(function(b){syncAllCheckbox(b);setLabel(b)}); applyV27Filters(target);
  };
  document.addEventListener('DOMContentLoaded',function(){
    qsa('.multi-filter-v16[data-key="service"]').forEach(function(b){updateLinkedStatusV27(b.dataset.target||'txrow')});
    qsa('.multi-filter-v16').forEach(function(b){syncAllCheckbox(b);setLabel(b)});
    ['txrow','strow','barow','trrow','reverseRow'].forEach(function(t){if(qs('.'+t))applyV27Filters(t)});
  });
})();


/* ===== V28 verified final linked filters ===== */
(function(){
  const qs=(s,r=document)=>r.querySelector(s); const qsa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  function rowClass(t){return t||'txrow'}
  function box(target,key){return qs('.multi-filter-v16[data-target="'+target+'"][data-key="'+key+'"]')}
  function labels(b){return qsa('label',b).filter(l=>!l.classList.contains('no-status-label-v24') && !qs('input[data-all]',l));}
  function visibleLabels(b){return labels(b).filter(l=>l.style.display!=='none' && l.dataset.v28Hidden!=='1');}
  function checks(b){return visibleLabels(b).map(l=>qs('input[type=checkbox]',l)).filter(Boolean);}
  function checkedVals(b){return checks(b).filter(c=>c.checked).map(c=>String(c.value));}
  function allBox(b){return qs('input[data-all]',b)}
  function allText(k){return k==='service'?'كل الخدمات':k==='status'?'كل الحالات':k==='customer'?'كل العملاء':k==='supplier'?'كل الموردين':k==='agent'?'كل الوكلاء':k==='office'?'كل المكاتب':k==='currency'?'كل العملات':k==='visa_type'?'كل الأنواع':k==='remain'?'الكل':'الكل'}
  function partText(k){return k==='service'?'الخدمات المحددة فقط':k==='status'?'الحالات المحددة فقط':k==='customer'?'العملاء المحددين فقط':k==='supplier'?'الموردين المحددين فقط':k==='agent'?'الوكلاء المحددين فقط':k==='office'?'المكاتب المحددة فقط':k==='currency'?'العملات المحددة فقط':k==='visa_type'?'الأنواع المحددة فقط':k==='remain'?'المتبقي المحدد فقط':'المحدد فقط'}
  function syncAll(b){const a=allBox(b), cs=checks(b); if(a) a.checked=cs.length>0 && cs.every(c=>c.checked);}
  function setBtn(b){const btn=qs('.multi-label',b); if(!btn)return; const k=b.dataset.key, cs=checks(b); if(k==='status' && cs.length===0){btn.textContent='لا توجد حالات لهذه المعاملات';return;} btn.textContent=(cs.length>0 && cs.every(c=>c.checked))?allText(k):partText(k);}
  function resetSearchVisibility(b){labels(b).forEach(l=>{ if(!l.dataset.v28Base)l.dataset.v28Base='1'; if(l.dataset.v28Hidden==='1') l.style.display='none'; else l.style.display='block'; });}
  function updateStatus(target, resetVisible=true){
    target=rowClass(target); const svc=box(target,'service'), st=box(target,'status'); if(!svc||!st)return;
    const svcChecks=checks(svc); const selected=svcChecks.filter(c=>c.checked).map(c=>String(c.value)); const allSvc=svcChecks.length>0 && selected.length===svcChecks.length;
    let visible=0;
    labels(st).forEach(l=>{
      const sid=String(l.dataset.service||''); const show=allSvc || selected.includes(sid);
      l.dataset.v28Hidden=show?'0':'1'; l.style.display=show?'block':'none';
      const c=qs('input[type=checkbox]',l); if(c){ if(show){visible++; if(resetVisible)c.checked=true;} else c.checked=false; }
    });
    const note=qs('.no-status-label-v24',st); if(note)note.style.display=visible===0?'block':'none';
    syncAll(st); setBtn(st);
  }
  window.filterMultiOptions=function(inp){const v=String(inp.value||'').trim().toLowerCase();const d=inp.closest('.multi-drop');if(!d)return;labels(d).forEach(l=>{if(l.dataset.v28Hidden==='1'){l.style.display='none';return;} const t=(l.dataset.text||l.innerText||'').toLowerCase();l.style.display=(!v||t.includes(v))?'block':'none';});};
  window.multiFilterChanged=function(chk){const b=chk.closest('.multi-filter-v16'); if(!b)return; const target=rowClass(b.dataset.target), key=b.dataset.key; const active=checks(b);
    if(chk.hasAttribute('data-all')) active.forEach(c=>c.checked=chk.checked); else syncAll(b);
    if(key==='service') updateStatus(target,true); else {syncAll(b); setBtn(b);} 
    const st=box(target,'status'); if(st){syncAll(st);setBtn(st);} setBtn(b); applyV28Filters(target);
  };
  window.applyV28Filters=function(target){target=rowClass(target); const boxes=qsa('.multi-filter-v16[data-target="'+target+'"]'); qsa('.'+target).forEach(r=>{let show=r.dataset.searchHidden!=='1'; boxes.forEach(b=>{const k=b.dataset.key; const cs=checks(b); if(k==='status' && cs.length===0)return; const vals=checkedVals(b); const all=cs.length>0&&vals.length===cs.length; if(all)return; if(k==='remain'){ if(vals.includes('all'))return; if(!vals.includes(String(r.dataset.remain||'zero')))show=false; return; } if(k==='currency' && target==='txrow'){ const rem=(r.dataset.remainCurrencies||'').split(',').filter(Boolean); const tx=String(r.dataset.currency||'1'); const remainMode=box(target,'remain'); const remVals=remainMode?checkedVals(remainMode):['all']; const filteringRemainHas=remVals.includes('has')&&!remVals.includes('all'); if(filteringRemainHas){ if(!vals.some(v=>rem.includes(v)))show=false; } else if(!vals.includes(tx) && !vals.some(v=>rem.includes(v)))show=false; return; } const rv=String(r.dataset[k]||'0'); if(!vals.includes(rv))show=false; }); r.style.display=show?'':'none';});};
  window.filterRows=function(input,cls){const v=String(input.value||'').trim().toLowerCase();qsa('.'+cls).forEach(r=>{r.dataset.searchHidden=(!v||r.innerText.toLowerCase().includes(v))?'0':'1';}); if(qs('.multi-filter-v16[data-target="'+cls+'"]'))applyV28Filters(cls); else qsa('.'+cls).forEach(r=>r.style.display=r.dataset.searchHidden==='1'?'none':'');};
  window.resetV22Filters=function(target){target=rowClass(target); qsa('.multi-filter-v16[data-target="'+target+'"] input[type=checkbox]').forEach(c=>{c.disabled=false;c.checked=true;}); qsa('.multi-filter-v16[data-target="'+target+'"] label[data-service]').forEach(l=>{l.dataset.v28Hidden='0';l.style.display='block';}); qsa('.multi-filter-v16[data-target="'+target+'"] .no-status-label-v24').forEach(l=>l.style.display='none'); qsa('.'+target).forEach(r=>{r.dataset.searchHidden='0';r.style.display='';}); updateStatus(target,true); qsa('.multi-filter-v16[data-target="'+target+'"]').forEach(b=>{syncAll(b);setBtn(b)}); applyV28Filters(target);};
  window.toggleMultiDrop=function(btn){const b=btn.closest('.multi-filter-v16'); if(!b)return; qsa('.multi-filter-v16.open').forEach(x=>{if(x!==b)x.classList.remove('open')}); b.classList.toggle('open'); const inp=qs('.multi-drop input',b); if(b.classList.contains('open')&&inp){inp.value='';filterMultiOptions(inp);setTimeout(()=>inp.focus(),20);} };
  document.addEventListener('click',e=>{if(!e.target.closest('.multi-filter-v16'))qsa('.multi-filter-v16.open').forEach(b=>b.classList.remove('open'));},true);
  document.addEventListener('DOMContentLoaded',()=>{['txrow','strow','barow'].forEach(t=>{updateStatus(t,true); qsa('.multi-filter-v16[data-target="'+t+'"]').forEach(b=>{syncAll(b);setBtn(b)}); applyV28Filters(t);});});
})();


/* ===== V29 authoritative linked filters: service/status + remaining/currency ===== */
(function(){
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const targets=['txrow','strow','barow'];
  const ALL_TEXT={service:'كل الخدمات',status:'كل الحالات',customer:'كل العملاء',supplier:'كل الموردين',agent:'كل الوكلاء',office:'كل المكاتب',sale:'الكل',visa_type:'كل الأنواع',remain:'الكل',currency:'كل العملات',activity:'الكل'};
  const PART_TEXT={service:'الخدمات المحددة فقط',status:'الحالات المحددة فقط',customer:'العملاء المحددون فقط',supplier:'الموردون المحددون فقط',agent:'الوكلاء المحددون فقط',office:'المكاتب المحددة فقط',sale:'المحدد فقط',visa_type:'الأنواع المحددة فقط',remain:'المبالغ المحددة فقط',currency:'العملات المحددة فقط',activity:'نوع النشاط المحدد فقط'};
  function rowClass(target){return (target||'').replace(/^\./,'')||'txrow'}
  function boxes(target){return $$('.multi-filter-v16[data-target="'+rowClass(target)+'"]')}
  function box(target,key){return $('.multi-filter-v16[data-target="'+rowClass(target)+'"][data-key="'+key+'"]')}
  function labels(b){return $$('label',b).filter(l=>!l.querySelector('input[data-all]') && !l.classList.contains('no-status-label-v24'))}
  function checks(b){return labels(b).map(l=>l.querySelector('input[type="checkbox"]')).filter(Boolean)}
  function activeLabels(b){return labels(b).filter(l=>l.dataset.v29Hidden!=='1')}
  function activeChecks(b){return activeLabels(b).map(l=>l.querySelector('input[type="checkbox"]')).filter(Boolean)}
  function allCheck(b){return $('input[data-all]',b)}
  function selectedValues(b){return activeChecks(b).filter(c=>c.checked && !c.disabled).map(c=>String(c.value))}
  function allSelected(b){const a=activeChecks(b).filter(c=>!c.disabled); return a.length>0 && a.every(c=>c.checked)}
  function key(b){return b?.dataset?.key||''}
  function labelTextOf(l){return (l.dataset.text||l.textContent||'').replace(/^\s*/,'').trim()}
  function setLabel(b){
    if(!b)return; const k=key(b); const btn=$('.multi-label',b); if(!btn)return;
    btn.classList.remove('v29-empty','v29-part');
    const a=activeChecks(b).filter(c=>!c.disabled);
    if(k==='status' && a.length===0){btn.textContent='لا توجد حالات لهذه المعاملات'; btn.classList.add('v29-empty'); return;}
    if(allSelected(b)){btn.textContent=ALL_TEXT[k]||'الكل'; return;}
    const sel=activeLabels(b).filter(l=>{const c=l.querySelector('input[type="checkbox"]'); return c&&c.checked&&!c.disabled;}).map(labelTextOf).filter(Boolean);
    if(k==='status' && sel.length>0 && sel.length<=3){btn.textContent=sel.join('، '); btn.classList.add('v29-part'); return;}
    btn.textContent=PART_TEXT[k]||'المحدد فقط'; btn.classList.add('v29-part');
  }
  function syncAll(b){const all=allCheck(b); if(all){all.checked=allSelected(b); all.disabled=(key(b)==='status' && activeChecks(b).filter(c=>!c.disabled).length===0);} setLabel(b)}
  function setHiddenLabel(l,hidden){l.dataset.v29Hidden=hidden?'1':'0'; l.style.display=hidden?'none':'block'; const c=l.querySelector('input[type="checkbox"]'); if(c){c.disabled=hidden; if(hidden)c.checked=false;}}
  function selectedServices(target){const b=box(target,'service'); if(!b)return []; const a=activeChecks(b); const all=a.length && a.every(c=>c.checked); return all?[]:a.filter(c=>c.checked).map(c=>String(c.value));}
  function updateStatusOptions(target,resetToChecked=true){
    target=rowClass(target); const sb=box(target,'status'); if(!sb)return;
    const services=selectedServices(target); const allServices=services.length===0;
    let visible=0;
    labels(sb).forEach(l=>{
      const sid=String(l.dataset.service||'');
      const show=allServices || (sid && services.includes(sid));
      setHiddenLabel(l,!show);
      const c=l.querySelector('input[type="checkbox"]');
      if(show){visible++; if(resetToChecked && c)c.checked=true;}
    });
    const no=$('.no-status-label-v24',sb);
    if(no){ no.style.display=visible===0?'block':'none'; }
    const all=allCheck(sb); if(all){ all.disabled=visible===0; if(resetToChecked)all.checked=visible>0; }
    syncAll(sb);
  }
  function rowPassBox(row,b){
    const k=key(b); const vals=selectedValues(b); const a=activeChecks(b).filter(c=>!c.disabled);
    if(k==='status' && a.length===0) return true; // no statuses means do not accidentally hide everything
    if(vals.length===0 || vals.length===a.length) return true;
    if(k==='currency' && row.classList.contains('txrow')){
      const remainBox=box('txrow','remain'); const remainVals=remainBox?selectedValues(remainBox):[];
      const onlyHas=remainVals.length===1 && remainVals[0]==='has';
      const anyHas=remainVals.length===0 || remainVals.includes('has');
      const rowCurrencies=String(row.dataset.remainCurrencies||'').split(',').filter(Boolean);
      if(row.dataset.remain==='zero') return !onlyHas && !anyHas ? true : false;
      return rowCurrencies.some(v=>vals.includes(String(v)));
    }
    if(k==='remain'){
      if(vals.includes('all')) return true;
      if(vals.includes('has') && row.dataset.remain==='has') return true;
      if(vals.includes('zero') && row.dataset.remain==='zero') return true;
      return false;
    }
    const rv=String(row.dataset[k]??'0');
    return vals.includes(rv);
  }
  function applyFilters(target){
    target=rowClass(target); const bs=boxes(target); const rows=$$('.'+target);
    rows.forEach(row=>{
      let ok=row.dataset.searchHidden!=='1';
      if(ok){ for(const b of bs){ if(!rowPassBox(row,b)){ok=false;break;} } }
      row.style.display=ok?'':'none';
    });
    bs.forEach(syncAll);
  }
  window.filterRows=function(input,cls){
    cls=rowClass(cls); const v=String(input.value||'').trim().toLowerCase();
    $$('.'+cls).forEach(r=>{r.dataset.searchHidden=(!v || r.innerText.toLowerCase().includes(v))?'0':'1';});
    if(targets.includes(cls)) applyFilters(cls); else $$('.'+cls).forEach(r=>r.style.display=r.dataset.searchHidden==='1'?'none':'');
  };
  window.multiFilterChanged=function(chk){
    const b=chk.closest('.multi-filter-v16'); if(!b)return; const target=rowClass(b.dataset.target); const k=key(b);
    if(chk.hasAttribute('data-all')){ activeChecks(b).filter(c=>!c.disabled).forEach(c=>c.checked=chk.checked); }
    // regular checkbox automatically makes all checkbox accurate
    syncAll(b);
    if(k==='service') updateStatusOptions(target,true);
    if(k==='status') syncAll(b);
    applyFilters(target);
  };
  window.filterMultiOptions=function(inp){
    const d=inp.closest('.multi-drop'); if(!d)return; const b=d.closest('.multi-filter-v16'); const v=String(inp.value||'').trim().toLowerCase();
    labels(b).forEach(l=>{
      if(l.dataset.v29Hidden==='1'){l.style.display='none';return;}
      const text=(l.dataset.text||l.innerText||'').toLowerCase(); l.style.display=(!v||text.includes(v))?'block':'none';
    });
    const no=$('.no-status-label-v24',b); if(no && key(b)==='status') no.style.display=activeChecks(b).filter(c=>!c.disabled).length===0?'block':'none';
  };
  window.resetV22Filters=function(target){
    target=rowClass(target); boxes(target).forEach(b=>{labels(b).forEach(l=>{setHiddenLabel(l,false); const c=l.querySelector('input[type="checkbox"]'); if(c){c.disabled=false;c.checked=true;}}); const a=allCheck(b); if(a){a.disabled=false;a.checked=true;} const no=$('.no-status-label-v24',b); if(no)no.style.display='none'; setLabel(b);});
    $$('.'+target).forEach(r=>{r.dataset.searchHidden='0'; r.style.display='';}); updateStatusOptions(target,true); applyFilters(target);
  };
  window.applyV28Filters=applyFilters; window.applyV27Filters=applyFilters; window.applyV20MultiFilters=applyFilters;
  document.addEventListener('DOMContentLoaded',()=>{targets.forEach(t=>{updateStatusOptions(t,false); boxes(t).forEach(syncAll); applyFilters(t);});});
})();

// V45: إشعارات داخل النظام بدون قفز الصفحة للأعلى
(function(){
  window.systemToastV45=function(message,type,opts){
    opts=opts||{};
    var root=document.getElementById('systemToastRoot');
    if(!root){root=document.createElement('div');root.id='systemToastRoot';root.className='toast-root-v45';document.body.appendChild(root);}
    var pos=opts.position||'top-right';
    root.className='toast-root-v45 '+pos;
    var el=document.createElement('div');
    el.className='toast-v45 '+(type||'info');
    var close=document.createElement('button');close.className='toast-close';close.type='button';close.textContent='×';close.onclick=function(){el.remove();};
    el.appendChild(close);el.appendChild(document.createTextNode(message||'تم تنفيذ العملية'));
    root.appendChild(el);
    var dur=(opts.duration||5)*1000; if(dur>0)setTimeout(function(){if(el.parentNode)el.remove();},dur);
    try{ if(opts.sound){ var a=new Audio(); a.volume=.20; } }catch(e){}
  };
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href="#"]');
    if(a){e.preventDefault();}
  },true);
})();
