
// Preserve words and values; only typeset inline mathematical symbols.
(function(){
 const glyphs={'ψ':'𝜓','α':'𝛼','ε':'𝜀','ϵ':'𝜖','φ':'𝜑','ϕ':'𝜙','λ':'𝜆','η':'𝜂','π':'𝜋','ℓ':'ℓ'};
 const pattern=/[ψαεϵφϕληπℓ]/g;
 const scope=document.querySelector('main');
 if(!scope)return;
 function typeset(){
  const walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT);
  const nodes=[];let n;
  while(n=walker.nextNode()){
   if(!n.parentElement||n.parentElement.closest('script,style,svg,math,pre,code,select,textarea,.math-inline'))continue;
   pattern.lastIndex=0;if(pattern.test(n.nodeValue))nodes.push(n);
  }
  for(const node of nodes){
   const text=node.nodeValue;const fragment=document.createDocumentFragment();let start=0;
   pattern.lastIndex=0;let match;
   while(match=pattern.exec(text)){
    fragment.appendChild(document.createTextNode(text.slice(start,match.index)));
    const symbol=document.createElement('span');symbol.className='math-inline';
    symbol.textContent=glyphs[match[0]];symbol.setAttribute('aria-label',match[0]);
    fragment.appendChild(symbol);start=match.index+match[0].length;
   }
   fragment.appendChild(document.createTextNode(text.slice(start)));node.replaceWith(fragment);
  }
 }
 typeset();
 const observer=new MutationObserver(()=>{observer.disconnect();typeset();observer.observe(scope,{childList:true,subtree:true,characterData:true});});
 observer.observe(scope,{childList:true,subtree:true,characterData:true});
})();
