// Apply text before charts, videos, and mathematical typography initialize.
(function(){
 const cfg=window.SITE_CONTENT, map=window.SITE_CONTENT_MAP;
 const walker=document.createTreeWalker(document.documentElement,NodeFilter.SHOW_TEXT);
 const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
 nodes.forEach(node=>{
  if(node.parentElement.closest('script,style,svg,math,pre,code'))return;
  const key=map[node.textContent.trim()];
  if(key && Object.hasOwn(cfg.text,key)) {
   const old=node.textContent;
   node.textContent=old.slice(0,old.length-old.trimStart().length)+cfg.text[key]+old.slice(old.trimEnd().length);
  }
 });
 document.querySelectorAll('[data-edit-link]').forEach(a=>{
  const entry=cfg.links[Number(a.dataset.editLink)]; if(entry)a.setAttribute('href',entry.href);
 });
})();
