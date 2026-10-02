/* ASLab Publications — search, year / research-area filters, sorting, Latest 5, metrics, per-area counts.
   Every link, web page and media-coverage item is shown on the publication card itself (no side panel).
   Needs publications-data.js loaded first (defines `publications` and `thesis`). */
const state={year:'all',area:'all',query:'',sort:'newest',recent:false};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const normalize=s=>(s||'').toLowerCase();
function matches(p){
  const text=normalize([p.title,p.authors,p.journal,p.area].join(' '));
  const q=normalize(state.query).trim();
  const yearOk=state.year==='all'||(state.year==='older'?p.year<2022:String(p.year)===state.year);
  const areaOk=state.area==='all'||p.area===state.area;
  return yearOk&&areaOk&&(!q||text.includes(q));
}
function filtered(){
  let a=publications.filter(matches);
  a.sort((x,y)=>state.sort==='oldest'?x.year-y.year:state.sort==='title'?x.title.localeCompare(y.title):y.year-x.year);
  if(state.recent)a=a.slice(0,5);
  return a;
}
function render(){
  const data=filtered(), list=$('#publicationList');
  $('#emptyState').hidden=data.length!==0;
  renderMetrics(data);
  list.innerHTML=data.map((p,i)=>`<article class="pub-row">
    <div class="pub-number">${String(i+1).padStart(2,'0')}</div>
    <div class="pub-main"><h3><a href="${safeUrl(p.href)}" target="_blank" rel="noopener">${esc(p.title)}</a></h3><div class="pub-authors">${esc(p.authors)}</div><div class="pub-meta">${esc(p.journal)} · ${p.year}</div><div class="pub-tags"><span class="pub-tag">${esc(p.area)}</span>${p.status==='Submitted'?'<span class="pub-tag">Submitted</span>':''}</div>${extras(p)}</div>
  </article>`).join('');
  renderAreaCounts();
  $('#activeLabel').textContent=state.area!=='all'?state.area:state.year==='all'?'All publications':state.year==='older'?'Before 2022':state.year;
  renderThesis();
}
/* Metrics for whatever is currently shown (selected year / research area / search / Latest 5). */
function selectionLabel(){
  const parts=[];
  if(state.recent)parts.push('Latest 5');
  else if(state.year!=='all')parts.push(state.year==='older'?'Before 2022':state.year);
  if(state.area!=='all')parts.push(state.area);
  if(state.query.trim()!=='')parts.push('\u201c'+state.query.trim()+'\u201d');
  return parts.length?parts.join(' \u00b7 '):'All publications';
}
function renderMetrics(data){
  const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};
  const areas={};
  data.forEach(p=>{areas[p.area]=(areas[p.area]||0)+1});
  const names=Object.keys(areas).sort((a,b)=>areas[b]-areas[a]);
  set('metricsLabel',selectionLabel());
  set('mTotal',data.length);
  set('mPublished',data.filter(p=>p.status==='Published').length);
  set('mPreprint',data.filter(p=>p.status!=='Published').length);
  set('mAreas',names.length);
  set('mTop',names.length?names[0]+' ('+areas[names[0]]+')':'\u2014');
}
/* Links, web pages, media coverage and notes from the original record (title, authors, journal, year,
   preprint and research area are already shown on the card, so they are left out here). */
function extras(p){
  const h=(p.html||'').replace(/<h4>[\s\S]*?<\/h4>/,'')
    .replace(/<p>\s*<strong>\s*(Authors|Journal|Year|Preprint|Research Area):<\/strong>[\s\S]*?<\/p>/g,'').trim();
  return h?`<div class="pub-extra">${h}</div>`:'';
}
/* Number of publications per research area for the selected year + search (shown next to each area). */
function renderAreaCounts(){
  const q=normalize(state.query).trim();
  const counts={};
  publications.forEach(p=>{
    const yearOk=state.year==='all'||(state.year==='older'?p.year<2022:String(p.year)===state.year);
    const text=normalize([p.title,p.authors,p.journal,p.area].join(' '));
    if(yearOk&&(!q||text.includes(q)))counts[p.area]=(counts[p.area]||0)+1;
  });
  $$('.side-count[data-count-for]').forEach(el=>{el.textContent='('+(counts[el.dataset.countFor]||0)+')'});
}
function renderThesis(){
  const el=$('#thesisSection'); if(!el)return;
  el.innerHTML='<h3>PhD Thesis</h3>'+thesis.map(t=>`<div class="original-publication">${t.html}</div>`).join('');
  el.hidden=state.query.trim()!=='' || state.area!=='all' || state.year!=='all' || state.recent;
}
function setYear(y){state.year=y;state.recent=false;$$('.filter-button').forEach(b=>b.classList.toggle('active',b.dataset.year===y));render()}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function safeUrl(u){return /^(https?:|mailto:)/i.test(u||'')?u:'#'}
$('#searchInput').addEventListener('input',e=>{state.query=e.target.value;state.recent=false;render()});
$('#sortSelect').addEventListener('change',e=>{state.sort=e.target.value;render()});
$$('.filter-button').forEach(b=>b.addEventListener('click',()=>setYear(b.dataset.year)));
$$('.side-filter[data-area]').forEach(b=>b.addEventListener('click',()=>{state.area=b.dataset.area;state.recent=false;$$('.side-filter[data-area]').forEach(x=>x.classList.toggle('active',x===b));render()}));
$('#recentButton').addEventListener('click',()=>{state.recent=true;state.year='all';$$('.filter-button').forEach(b=>b.classList.toggle('active',b.dataset.year==='all'));render()});
$('#clearButton').addEventListener('click',()=>{state.year='all';state.area='all';state.query='';state.recent=false;$('#searchInput').value='';$$('.filter-button').forEach(b=>b.classList.toggle('active',b.dataset.year==='all'));$$('.side-filter[data-area]').forEach(b=>b.classList.toggle('active',b.dataset.area==='all'));render()});
render();
