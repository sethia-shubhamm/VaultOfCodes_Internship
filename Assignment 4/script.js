const VIDEOS = [
  {id:1,title:"City Brand Documentary",cat:"documentary",catLabel:"Documentary",duration:"8:42",client:"Brand India",year:2024,thumb:"https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=640&q=80",featured:true},
  {id:2,title:"Urban Fashion Reel",cat:"short-form",catLabel:"Short-Form",duration:"0:58",client:"FashionX India",year:2024,thumb:"https://images.unsplash.com/photo-1483985988355-763728e1935b?w=640&q=80"},
  {id:3,title:"Tactical Football Masterclass",cat:"football",catLabel:"Football Edit",duration:"4:15",client:"FC Pune",year:2024,thumb:"https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=640&q=80"},
  {id:4,title:"Gaming Highlights Montage",cat:"gaming",catLabel:"Gaming",duration:"3:30",client:"Team Nexus",year:2023,thumb:"https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&q=80",featured:true},
  {id:5,title:"Sunrise Skincare Launch Ad",cat:"ecommerce",catLabel:"eCommerce Ad",duration:"0:30",client:"Glow Co.",year:2024,thumb:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=640&q=80"},
  {id:6,title:"Ocean Color Grade Reel",cat:"color-grading",catLabel:"Color Grading",duration:"1:10",client:"Studio Seven",year:2024,thumb:"https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=640&q=80"},
  {id:7,title:"Samurai Anime AMV",cat:"anime",catLabel:"Anime Edit",duration:"2:45",client:"AniMedia",year:2023,thumb:"https://images.unsplash.com/photo-1578632767115-351597cf2477?w=640&q=80"},
  {id:8,title:"Tech Startup Brand Film",cat:"long-form",catLabel:"Long-Form",duration:"12:00",client:"Launchpad VC",year:2024,thumb:"https://images.unsplash.com/photo-1487014679447-9f8336841d58?w=640&q=80"},
  {id:9,title:"Monsoon Festival Ad",cat:"ads",catLabel:"Ad Campaign",duration:"0:45",client:"Desi Vibes",year:2024,thumb:"https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=640&q=80"},
  {id:10,title:"Athlete Training Series",cat:"long-form",catLabel:"Long-Form",duration:"18:22",client:"ProAthletes",year:2024,thumb:"https://images.unsplash.com/photo-1517649763962-0c623066013b?w=640&q=80"},
  {id:11,title:"Champions League Recap",cat:"football",catLabel:"Football Edit",duration:"5:00",client:"Soccer Hub",year:2024,thumb:"https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=640&q=80"},
  {id:12,title:"Product Launch Cinematic",cat:"ecommerce",catLabel:"eCommerce Ad",duration:"0:60",client:"LuxeWear",year:2023,thumb:"https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=640&q=80"},
  {id:13,title:"Cozy Travel Vlog Coloring",cat:"color-grading",catLabel:"Color Grading",duration:"6:15",client:"WanderTales",year:2024,thumb:"https://images.unsplash.com/photo-1488085061387-422e29b40080?w=640&q=80"},
  {id:14,title:"Mobile Gaming World Finals",cat:"gaming",catLabel:"Gaming",duration:"4:50",client:"GG Esports",year:2024,thumb:"https://images.unsplash.com/photo-1511512578047-dfb367046420?w=640&q=80"},
  {id:15,title:"Street Food Documentary",cat:"documentary",catLabel:"Documentary",duration:"14:30",client:"Food Stories",year:2023,thumb:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=640&q=80"},
  {id:16,title:"Mecha Anime Battle AMV",cat:"anime",catLabel:"Anime Edit",duration:"3:20",client:"AnimeFlix",year:2024,thumb:"https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=640&q=80"},
  {id:17,title:"Diwali Sale Campaign",cat:"ads",catLabel:"Ad Campaign",duration:"0:30",client:"ShopIndia",year:2024,thumb:"https://images.unsplash.com/photo-1604607050903-9aab5e9e1a77?w=640&q=80"},
  {id:18,title:"Midnight City Reel",cat:"short-form",catLabel:"Short-Form",duration:"0:45",client:"Urban Lens",year:2024,thumb:"https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=640&q=80"},
];

/* ── MARQUEE BUILD ────────────────────────────── */
const MARQUEE_ITEMS = ["Short-Form Edits","Long-Form Videos","Gaming Montages","Football Edits","eCommerce Ads","Documentary Style","Color Grading","Anime AMVs","Ad Campaigns","Motion Graphics","Sound Design","Social Media"];
const track = document.getElementById('marqueeTrack');
const buildMarquee = () => {
  const full = [...MARQUEE_ITEMS,...MARQUEE_ITEMS,...MARQUEE_ITEMS,...MARQUEE_ITEMS];
  track.innerHTML = full.map(t=>`<span class="marquee-item"><span class="marquee-dot"></span>${t}</span>`).join('');
};
buildMarquee();

/* ── FILM STRIPS ─────────────────────────────── */
const buildFilmstrip = id => {
  const el = document.getElementById(id);
  if(!el)return;
  for(let i=0;i<30;i++){const h=document.createElement('div');h.className='filmhole';el.appendChild(h)}
};
buildFilmstrip('filmLeft');
buildFilmstrip('filmRight');

/* ── CURSOR ──────────────────────────────────── */
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px'});
const animRing=()=>{rx+=(mx-rx)*.14;ry+=(my-ry)*.14;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animRing)};
animRing();
document.querySelectorAll('a,button,.video-card,.featured-card,.filter-btn').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cur.style.width='20px';cur.style.height='20px';ring.style.width='56px';ring.style.height='56px';ring.style.opacity='.3'});
  el.addEventListener('mouseleave',()=>{cur.style.width='10px';cur.style.height='10px';ring.style.width='36px';ring.style.height='36px';ring.style.opacity='.6'});
});

/* ── NAV SCROLL ──────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>60));

/* ── HAMBURGER ────────────────────────────────── */
const ham = document.getElementById('hamburger');
const menu = document.getElementById('mobileMenu');
ham.addEventListener('click',()=>{ham.classList.toggle('open');menu.classList.toggle('open')});
document.querySelectorAll('.mobile-link').forEach(a=>a.addEventListener('click',()=>{ham.classList.remove('open');menu.classList.remove('open')}));

/* ── FILTER STATE ─────────────────────────────── */
let activeCat = 'all';
let filteredVideos = [...VIDEOS];
let lightboxIdx = 0;

/* ── RENDER CARDS ─────────────────────────────── */
const grid = document.getElementById('portfolioGrid');

const cardHTML = (v, isFeatured) => `
  <div class="${isFeatured?'featured-card':'video-card'}" data-id="${v.id}" role="button" tabindex="0" aria-label="Play ${v.title}">
    <div class="video-thumb">
      <img class="video-thumb-img" src="${v.thumb}" alt="${v.title}" loading="lazy" />
      <div class="thumb-gradient"></div>
      <div class="cat-badge">${v.catLabel}</div>
      <div class="duration-badge">${v.duration}</div>
      <div class="play-btn">
        <div class="play-circle">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 5l9 5-9 5V5z" fill="rgba(247,243,235,.95)"/></svg>
        </div>
      </div>
    </div>
    <div class="video-info">
      <div class="video-title">${v.title}</div>
      <div class="video-meta">${v.client}<span class="video-meta-dot"></span>${v.year}</div>
    </div>
  </div>`;

const renderGrid = () => {
  const featured = filteredVideos.filter(v=>v.featured);
  const rest = filteredVideos.filter(v=>!v.featured);
  let html = '';
  if(featured.length >= 2 && activeCat === 'all'){
    html += `<div class="featured-row">${cardHTML(featured[0],true)}${cardHTML(featured[1],true)}</div>`;
    html += `<div class="portfolio-grid">${rest.map(v=>cardHTML(v,false)).join('')}</div>`;
    grid.style.display = 'block';
    grid.innerHTML = html;
  } else {
    grid.style.display = 'grid';
    grid.innerHTML = filteredVideos.map(v=>cardHTML(v,false)).join('');
  }
  // Attach click/key listeners
  grid.querySelectorAll('[data-id]').forEach(el=>{
    el.addEventListener('click',()=>openLightbox(+el.dataset.id));
    el.addEventListener('keydown',e=>{if(e.key==='Enter')openLightbox(+el.dataset.id)});
  });
  // Stagger reveal
  grid.querySelectorAll('[data-id]').forEach((el,i)=>{
    el.style.opacity='0';el.style.transform='translateY(24px)';
    setTimeout(()=>{el.style.transition='.55s cubic-bezier(.25,.46,.45,.94)';el.style.opacity='1';el.style.transform='translateY(0)'},i*55);
  });
};

/* ── FILTER BTNS ──────────────────────────────── */
document.getElementById('filterBar').addEventListener('click',e=>{
  const btn = e.target.closest('.filter-btn');
  if(!btn)return;
  activeCat = btn.dataset.cat;
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  filteredVideos = activeCat==='all'?[...VIDEOS]:VIDEOS.filter(v=>v.cat===activeCat);
  renderGrid();
});

/* ── LIGHTBOX ─────────────────────────────────── */
const lb = document.getElementById('lightbox');
const lbTitle = document.getElementById('lightboxTitle');
const lbSub = document.getElementById('lightboxSub');
const lbVideo = document.getElementById('lightboxVideo');
const lbCounter = document.getElementById('lbCounter');

const openLightbox = (vid) => {
  const idx = filteredVideos.findIndex(v=>v.id===vid);
  lightboxIdx = idx >= 0 ? idx : 0;
  showLightboxItem(lightboxIdx);
  lb.classList.add('open');
  document.body.style.overflow='hidden';
};

const showLightboxItem = (idx) => {
  const v = filteredVideos[idx];
  if(!v)return;
  lbTitle.textContent = v.title;
  lbSub.textContent = v.catLabel + ' · ' + v.client + ' · ' + v.year;
  lbCounter.textContent = (idx+1) + ' / ' + filteredVideos.length;
  // Replace content with thumbnail + play message
  document.getElementById('videoPlaceholder').style.display='flex';
  document.getElementById('videoMsg').textContent = 'Click to play · ' + v.title;
  lbVideo.style.backgroundImage = `url(${v.thumb})`;
  lbVideo.style.backgroundSize = 'cover';
  lbVideo.style.backgroundPosition = 'center';
};

const closeLightbox = () => {
  lb.classList.remove('open');
  document.body.style.overflow='';
  lbVideo.style.backgroundImage='none';
};

document.getElementById('lightboxClose').addEventListener('click',closeLightbox);
document.getElementById('lightboxOverlay').addEventListener('click',closeLightbox);
document.getElementById('lbPrev').addEventListener('click',()=>{lightboxIdx=(lightboxIdx-1+filteredVideos.length)%filteredVideos.length;showLightboxItem(lightboxIdx)});
document.getElementById('lbNext').addEventListener('click',()=>{lightboxIdx=(lightboxIdx+1)%filteredVideos.length;showLightboxItem(lightboxIdx)});
document.addEventListener('keydown',e=>{
  if(!lb.classList.contains('open'))return;
  if(e.key==='Escape')closeLightbox();
  if(e.key==='ArrowLeft'){lightboxIdx=(lightboxIdx-1+filteredVideos.length)%filteredVideos.length;showLightboxItem(lightboxIdx)}
  if(e.key==='ArrowRight'){lightboxIdx=(lightboxIdx+1)%filteredVideos.length;showLightboxItem(lightboxIdx)}
});

/* ── SCROLL REVEAL ────────────────────────────── */
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}});
},{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

/* ── COUNT UP ─────────────────────────────────── */
const countObserver = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const el=e.target;const target=+el.dataset.target;
      const sup=el.querySelector('sup');
      let start=0;const dur=1800;const step=16;
      const inc=target/(dur/step);
      const tick=()=>{start=Math.min(start+inc,target);el.textContent=Math.round(start).toString()+(sup?'':'')+'' ;if(sup)el.appendChild(sup);if(start<target)setTimeout(tick,step)};
      tick();countObserver.unobserve(el);
    }
  });
},{threshold:.5});
document.querySelectorAll('.counting').forEach(el=>countObserver.observe(el));

/* ── LOADER ───────────────────────────────────── */
window.addEventListener('load',()=>{
  setTimeout(()=>{
    document.getElementById('loader').classList.add('done');
    renderGrid();
  },1100);
});

/* Initial render fallback */
setTimeout(renderGrid, 200);