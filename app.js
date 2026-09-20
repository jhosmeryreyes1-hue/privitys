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


// PRIVITYS language switcher — Spanish/English, persisted locally.
(() => {
  const KEY = 'privitys-language';
  const root = document.documentElement;
  const toggle = document.querySelector('[data-lang-toggle]');
  const isHow = document.body.classList.contains('how-page');
  const translations = {
    es: {
      index: {
        navHow:'Cómo funciona', navFeatures:'Características', navDownload:'Descargar', downloadApp:'Descargar app',
        eyebrow:'PEOPLE · PARTIES · REAL CONNECTIONS', hero:'¿No sabes<br><span>dónde ir?</span>',
        heroText:'Descubre parties cerca de ti, conoce personas que están en el mismo ambiente y no detengas la fiesta por nada.',
        soon:'PRÓXIMAMENTE EN', tagline:'Donde tu noche termina,<br><strong>la nuestra comienza.</strong>', live:'● PARTY LIVE', liveCaption:'La noche está<br><b>comenzando.</b>', nearby:'Personas cerca',
        feature1:'Descubre', feature1p:'Encuentra parties en tu pueblo o ciudad.', feature2:'Conoce', feature2p:'Personas que están en el mismo evento.', feature3:'Conecta', feature3p:'Haz match solo con gente de ese party.', feature4:'Comparte', feature4p:'Fotos, videos y momentos en tiempo real.',
        flyerEyebrow:'LO QUE ESTÁ PASANDO AHORA', flyerTitle:'Una noche.<br><span>Mil planes.</span>', flyerText:'Descubre los parties que están pasando cerca de ti. Encuentra el plan, mira dónde es y elige dónde empieza tu noche.',
        feedEyebrow:'TODO PASA AQUÍ', feedTitle:'Lo que pasó esta noche,<br><span>queda en Privitys.</span>', feedText:'Publica la foto del momento, comenta lo que está pasando y vive la noche junto a quienes están en el mismo party.',
        feedAfter:'Después de 24 horas,<br><strong>no pasó nada.</strong>', tonight:'Esta noche · Santo Domingo',
        cityPeople:'personas aquí', enter:'Entrar', sectionTitle:'LA FIESTA EN TUS MANOS', sectionSub:'Todo el ambiente en un solo lugar.',
        mapEyebrow:'POR TU PUEBLO, SIEMPRE CERCA', mapTitle:'Encuentra parties en cualquier lugar.', mapText:'Privitys usa tu ubicación para mostrarte lo que está pasando cerca de ti. También puedes explorar otras ciudades y descubrir dónde continúa la fiesta.', active:'con actividad ahora', footerTag:'Conoce. Comparte. No detengas la fiesta.', footerText:'Descubre dónde está pasando algo y vívelo con personas que están en la misma sintonía.', privacy:'Privacidad', terms:'Términos', contact:'Contacto', how:'Cómo funciona',
        comments:'Ver comentarios', comments14:'Ver 14 comentarios', comments9:'Ver 9 comentarios', comments21:'Ver 21 comentarios',
        post1:'Esto se salió de control 😮‍💨🔥', post2:'¿Quién sigue aquí? 👀', post3:'La mejor parte apenas comienza ✨',
        private:'Modo privado', splitText:'Usa tu ubicación para descubrir qué está pasando cerca. Entra al espacio de un party, mira quién está allí, comparte lo que sucede y conecta con personas que viven la misma actividad.', splitL1:'📍 Parties cerca de ti', splitL2:'💬 Interacción en tiempo real', splitL3:'♥ Matches dentro del party', finalTitle:'Conoce. Comparte.<br><span>No detengas la fiesta.</span>', finalText:'Descubre dónde está pasando algo y vívelo con personas que están en la misma sintonía.'
      },
      en: {
        navHow:'How it works', navFeatures:'Features', navDownload:'Download', downloadApp:'Download app',
        eyebrow:'PEOPLE · PARTIES · REAL CONNECTIONS', hero:'Don’t know<br><span>where to go?</span>',
        heroText:'Discover parties near you, meet people in the same scene, and keep the night going.',
        soon:'COMING SOON ON', tagline:'Where your night ends,<br><strong>ours begins.</strong>', live:'● PARTY LIVE', liveCaption:'The night is<br><b>just beginning.</b>', nearby:'People nearby',
        feature1:'Discover', feature1p:'Find parties in your town or city.', feature2:'Meet', feature2p:'People who are at the same event.', feature3:'Connect', feature3p:'Match only with people at that party.', feature4:'Share', feature4p:'Photos, videos and moments in real time.',
        flyerEyebrow:'WHAT’S HAPPENING NOW', flyerTitle:'One night.<br><span>A thousand plans.</span>', flyerText:'Discover parties happening near you. Find the plan, see where it is, and choose where your night begins.',
        feedEyebrow:'EVERYTHING HAPPENS HERE', feedTitle:'What happened tonight,<br><span>stays on Privitys.</span>', feedText:'Post the moment, comment on what’s happening, and live the night with people at the same party.',
        feedAfter:'After 24 hours,<br><strong>nothing happened.</strong>', tonight:'Tonight · Santo Domingo',
        cityPeople:'people here', enter:'Enter', sectionTitle:'THE PARTY IN YOUR HANDS', sectionSub:'The whole scene in one place.',
        mapEyebrow:'ALWAYS CLOSE TO YOUR TOWN', mapTitle:'Find parties anywhere.', mapText:'Privitys uses your location to show what’s happening near you. You can also explore other cities and discover where the night continues.', active:'active now', footerTag:'Meet. Share. Keep the night going.', footerText:'Discover where something is happening and live it with people on the same wavelength.', privacy:'Privacy', terms:'Terms', contact:'Contact', how:'How it works',
        comments:'View comments', comments14:'View 14 comments', comments9:'View 9 comments', comments21:'View 21 comments',
        post1:'This got out of control 😮‍💨🔥', post2:'Who’s still here? 👀', post3:'The best part is just beginning ✨',
        private:'Private mode', splitText:'Use your location to discover what’s happening nearby. Enter a party space, see who’s there, share what’s happening, and connect with people living the same night.', splitL1:'📍 Parties near you', splitL2:'💬 Real-time interaction', splitL3:'♥ Matches inside the party', finalTitle:'Meet. Share.<br><span>Keep the night going.</span>', finalText:'Discover where something is happening and experience it with people on the same wavelength.'
      }
    },
    how: {
      es:{navFeatures:'Características',navParties:'Parties',navDownload:'Descargar',back:'Volver',eyebrow:'ASÍ FUNCIONA PRIVITYS',hero:'Tu noche.<br><span>Tu gente.</span><br>Tu espacio.',lead:'Descubre lo que está pasando cerca de ti, entra al party, conecta con las personas que están ahí y vive todo desde un mismo lugar. Tú decides cuánto compartes y con quién.',discover:'Descubrir parties',privacyTitle:'Privacidad bajo tu control',privacyText:'Si no quieres que sepan que estás en un party, configura tu privacidad. Tú decides cómo aparecer y qué compartir.',private:'Modo privado', splitText:'Usa tu ubicación para descubrir qué está pasando cerca. Entra al espacio de un party, mira quién está allí, comparte lo que sucede y conecta con personas que viven la misma actividad.', splitL1:'📍 Parties cerca de ti', splitL2:'💬 Interacción en tiempo real', splitL3:'♥ Matches dentro del party', finalTitle:'Conoce. Comparte.<br><span>No detengas la fiesta.</span>', finalText:'Descubre dónde está pasando algo y vívelo con personas que están en la misma sintonía.',stepsEyebrow:'UNA APP. TODA LA NOCHE.',stepsTitle:'Todo lo que necesitas<br><span>dentro del party.</span>',stepsText:'PRIVITYS reúne descubrimiento, personas, publicaciones y privacidad en una sola experiencia.',s1num:'01 · DESCUBRE',s1h:'Encuentra los parties cerca de ti.',s1p:'Descubre los parties que están pasando cerca de ti y explora otras ciudades cuando quieras. Mira el ambiente, el lugar y quién está ahí.',s2num:'02 · CONECTA',s2h:'Conecta con personas.',s2p:'Conoce gente que está viviendo la misma noche. <strong>Haz match, conversa y crea conexiones</strong> dentro del party.',s3num:'03 · VIVE EL PARTY',s3h:'Haz más sin salir del party.',s3p:'Encuentra personas, descubre lo que está pasando, comparte momentos y consigue lo que necesites dentro de la experiencia del party.',s4num:'04 · COMPARTE',s4h:'Publica todo por 24 horas.',s4p:'Sube fotos, videos, comentarios y momentos de esa noche. El contenido vive durante <strong>24 horas</strong> y forma parte de la historia de ese party.',control:'TÚ TIENES EL CONTROL',controlTitle:'¿No quieres que sepan que estás ahí?<br><span>Configura tu privacidad.</span>',controlText:'PRIVITYS está pensado para que puedas disfrutar sin tener que exponerte. Ajusta tus opciones de privacidad para decidir qué información compartes, cómo apareces dentro del party y quién puede encontrarte.',p1:'Modo privado',p1t:'Controla tu visibilidad dentro de la experiencia.',p2:'Comparte cuando quieras',p2t:'Tú decides qué publicar y cuándo hacerlo.',p3:'La noche es temporal',p3t:'Las publicaciones del party están pensadas para durar 24 horas.',mantra:'Una noche.<br><span>Una vida.</span><br>Disfruta sin límite.',mantraText:'Totalmente privado. Lo que pasa en PRIVITYS, se queda en PRIVITYS.',home:'Inicio',privacy:'Privacidad',terms:'Términos'},
      en:{navFeatures:'Features',navParties:'Parties',navDownload:'Download',back:'Back',eyebrow:'HOW PRIVITYS WORKS',hero:'Your night.<br><span>Your people.</span><br>Your space.',lead:'Discover what’s happening near you, enter the party, connect with the people there, and experience it all in one place. You decide how much you share and with whom.',discover:'Discover parties',privacyTitle:'Privacy under your control',privacyText:'If you don’t want people to know you’re there, adjust your privacy settings. You decide how you appear and what you share.',private:'Private mode', splitText:'Use your location to discover what’s happening nearby. Enter a party space, see who’s there, share what’s happening, and connect with people living the same night.', splitL1:'📍 Parties near you', splitL2:'💬 Real-time interaction', splitL3:'♥ Matches inside the party', finalTitle:'Meet. Share.<br><span>Keep the night going.</span>', finalText:'Discover where something is happening and experience it with people on the same wavelength.',stepsEyebrow:'ONE APP. ALL NIGHT.',stepsTitle:'Everything you need<br><span>inside the party.</span>',stepsText:'PRIVITYS brings discovery, people, posts, and privacy together in one experience.',s1num:'01 · DISCOVER',s1h:'Find parties near you.',s1p:'Discover parties happening near you and explore other cities whenever you want. See the vibe, the place, and who’s there.',s2num:'02 · CONNECT',s2h:'Connect with people.',s2p:'Meet people living the same night. <strong>Match, chat, and make connections</strong> inside the party.',s3num:'03 · LIVE THE PARTY',s3h:'Do more without leaving the party.',s3p:'Find people, see what’s happening, share moments, and get what you need inside the party experience.',s4num:'04 · SHARE',s4h:'Post everything for 24 hours.',s4p:'Upload photos, videos, comments, and moments from the night. Content lives for <strong>24 hours</strong> and becomes part of that party’s story.',control:'YOU’RE IN CONTROL',controlTitle:'Don’t want people to know you’re there?<br><span>Set your privacy.</span>',controlText:'PRIVITYS is designed so you can enjoy the night without exposing yourself. Adjust your privacy settings to decide what you share, how you appear inside the party, and who can find you.',p1:'Private mode',p1t:'Control your visibility inside the experience.',p2:'Share when you want',p2t:'You decide what to post and when.',p3:'The night is temporary',p3t:'Party posts are designed to last for 24 hours.',mantra:'One night.<br><span>One life.</span><br>Enjoy without limits.',mantraText:'Completely private. What happens on PRIVITYS, stays on PRIVITYS.',home:'Home',privacy:'Privacy',terms:'Terms'}
    }
  };
  const T = () => translations[isHow ? 'how' : 'es'][currentLang] || translations[isHow ? 'how' : 'es'].es;
  let currentLang = localStorage.getItem(KEY) || 'es';
  function set(sel, key, html=false){ const el=document.querySelector(sel); if(el && T()[key]!==undefined) html?el.innerHTML=T()[key]:el.textContent=T()[key]; }
  function setAll(sel,key,html=false){document.querySelectorAll(sel).forEach(el=>{if(T()[key]!==undefined)html?el.innerHTML=T()[key]:el.textContent=T()[key]})}
  function apply(lang){
    currentLang=lang; localStorage.setItem(KEY,lang); root.lang=lang;
    if(!isHow){
      set('nav a[href="./como-funciona.html"]','navHow'); set('nav a[href="#features"]','navFeatures'); set('nav a[href="#descargar"]','navDownload');
      set('.cta.small','downloadApp'); set('.hero .eyebrow','eyebrow'); set('.hero h1','hero',true); set('.hero .copy>p:not(.eyebrow)','heroText'); setAll('.store small','soon'); set('.tagline','tagline',true); set('.live','live'); set('.caption','liveCaption',true); set('.f2 b','nearby');
      const f=[['.features article:nth-child(1) h3','feature1'],['.features article:nth-child(1) p','feature1p'],['.features article:nth-child(2) h3','feature2'],['.features article:nth-child(2) p','feature2p'],['.features article:nth-child(3) h3','feature3'],['.features article:nth-child(3) p','feature3p'],['.features article:nth-child(4) h3','feature4'],['.features article:nth-child(4) p','feature4p']]; f.forEach(x=>set(x[0],x[1]));
      set('.flyer-copy .eyebrow','flyerEyebrow'); set('.flyer-copy h2','flyerTitle',true); set('.flyer-copy>p:not(.eyebrow)','flyerText'); set('.feed-intro .eyebrow','feedEyebrow'); set('.feed-intro h2','feedTitle',true); set('.feed-intro>p:not(.eyebrow)','feedText'); set('.feed-rule p','feedAfter',true); set('.feed-topbar>span','tonight'); set('.split>div:last-child>p:last-of-type','splitText'); set('.split li:nth-child(1)','splitL1'); set('.split li:nth-child(2)','splitL2'); set('.split li:nth-child(3)','splitL3'); set('.final h2','finalTitle',true); set('.final>p:last-of-type','finalText'); setAll('footer>span','footerTag');
      set('.party-card p','cityPeople'); set('.party-card button','enter'); set('.split .eyebrow','sectionTitle'); set('.split h2','sectionSub',true); set('.location .eyebrow','mapEyebrow'); set('.location h2','mapTitle',true); set('.location>div:first-child>p:last-child','mapText'); set('.map-stat small','active'); setAll('footer nav a:nth-child(1)','privacy'); setAll('footer nav a:nth-child(2)','terms'); setAll('footer nav a:nth-child(3)','contact');
      document.querySelectorAll('.comments-link').forEach((el,i)=>el.textContent=T()[i===0?'comments14':i===1?'comments9':'comments21']);
      document.querySelectorAll('.post-body p').forEach((el,i)=>{const strong=el.querySelector('strong'); if(strong){const txt=T()[`post${i+1}`]; el.innerHTML=`<strong>${strong.textContent}</strong> ${txt}`}});
    } else {
      set('nav a[href="./index.html#features"]','navFeatures'); set('nav a[href="./index.html#parties"]','navParties'); set('nav a[href="./index.html#descargar"]','navDownload'); set('.cta.small','back');
      set('.how-hero .eyebrow','eyebrow'); set('.how-hero h1','hero',true); set('.how-hero .lead','lead'); set('.how-hero .cta','discover'); set('.privacy-card h3','privacyTitle'); set('.privacy-card p','privacyText'); set('.toggle span:first-child','private');
      set('.how-steps-head .eyebrow','stepsEyebrow'); set('.how-steps-head h2','stepsTitle',true); set('.how-steps-head>p','stepsText');
      [['.how-step:nth-child(1) .step-num','s1num'],['.how-step:nth-child(1) h3','s1h'],['.how-step:nth-child(1) p','s1p'],['.how-step:nth-child(2) .step-num','s2num'],['.how-step:nth-child(2) h3','s2h'],['.how-step:nth-child(2) p','s2p'],['.how-step:nth-child(3) .step-num','s3num'],['.how-step:nth-child(3) h3','s3h'],['.how-step:nth-child(3) p','s3p'],['.how-step:nth-child(4) .step-num','s4num'],['.how-step:nth-child(4) h3','s4h'],['.how-step:nth-child(4) p','s4p']].forEach(x=>set(x[0],x[1],true));
      set('.how-privacy .eyebrow','control'); set('.how-privacy h2','controlTitle',true); set('.how-privacy .privacy-panel>p','controlText');
      [['.privacy-point:nth-child(1) b','p1'],['.privacy-point:nth-child(1)','p1t'],['.privacy-point:nth-child(2) b','p2'],['.privacy-point:nth-child(2)','p2t'],['.privacy-point:nth-child(3) b','p3'],['.privacy-point:nth-child(3)','p3t']].forEach(([sel,key],i)=>{const el=document.querySelector(sel); if(el){if(sel.includes('privacy-point)')){} else if(sel.endsWith('b')) el.textContent=T()[key]}});
      const pts=[...document.querySelectorAll('.privacy-point')]; pts.forEach((el,i)=>{const b=el.querySelector('b'); const key='p'+(i+1), tk=key+'t'; if(b)b.textContent=T()[key]; el.childNodes.forEach(n=>{if(n.nodeType===3 && n.textContent.trim()) n.textContent=T()[tk]})});
      set('.how-mantra h2','mantra',true); set('.how-mantra>p:last-child','mantraText'); setAll('footer nav a:nth-child(1)','home'); setAll('footer nav a:nth-child(2)','privacy'); setAll('footer nav a:nth-child(3)','terms');
    }
    if(toggle){toggle.textContent=lang==='es'?'EN':'ES'; toggle.setAttribute('aria-label',lang==='es'?'Switch to English':'Cambiar a español')}
  }
  toggle?.addEventListener('click', (e) => {
    e.preventDefault();
    apply(currentLang === 'es' ? 'en' : 'es');
  });
  apply(currentLang === 'en' ? 'en' : 'es');
})();
