document.getElementById('year').textContent=new Date().getFullYear();

document.querySelectorAll('a[href="#"]').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));

const people=[
['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=88','Sofía','24'],
['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=88','Valentina','27'],
['https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=700&q=88','Camila','25'],
['https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=88','Andrea','26'],
['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=88','Natalia','23'],
['https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=700&q=88','Daniela','28'],
['https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=88','Mariana','25'],
['https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=88','Paula','24'],
['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=88','Alex','26'],
['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=88','Mateo','29']
];
const deck=document.getElementById('swipeDeck'),stage=document.getElementById('partySwipeStage'),reactionHeart=document.getElementById('reactionHeart'),reactionX=document.getElementById('reactionX');
let queue=[...people],locked=false,timer=null;
function cardMarkup(person,index){const [photo,name,age]=person;return `<article class="swipe-card deck-card card-${index%4}"><div class="profile-photo" style="background-image:url('${photo}')"></div><div class="profile-shade"></div><div class="profile-meta"><strong>${name}, ${age}</strong><span>Personas del party</span></div><div class="card-badge">EN EL PARTY</div></article>`}
function renderDeck(){if(deck)deck.innerHTML=queue.slice(0,4).map(cardMarkup).join('')}
function showReaction(direction){const el=direction==='like'?reactionHeart:reactionX;el.classList.remove('show');void el.offsetWidth;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),700)}
function advance(direction){if(locked||!deck)return;const top=deck.querySelector('.deck-card');if(!top)return;locked=true;top.classList.add(direction==='like'?'leave-like':'leave-nope');showReaction(direction);setTimeout(()=>{queue.push(queue.shift());renderDeck();locked=false},620)}
renderDeck();
function startTimer(){if(timer)clearInterval(timer);timer=setInterval(()=>advance(Math.random()>.5?'like':'nope'),2400)}
startTimer();
document.getElementById('showcaseLike')?.addEventListener('click',()=>advance('like'));
document.getElementById('showcaseNope')?.addEventListener('click',()=>advance('nope'));
let startX=0,startY=0;
stage?.addEventListener('pointerdown',e=>{startX=e.clientX;startY=e.clientY;stage.setPointerCapture?.(e.pointerId)});
stage?.addEventListener('pointerup',e=>{const dx=e.clientX-startX,dy=e.clientY-startY;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy))advance(dx>0?'like':'nope')});
stage?.addEventListener('mouseenter',()=>timer&&clearInterval(timer));
stage?.addEventListener('mouseleave',startTimer);


// Scroll reveals + subtle pointer parallax for the landing page.
const revealItems=document.querySelectorAll('.reveal-section, .site-header');
const revealObserver=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target)}})
},{threshold:.12,rootMargin:'0px 0px -45px 0px'});
revealItems.forEach(el=>revealObserver.observe(el));

const page=document.body;
if(page.classList.contains('page-motion')){
  window.addEventListener('pointermove',(e)=>{
    if(window.innerWidth<900)return;
    page.style.setProperty('--mx',`${e.clientX}px`);
    page.style.setProperty('--my',`${e.clientY}px`);
  },{passive:true});
}

// Small stagger when feature cards enter the viewport.
const featureCards=[...document.querySelectorAll('.features article')];
featureCards.forEach((card,i)=>card.style.transitionDelay=`${i*70}ms`);

// Party flyer carousel: swaps the active flyer continuously, with depth and side previews.
const flyerStage=document.getElementById('flyerStage');
const flyerCards=[...document.querySelectorAll('.party-flyer')];
const flyerName=document.getElementById('flyerCurrentName');
const flyerPlace=document.getElementById('flyerCurrentPlace');
const flyerPrev=document.getElementById('flyerPrev');
const flyerNext=document.getElementById('flyerNext');
const flyerBar=document.getElementById('flyerProgressBar');
let flyerIndex=0, flyerTimer=null, flyerStartX=0;
const flyerPositions=[
  {x:0,y:0,r:0,s:1,o:1,z:10,f:'brightness(1)'},
  {x:230,y:-24,r:8,s:.83,o:.78,z:7,f:'brightness(.72)'},
  {x:-230,y:-8,r:-8,s:.83,o:.72,z:6,f:'brightness(.62)'},
  {x:395,y:30,r:14,s:.66,o:.35,z:4,f:'brightness(.45)'},
  {x:-395,y:25,r:-14,s:.66,o:.32,z:3,f:'brightness(.42)'},
  {x:0,y:0,r:0,s:.72,o:0,z:1,f:'brightness(.3)'}
];
function renderFlyers(){
  flyerCards.forEach((card,i)=>{
    const pos=(i-flyerIndex+flyerCards.length)%flyerCards.length;
    const p=flyerPositions[Math.min(pos,flyerPositions.length-1)];
    card.style.setProperty('--flyer-x',p.x+'px');
    card.style.setProperty('--flyer-y',p.y+'px');
    card.style.setProperty('--flyer-r',p.r+'deg');
    card.style.setProperty('--flyer-s',p.s);
    card.style.setProperty('--flyer-o',p.o);
    card.style.zIndex=p.z;
    card.style.filter=p.f;
    card.classList.toggle('flyer-active',pos===0);
  });
  const active=flyerCards[flyerIndex];
  if(active){
    flyerName.textContent=active.dataset.title||'';
    flyerPlace.textContent=active.dataset.place||'';
  }
  if(flyerBar){
    flyerBar.style.transition='none'; flyerBar.style.width='0%';
    requestAnimationFrame(()=>{flyerBar.style.transition='width 2.8s linear';flyerBar.style.width='100%'});
  }
}
function moveFlyer(dir=1){flyerIndex=(flyerIndex+dir+flyerCards.length)%flyerCards.length;renderFlyers();}
function startFlyerTimer(){clearInterval(flyerTimer);flyerTimer=setInterval(()=>moveFlyer(1),3000)}
renderFlyers();startFlyerTimer();
flyerNext?.addEventListener('click',()=>{moveFlyer(1);startFlyerTimer()});
flyerPrev?.addEventListener('click',()=>{moveFlyer(-1);startFlyerTimer()});
flyerStage?.addEventListener('mouseenter',()=>clearInterval(flyerTimer));
flyerStage?.addEventListener('mouseleave',startFlyerTimer);
flyerStage?.addEventListener('pointerdown',e=>{flyerStartX=e.clientX;flyerStage.setPointerCapture?.(e.pointerId)});
flyerStage?.addEventListener('pointerup',e=>{const dx=e.clientX-flyerStartX;if(Math.abs(dx)>45){moveFlyer(dx<0?1:-1);startFlyerTimer()}});


// PRIVITYS 24H feed: demo interactions and an automatic live-post rotation.
const feedPosts=[...document.querySelectorAll('.feed-post')];
const feedDots=[...document.querySelectorAll('.feed-dots span')];
let feedIndex=0, feedTimer=null;
function showFeedPost(index){
  if(!feedPosts.length)return;
  feedPosts.forEach((post,i)=>{
    post.style.display=i===index?'block':'none';
    post.classList.toggle('feed-in',i===index);
  });
  feedDots.forEach((dot,i)=>dot.classList.toggle('active',i===index));
  feedIndex=index;
}
function startFeedRotation(){
  clearInterval(feedTimer);
  feedTimer=setInterval(()=>showFeedPost((feedIndex+1)%feedPosts.length),5200);
}
showFeedPost(0); startFeedRotation();

document.querySelectorAll('.like-action').forEach(button=>{
  button.addEventListener('click',()=>{
    button.classList.toggle('liked');
    button.textContent=button.classList.contains('liked')?'♥':'♡';
  });
});
document.querySelectorAll('.comments-link').forEach(button=>{
  button.addEventListener('click',()=>{
    button.textContent=button.textContent.includes('comentarios')?'Comentarios abiertos · únete a la conversación':'Ver comentarios';
  });
});
const feedWrap=document.querySelector('.feed-wrap');
feedWrap?.addEventListener('mouseenter',()=>clearInterval(feedTimer));
feedWrap?.addEventListener('mouseleave',startFeedRotation);
