/* ASLab Software: live GitHub repository catalogue with search + language filters (moved out of software.html unchanged). */
(() => {
  const grid=document.getElementById('repoGrid'), search=document.getElementById('repoSearch'), status=document.getElementById('repoStatus'), empty=document.getElementById('repoEmpty'), label=document.getElementById('repoLabel');
  let repos=[], active='all';
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const matchesLanguage=r => active==='all' || (active==='Other' ? !['Python','Jupyter Notebook','HTML','C++'].includes(r.language||'') : (r.language||'')===active);
  function render(){
    const q=(search.value||'').trim().toLowerCase();
    const shown=repos.filter(r=>matchesLanguage(r)&&(!q||`${r.name} ${r.description||''} ${r.language||''}`.toLowerCase().includes(q)));
    grid.innerHTML=shown.map(r=>`<article class="card repo-card"><div class="repo-language">${esc(r.language||'Other')}</div><h3>${esc(r.name)}</h3><p class="desc">${esc(r.description||'Public ASLab GitHub repository.')}</p><div class="badges"><span class="badge">★ ${r.stargazers_count||0}</span><span class="badge">${esc(r.language||'Other')}</span></div><a class="card-link" href="${esc(r.html_url)}" target="_blank" rel="noopener">Open repository ↗</a></article>`).join('');
    empty.hidden=shown.length>0; label.textContent=active==='all'?'All repositories':active;
  }
  search.addEventListener('input',render);
  document.querySelectorAll('.repo-filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.repo-filter').forEach(x=>x.classList.remove('active'));btn.classList.add('active');active=btn.dataset.language;render();}));
  fetch('https://api.github.com/users/asamallab/repos?per_page=100&sort=stars&direction=desc')
    .then(r=>{if(!r.ok)throw new Error();return r.json();})
    .then(data=>{repos=Array.isArray(data)?data.filter(r=>!r.archived):[];status.textContent='';render();})
    .catch(()=>{status.innerHTML='The live catalogue could not be loaded. <a href="https://github.com/asamallab" target="_blank" rel="noopener">Open the ASLab GitHub profile ↗</a>';grid.innerHTML='';});
})();
