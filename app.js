
(function(){
  var body=document.body;
  // 语言
  var lang=localStorage.getItem('macro-lang')||'both';
  applyLang(lang);
  document.querySelectorAll('.seg button').forEach(function(b){
    if(b.dataset.lang===lang) b.classList.add('on');
    b.addEventListener('click',function(){
      document.querySelectorAll('.seg button').forEach(function(x){x.classList.remove('on')});
      b.classList.add('on'); applyLang(b.dataset.lang);
    });
  });
  function applyLang(v){
    body.classList.remove('lang-en','lang-zh');
    if(v==='en') body.classList.add('lang-en');
    if(v==='zh') body.classList.add('lang-zh');
    localStorage.setItem('macro-lang',v);
  }
  // 字号
  var fs=parseInt(localStorage.getItem('macro-fs')||'16',10);
  document.documentElement.style.fontSize=fs+'px';
  document.querySelectorAll('[data-fs]').forEach(function(b){
    b.addEventListener('click',function(){
      fs=Math.min(21,Math.max(14,fs+parseInt(b.dataset.fs,10)));
      document.documentElement.style.fontSize=fs+'px';
      localStorage.setItem('macro-fs',fs);
    });
  });
  // 侧栏
  document.querySelectorAll('.chap').forEach(function(a){
    a.addEventListener('click',function(e){
      var g=document.querySelector(a.getAttribute('href'));
      if(g&&g.classList.contains('pages')&&!a.classList.contains('on')){
        e.preventDefault(); g.classList.toggle('open');
      }
    });
  });
  var cur=document.querySelector('.chap.on');
  if(cur){var g=document.querySelector(cur.getAttribute('href')); if(g) g.classList.add('open');}
  var mb=document.getElementById('menu'), sb=document.querySelector('.sidebar');
  if(mb) mb.addEventListener('click',function(){sb.classList.toggle('open')});
  // 进度 + 当前页
  var bar=document.getElementById('progress');
  var links=[].slice.call(document.querySelectorAll('.pages a'));
  var secs=[].slice.call(document.querySelectorAll('section.page'));
  function onScroll(){
    var h=document.documentElement;
    var p=h.scrollTop/(h.scrollHeight-h.clientHeight||1);
    if(bar) bar.style.width=(p*100)+'%';
    var top=h.scrollTop+140, cur=null;
    secs.forEach(function(s){ if(s.offsetTop<=top) cur=s; });
    if(cur) links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+cur.id)});
  }
  document.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  // 表格滚动容器
  document.querySelectorAll('main table').forEach(function(t){
    if(t.parentElement&&t.parentElement.classList.contains('tw')) return;
    var w=document.createElement('div'); w.className='tw';
    t.parentNode.insertBefore(w,t); w.appendChild(t);
  });
  // 灯箱
  var lb=document.getElementById('lb'), lbimg=lb?lb.querySelector('img'):null;
  document.querySelectorAll('main img').forEach(function(im){
    im.addEventListener('click',function(){ lbimg.src=im.src; lb.classList.add('on'); });
  });
  if(lb){lb.addEventListener('click',function(){lb.classList.remove('on'); lbimg.src='';});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'){lb.classList.remove('on');lbimg.src='';}});}
  // 键盘翻页
  var prev=document.querySelector('.pager a:not(.r)'), next=document.querySelector('.pager a.r');
  document.addEventListener('keydown',function(e){
    if(e.target.tagName==='INPUT') return;
    if(e.key==='ArrowLeft'&&prev) location.href=prev.href;
    if(e.key==='ArrowRight'&&next) location.href=next.href;
  });
  // 搜索
  var box=document.getElementById('search'), res=document.getElementById('results');
  if(!box||!res) return;
  var idx=(window.SEARCH_INDEX||[]);
  function esc(s){return s.replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c]})}
  function hl(s,q){var i=s.toLowerCase().indexOf(q); if(i<0) return esc(s);
    return esc(s.slice(0,i))+'<mark>'+esc(s.slice(i,i+q.length))+'</mark>'+esc(s.slice(i+q.length));}
  var t=null;
  box.addEventListener('input',function(){
    clearTimeout(t); var q=box.value.trim().toLowerCase();
    if(!q){res.classList.remove('on');res.innerHTML='';return;}
    t=setTimeout(function(){
      var hits=idx.filter(function(d){return (d.t+' '+d.x+' '+d.p).toLowerCase().indexOf(q)>=0}).slice(0,30);
      res.innerHTML=hits.map(function(d){
        var i=d.x.toLowerCase().indexOf(q);
        var snip=i>=0? d.x.slice(Math.max(0,i-34),i+76) : d.x.slice(0,86);
        return '<a href="'+d.u+'#'+d.a+'"><div class="r-t">'+d.p+'　'+hl(d.t,q)+'</div>'+
               '<div class="r-m">'+hl(snip,q)+'…</div></a>';
      }).join('')||'<a><div class="r-t">无匹配</div></a>';
      res.classList.add('on');
    },110);
  });
  document.addEventListener('click',function(e){
    if(!res.contains(e.target)&&e.target!==box) res.classList.remove('on');
  });
  if(location.hash){var el=document.querySelector(location.hash);
    if(el){el.scrollIntoView();el.style.transition='background .7s';el.style.background='#F7EFE6';
      setTimeout(function(){el.style.background='';},1300);}}
})();
