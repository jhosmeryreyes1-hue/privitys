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
