document.getElementById('year').textContent=new Date().getFullYear();

document.querySelectorAll('a[href="#"]').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));

const stage=document.querySelector('.swipe-stage');
const card=document.querySelector('.card-a');
const like=document.querySelector('.like');
const nope=document.querySelector('.nope');
let locked=false;
function swipe(direction){
  if(locked) return;
  locked=true;
  card.classList.remove('manual-like','manual-nope');
  void card.offsetWidth;
  card.classList.add(direction==='like'?'manual-like':'manual-nope');
  setTimeout(()=>{card.classList.remove('manual-like','manual-nope');locked=false;},900);
}
like?.addEventListener('click',()=>swipe('like'));
nope?.addEventListener('click',()=>swipe('nope'));

let startX=0;
stage?.addEventListener('pointerdown',e=>{startX=e.clientX;stage.setPointerCapture?.(e.pointerId)});
stage?.addEventListener('pointerup',e=>{const dx=e.clientX-startX;if(Math.abs(dx)>55) swipe(dx>0?'like':'nope')});
