const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const body=document.body, drawer=$('#drawer'), menuBtn=$('#menuBtn');
menuBtn?.addEventListener('click',()=>{const open=!drawer.classList.contains('open');drawer.classList.toggle('open',open);drawer.setAttribute('aria-hidden',String(!open));menuBtn.setAttribute('aria-expanded',String(open));menuBtn.setAttribute('aria-label',open?'Close menu':'Open menu')});
$$('.drawer a').forEach(a=>a.addEventListener('click',()=>{drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');menuBtn.setAttribute('aria-expanded','false')}));

const catalog={
 tee:{title:'SICK HEAVYWEIGHT TEE',price:399000,desc:'330 GSM COTTON / RELAXED CUT / BLACK. CLEAN FRONT, GRAPHIC BACK AND A DENSE HAND-FEEL.',images:['tee-front.webp','tee-back.webp','tee-logo-detail.webp','tee-fabric-detail.webp'],sizes:['S','M','L','XL']},
 hoodie:{title:'SICK CORE HOODIE',price:599000,desc:'HEAVY FLEECE / OVERSIZED FIT / BLACK. A CLEAN FRONT, LOUD BACK AND DEEP HOOD.',images:['hoodie-front.webp','hoodie-back.webp','hoodie-hood-detail.webp','hoodie-print-detail.webp'],sizes:['S','M','L','XL']},
 goods:{title:'SICK IDENTITY TAGS',price:89000,desc:'CK MONOGRAM / PAPER GOODS. A SMALL PIECE OF THE IDENTITY SYSTEM.',images:['hangtag-detail.webp','woven-ck.webp','neck-label.webp','logo-ck-white.png'],sizes:['ONE SIZE']},
 packaging:{title:'SICK PACKAGING PACK',price:129000,desc:'LIMITED PACK / UNBOXING GOODS. THE SICK EXPERIENCE FROM FIRST TOUCH TO FIRST WEAR.',images:['packaging-flatlay.webp','packaging-unboxing.webp','packaging-close.webp','hangtag-detail.webp'],sizes:['ONE SIZE']}
};
const money=n=>'IDR '+n.toLocaleString('id-ID');
let bag=[],selectedSize=null;

$$('.filters button').forEach(btn=>btn.addEventListener('click',()=>{$$('.filters button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;$$('.product').forEach(p=>{p.hidden=!(f==='all'||p.dataset.cat===f)})}));

function showToast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),1800)}
function openCart(){$('#cartDrawer').classList.add('open');$('#cartBackdrop').classList.add('open');$('#cartDrawer').setAttribute('aria-hidden','false');body.classList.add('lock')}
function closeCart(){$('#cartDrawer').classList.remove('open');$('#cartBackdrop').classList.remove('open');$('#cartDrawer').setAttribute('aria-hidden','true');body.classList.remove('lock')}
$('#bagBtn').onclick=openCart;$('#closeCart').onclick=closeCart;$('#cartBackdrop').onclick=closeCart;
function renderCart(){const count=bag.reduce((s,x)=>s+x.qty,0),total=bag.reduce((s,x)=>s+x.price*x.qty,0);$('#bagCount').textContent=count;$('#cartQty').textContent=count;$('#cartTotal').textContent=money(total);if(!bag.length){$('#cartItems').innerHTML='<p class="empty-cart">YOUR BAG IS EMPTY.<br><br>START WITH DROP 01.</p>';return}$('#cartItems').innerHTML=bag.map((x,i)=>`<div class="cart-row"><img src="assets/${x.image}" alt="${x.name}"><div><h3>${x.name}</h3><p>${x.size||'ONE SIZE'}</p><div class="qty"><button data-minus="${i}" aria-label="Decrease quantity">−</button><span>${x.qty}</span><button data-plus="${i}" aria-label="Increase quantity">+</button><button class="remove" data-remove="${i}">REMOVE</button></div></div><strong>${money(x.price*x.qty)}</strong></div>`).join('');$$('#cartItems [data-minus]').forEach(b=>b.onclick=()=>changeQty(+b.dataset.minus,-1));$$('#cartItems [data-plus]').forEach(b=>b.onclick=()=>changeQty(+b.dataset.plus,1));$$('#cartItems [data-remove]').forEach(b=>b.onclick=()=>{bag.splice(+b.dataset.remove,1);renderCart()})}
function changeQty(i,d){bag[i].qty+=d;if(bag[i].qty<=0)bag.splice(i,1);renderCart()}
function addBag(key,size){const p=catalog[key];if(!p)return;if(p.sizes.length>1&&!size){openProduct(key);showToast('SELECT A SIZE FIRST');return}const chosen=size||p.sizes[0];const existing=bag.find(x=>x.key===key&&x.size===chosen);if(existing)existing.qty++;else bag.push({key,name:p.title,price:p.price,desc:p.desc,image:p.images[0],size:chosen,qty:1});renderCart();openCart();showToast(`${p.title} — ADDED TO BAG`)}
$$('.add').forEach(b=>b.addEventListener('click',()=>addBag(b.dataset.key)));

function openProduct(key){const p=catalog[key];selectedSize=p.sizes[0];$('#modalTitle').textContent=p.title;$('#modalPrice').textContent=money(p.price);$('#modalDesc').textContent=p.desc;$('#modalGallery').innerHTML=p.images.map((x,i)=>`<img src="assets/${x}" ${i?'loading="lazy"':''} alt="${p.title} detail ${i+1}">`).join('');$('#modalSizes').innerHTML=p.sizes.map((s,i)=>`<button type="button" class="${i===0?'active':''}" data-size="${s}">${s}</button>`).join('');$$('#modalSizes button').forEach(b=>b.onclick=()=>{selectedSize=b.dataset.size;$$('#modalSizes button').forEach(x=>x.classList.toggle('active',x===b))});$('#modalAdd').onclick=()=>{addBag(key,selectedSize);closeModal()};$('#modal').setAttribute('aria-hidden','false');body.classList.add('lock')}
function closeModal(){$('#modal').setAttribute('aria-hidden','true');body.classList.remove('lock')}
$$('[data-open]').forEach(el=>el.addEventListener('click',()=>openProduct(el.dataset.open)));$('#closeModal').onclick=closeModal;$('#modal').addEventListener('click',e=>{if(e.target===e.currentTarget)closeModal()});

$$('.visual img[data-hover]').forEach(img=>{const original=img.src,hover=img.dataset.hover;const preload=new Image();preload.src=hover;img.closest('.visual').addEventListener('mouseenter',()=>{img.src=hover;img.classList.add('hovered')});img.closest('.visual').addEventListener('mouseleave',()=>{img.src=original;img.classList.remove('hovered')})});

$('#checkoutBtn').onclick=()=>showToast('CHECKOUT READY — CONNECT PAYMENT TO GO LIVE');
$('#newsletterForm')?.addEventListener('submit',e=>{e.preventDefault();const input=e.currentTarget.querySelector('input');if(!input.checkValidity()){input.classList.add('invalid');input.setAttribute('aria-invalid','true');input.focus();return}input.classList.remove('invalid');input.removeAttribute('aria-invalid');e.currentTarget.style.display='none';$('#success').style.display='block'});
$('#newsletterForm input')?.addEventListener('input',e=>{if(e.target.checkValidity()){e.target.classList.remove('invalid');e.target.removeAttribute('aria-invalid')}});

document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeCart();closeModal();closeArticle()}});
const revealObserver=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');revealObserver.unobserve(x.target)}}),{threshold:.08});$$('.product,.journal-grid article,.campaign-grid img,.detail-grid img,.trust-strip>div').forEach(x=>{x.classList.add('reveal');revealObserver.observe(x)});
const mobileShop=$('#mobileShop');const hero=$('.hero');const shopObserver=new IntersectionObserver(([entry])=>{mobileShop.classList.toggle('visible',!entry.isIntersecting)},{threshold:.05});shopObserver.observe(hero);

const tickerTrack=document.querySelector('.ticker-track');
if(tickerTrack){ const restartTicker=()=>{tickerTrack.style.animation='none'; void tickerTrack.offsetWidth; tickerTrack.style.animation='sickTicker 14s linear infinite';}; document.addEventListener('visibilitychange',()=>{if(!document.hidden) restartTicker();}); window.addEventListener('pageshow',restartTicker); }


const articles={
 officer:{
  kicker:'10 / JOURNAL / OUTERWEAR 001',
  title:'THE OFFICER.',
  deck:'A QUIETER TAKE ON MILITARY STRUCTURE.',
  image:'napoleon-the-officer.webp',
  body:'THE OFFICER REBUILDS THE NAPOLEON SILHOUETTE AROUND RESTRAINT. A HIGH STAND COLLAR, DISCIPLINED FRONT CLOSURE AND CLEAN BLACK SURFACE KEEP THE JACKET SHARP WITHOUT LOSING ITS STREETWEAR ATTITUDE. THE RESULT IS A PIECE THAT FEELS STRUCTURED, MODERN AND EASY TO WEAR.',
  specs:['MATERIAL / HEAVYWEIGHT DENIM COTTON','FIT / REGULAR STRUCTURED FIT','COLOR / BLACK','DETAIL / CUSTOM METAL HARDWARE']
 },
 commander:{
  kicker:'10 / JOURNAL / OUTERWEAR 002',
  title:'THE COMMANDER.',
  deck:'MILITARY HERITAGE, TURNED UP.',
  image:'napoleon-the-commander.webp',
  body:'THE COMMANDER PUSHES THE CLASSIC NAPOLEON JACKET INTO A MORE ASSERTIVE SICK LANGUAGE. LAYERED FRONT DETAILS, REPEATED METAL HARDWARE, STRONG SHOULDER LINES AND A BLACK DENIM BODY GIVE THE PIECE ITS OWN VISUAL RHYTHM — BUILT FOR THE STREET, NOT THE PARADE GROUND.',
  specs:['MATERIAL / BLACK DENIM','FIT / RELAXED STRUCTURED FIT','COLOR / BLACK','DETAIL / MULTI-ROW HARDWARE']
 }
};
function openArticle(key){
 const a=articles[key]; if(!a)return;
 $('#articleModalKicker').textContent=a.kicker;
 $('#articleModalTitle').textContent=a.title;
 $('#articleModalDeck').textContent=a.deck;
 $('#articleModalBody').textContent=a.body;
 $('#articleModalImage').src='assets/'+a.image;
 $('#articleModalImage').alt='SICK '+a.title+' editorial article';
 $('#articleModalSpecs').innerHTML=a.specs.map(x=>`<span>${x}</span>`).join('');
 $('#articleModal').setAttribute('aria-hidden','false');body.classList.add('lock');
}
function closeArticle(){ $('#articleModal').setAttribute('aria-hidden','true');body.classList.remove('lock'); }
$$('[data-article]').forEach(b=>b.addEventListener('click',()=>openArticle(b.dataset.article)));
$('#closeArticle')?.addEventListener('click',closeArticle);
$('#articleModal')?.addEventListener('click',e=>{if(e.target===e.currentTarget)closeArticle()});
