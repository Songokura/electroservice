/* ============================================================
   ЭЛЕКТРОСЕРВИС - скрипт страницы.
   Плиты и включение кадра рядами (6 линий, мерцание как у люминесцентной
   лампы) · рейка автоматов в герое взводится на интро · видео по видимости
   и модальный плеер · перевод RU/KZ (?lang= сильнее localStorage) · меню ·
   бегущая лента · ленты с кнопками · WhatsApp с названием услуги ·
   форма в WhatsApp. Библиотек нет.
   ============================================================ */
(function(){
"use strict";
var WA = "77769991286";                  /* основной WhatsApp Электросервис */
var RED = matchMedia("(prefers-reduced-motion: reduce)").matches;
var HAS_IO = typeof IntersectionObserver === "function";
var root = document.documentElement;

/* ---------------- КОНВЕРСИИ GOOGLE ADS ----------------
   Ярлыки задаёт index.html (window.ES_CONV). Клики по телефону и WhatsApp
   ловим делегированием, переход не блокируем. Пустой ярлык - событие не шлём. */
function conv(key){
  var id = (window.ES_CONV || {})[key];
  if (!id || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", {send_to: id, value: 1.0, currency: "USD"});
}
document.addEventListener("click", function(e){
  var a = e.target.closest ? e.target.closest("a[href]") : null;
  if (!a) return;
  var h = a.getAttribute("href") || "";
  if (h.indexOf("tel:") === 0) conv("phone");
  else if (h.indexOf("wa.me") > -1) conv("contact");
}, true);

/* ---------------- КАЗАХСКИЙ СЛОВАРЬ ----------------
   Разметка русская. Ключа нет - строка остаётся русской. */
var KZ = {
"m.title":"Астанада пәтер мен үйдің электр монтажы кілт тапсыру - Электросервис",
"m.desc":"Астанада кілт тапсыру электр монтажы: жаңа құрылыстағы пәтерлер, жеке үйлер, кеңселер. Сым тарту, электр қалқаны, розеткалар, жарықтандыру, HiTE PRO ақылды үй. 16 жыл тәжірибе, 5 жыл кепілдік, шарт, шебердің келуі мен смета тегін, Kaspi 0-0-12 бөліп төлеу.",
"m.ogt":"Астанада пәтер мен үйдің электр монтажы кілт тапсыру - Электросервис",
"m.ogd":"Сым тарту, электр қалқаны, розеткалар, жарықтандыру, HiTE PRO ақылды үй. 16 жыл тәжірибе, 5 жыл кепілдік, шебердің келуі мен смета тегін, Kaspi 0-0-12 бөліп төлеу.",
"a.home":"Электросервис, басты бетке","a.nav":"Сайт бөлімдері","a.lang":"Сайт тілі","a.call":"Қоңырау шалу +7 776 999 12 86","a.menu":"Мәзір","a.prev":"Артқа","a.next":"Алға","a.lane":"Нысандардағы бейнелер","a.rlane":"Клиенттердің пікірлері","a.player":"Бейне ойнатқыш","a.close":"Жабу","a.rail":"Қызметтерге жылдам өту",
"nav.kv":"Пәтерлер","nav.dm":"Үйлер","nav.sh":"Электр қалқаны","nav.ud":"Ақылды үй","nav.us":"Қызметтер","nav.ot":"Пікірлер","nav.kn":"Байланыс",
"b.calc":"Құнын есептеу","b.svc":"Қызметтерді көру",

"h.kick":"Астана · кілт тапсыру электр монтажы · 16 жыл тәжірибе",
"h.h1a":"Электр монтажы","h.h1b":"пәтер мен үйге кілт тапсыру",
"h.lead":"Сым тарту, қалқан, розеткалар, жарық және HiTE PRO ақылды үй. Шебердің келуі мен смета - <b>тегін</b>, шарт, <b>5 жыл</b> кепілдік, Kaspi 0-0-12 бөліп төлеу.",
"h.cap":"Коттедж · Астана · төбемен сым тарту",
"r.kv":"Пәтерлер","r.dm":"Үйлер","r.sh":"Қалқан","r.sv":"Жарық","r.ud":"Ақылды үй","r.za":"Өтінім",

"p1.k":"Пәтерлер","p1.h":"Жаңа құрылыстағы <em>пәтердің</em> электр монтажы","p1.p":"Жиһаз жоспары бойынша сым тарту, қалқан, розеткалар, жарық. Қара және таза кезең - бір бригада.",
"p1.c1":"шарт","p1.c2":"<b>5 жыл</b> кепілдік","p1.c3":"смета тегін","p1.a1":"Астанадағы жаңа құрылыс ауласы, Электросервис пәтерлерге электр монтажын жасайды","p1.a2":"Жаңа құрылыстағы пәтер қабырғасындағы кабельді гофра шоғыры","p1.cap":"Жаңа құрылыс · Астана",
"p2.k":"Жеке үйлер","p2.h":"Үйлер мен коттедждер <em>жобадан</em> тапсыруға дейін","p2.p":"Кіріс, қалқан, барлық қабат бойынша сым тарту, іші мен сыртындағы жарық. Кабельді жүктемеге қарай таңдаймыз, көзбен емес.",
"p2.c1":"жоба","p2.c2":"коттедждер мен таунхаустар","p2.c3":"Kaspi <b>0-0-12</b>","p2.a1":"Астанадағы коттедждің қасбеті, Электросервис нысаны","p2.a2":"Коттедж төбесінде гофрамен кабель тарту","p2.cap":"Коттедж · Астана",
"p3.k":"Электр қалқаны","p3.h":"<em>Электр қалқанын</em> құрастыру және орнату","p3.p":"Автоматтар, УЗО, кернеу релесі - жүктеме есебі бойынша. Әр желі таңбаланған, қалқанды есігі ашық күйінде тапсырамыз.",
"p3.c1":"УЗО және кернеу релесі","p3.c2":"желілерді таңбалау","p3.c3":"<b>5 жыл</b> кепілдік","p3.a1":"Автоматтар мен УЗО орнатылған құрастырылған электр қалқаны, Электросервис жұмысы","p3.cap":"Қалқан · жарықтандыру · Астана",
"p4.k":"HiTE PRO ақылды үй","p4.h":"Жарық, перде және жылы еден - <em>планшеттен</em>","p4.p":"«Кеш», «Түн», «Қонақтар», «Мен үйде жоқпын» сценарийлері. Қозғалыс датчиктері, дәліздің түнгі жарығы, қалқанды басқару.",
"p4.c1":"HiTE PRO","p4.c2":"сценарийлер","p4.c3":"датчиктер мен климат","p4.a1":"Электросервис қоймасындағы HiTE PRO ақылды үй жабдығы","p4.a2":"Ас үйдегі ақылды үйді басқару планшеті","p4.cap":"HiTE PRO · жабдық қолда бар",

"u.k":"Қызметтер","u.h":"Электрика бойынша <em>керектің бәрі</em>","u.l":"Астана мен қала маңында жұмыс істейміз, 9:00-20:00, демалыссыз. Келу мен смета тегін.",
"u1.h":"Сымды ауыстыру","u1.p":"Пәтерде немесе үйде толық ауыстыру: ескісін бөлшектеу, қабырғаны ою, жаңа сым тарту.","u1.a":"Төбемен тартылған қызыл гофрадағы кабель - сымды ауыстыру","u1.cap":"нысан · Астана",
"u2.h":"Жарықтандыру","u2.p":"Нүктелік жарық, тректер, ленталар, қасбет пен учаске жарығы. Өтпелі ажыратқыштармен схемалар.","u2.a":"Кешкі уақытта жеке үй қасбетінің жарықтандырылуы","u2.cap":"іші мен сырты",
"u3.h":"Розеткалар мен ажыратқыштар","u3.p":"Орнату және көшіру, өтпелі ажыратқыштар, ас үй мен санторапқа ылғалдан қорғалған топтар.","u3.a":"Тарату қорабы, шам және өтпелі ажыратқыштар орнатылған стенд","u3.cap":"өтпелі схемалар",
"u4.h":"Кеңселер мен үй-жайлар","u4.p":"Жұмыс орындарының жоспары бойынша электр монтажы: техникаға жеке желілер, норма бойынша жарық.","u4.a":"Сызықтық жарықтандыруы мен жұмыс орындары бар кеңсе","u4.cap":"кеңселер мен үй-жайлар",

"v.k":"Нысандардағы бейне","v.h":"Қалай жұмыс істейтінімізді <em>көріңіз</em>","v.l":"Instagram-нан алты ролик: коттедж, жаңа құрылыс, электр қалқаны, сым тарту. Басыңыз - дыбыспен ашылады.",
"v1.h":"Кілт тапсыру коттедж","v1.p":"Жобадан нысанды тапсыруға дейін","v1.aria":"Көру: кілт тапсыру коттедж",
"v2.h":"Жаңа құрылыстағы пәтер","v2.p":"Сым тарту, қалқан, розеткалар","v2.aria":"Көру: жаңа құрылыстағы пәтер",
"v3.h":"Электр қалқаны","v3.p":"Неге үнемдеуге болмайды","v3.aria":"Көру: электр қалқанын құрастыру",
"v4.h":"Кабель тарту","v4.p":"Төбемен қызыл гофра","v4.aria":"Көру: кабель тарту",
"v5.h":"Коттедждегі жұмыс","v5.p":"Ұқыпты және норма бойынша","v5.aria":"Көру: электр монтаж жұмысы",
"v6.h":"Өтпелі ажыратқыштар","v6.p":"Бұл қалай жұмыс істейді","v6.aria":"Көру: өтпелі ажыратқыштар",

"k.k":"Қалай жұмыс істейміз","k.h":"Дайын электрикаға дейінгі <em>төрт қадам</em>","k.l":"Біз жай сым тартпаймыз - 20-30 жылға қауіпсіз электр жүйесін жасаймыз.",
"s1.h":"Өтінім","s1.p":"WhatsApp-қа жазасыз немесе қоңырау шаласыз: 9:00-20:00, демалыссыз.",
"s2.h":"Келу және смета","s2.p":"Шебер тегін келеді, материал мен жұмысты есептейді.",
"s3.h":"Шарт және монтаж","s3.p":"Бағасы мен мерзімін бекітеміз. Жұмысты бір бригада жүргізеді.",
"s4.h":"Тапсыру және кепілдік","s4.p":"Әр желіні көрсетеміз, қалқанды таңбалаймыз. 5 жыл кепілдік.",
"f1.u":"жыл","f1.p":"энергетикадағы тәжірибе","f2.u":"жыл","f2.p":"шарт бойынша кепілдік","f3.p":"2ГИС бағасы, 9 пікір","f4.p":"Kaspi бөліп төлеу, артық төлемсіз",

"o.k":"Пікірлер","o.h":"<em>2ГИС-те</em> не жазады","o.l":"9 пікір бойынша 5,0 баға. Шеберлер Абзал мен Темірлан - нысанды тапсырғаннан кейін де байланыста.","o.who":"Клиент","o.all":"2ГИС-тегі барлық пікір",

"c.k":"Байланыс","c.h":"Құнын <em>тегін</em> есептейміз","c.l":"WhatsApp-қа жазыңыз немесе өтінім қалдырыңыз - шебер келіп, нысанды қарап, смета жасайды.",
"c.ph":"Телефон · WhatsApp","c.ad":"Мекенжай","c.adv":"Астана, Ахмет Жұбанов көшесі, 24/1<small>Астананың барлық аудандары мен қала маңына шығамыз</small>","c.hr":"Кесте","c.hrv":"9:00-20:00<small>демалыссыз</small>","c.gis":"2ГИС-те ашу",
"z.h":"Есепке өтінім","z.l":"Қандай нысан екенін жазыңыз - жұмыс уақытында WhatsApp-та жауап береміз.",
"z.name":"Аты","z.nameph":"Сізге қалай жүгінуге болады","z.phone":"Телефон","z.what":"Не керек","z.whatph":"60 м² пәтер, жаңа құрылыс, қара әрлеу",
"z.agree":"Өтінім бойынша байланысу үшін дербес деректерімді өңдеуге келісемін.","z.send":"WhatsApp-қа жіберу",
"z.ok":"Рақмет! Дайын хабарламасы бар WhatsApp ашылады.","z.err":"Атыңызды, телефоныңызды көрсетіп, келісімді растаңыз.",
"z.note":"Түймені басқан соң дайын хабарламасы бар WhatsApp ашылады - ол сіздің нөміріңізден кетеді.",
"ft.copy":"© 2026 Электросервис. Астанадағы электр монтажы.","ft.addr":"Астана, Ахмет Жұбанов көшесі, 24/1 · 9:00-20:00, демалыссыз",
"bar.call":"Қоңырау",
"a.ig":"Электросервис Instagram парақшасы: @electroservice.kaz","a.ig2":"Электросервис Instagram парақшасы",
"ig.menu":"Жұмыстар: Instagram","ig.hero":"Апта сайынғы нысандар: Instagram","ig.gal":"Көбірек жұмыс: Instagram","ig.con":"Жұмыстар: Instagram"
};

/* готовые тексты WhatsApp: название услуги - отдельной строкой */
var WA_TXT = {
ru:{
  hero:"Здравствуйте! Пишу с сайта Электросервис. Нужен электромонтаж:\n",
  card:"Здравствуйте! Хочу рассчитать стоимость:\n{t}\nОбъект и адрес: ",
  kontakty:"Здравствуйте! Пишу с сайта Электросервис. Вопрос: "
},
kk:{
  hero:"Сәлеметсіз бе! Электросервис сайтынан жазып отырмын. Электр монтажы керек:\n",
  card:"Сәлеметсіз бе! Құнын есептегім келеді:\n{t}\nНысан мен мекенжай: ",
  kontakty:"Сәлеметсіз бе! Электросервис сайтынан жазып отырмын. Сұрақ: "
}};

var TICK = ["Квартиры в новостройках","Частные дома","Офисы","Замена проводки","Электрощиты","Розетки и выключатели","Освещение","Умный дом HiTE PRO","Гарантия 5 лет"];
var TICK_KZ = ["Жаңа құрылыстағы пәтерлер","Жеке үйлер","Кеңселер","Сымды ауыстыру","Электр қалқандары","Розеткалар мен ажыратқыштар","Жарықтандыру","HiTE PRO ақылды үй","5 жыл кепілдік"];

/* ---------------- ПЕРЕВОД ---------------- */
var RU = {};
function snapshot(){
  document.querySelectorAll("[data-i]").forEach(function(el){ if (RU[el.dataset.i] === undefined) RU[el.dataset.i] = el.innerHTML; });
  document.querySelectorAll("[data-i-alt]").forEach(function(el){ RU[el.dataset.iAlt] = el.alt; });
  document.querySelectorAll("[data-i-aria]").forEach(function(el){ RU[el.dataset.iAria] = el.getAttribute("aria-label"); });
  document.querySelectorAll("[data-i-c]").forEach(function(el){ RU[el.dataset.iC] = el.getAttribute("content"); });
  document.querySelectorAll("[data-i-ph]").forEach(function(el){ RU[el.dataset.iPh] = el.getAttribute("placeholder"); });
  var t = document.querySelector("title[data-i-t]"); if (t) RU[t.dataset.iT] = t.textContent;
}
function pick(k, kk){ return (kk && KZ[k] !== undefined) ? KZ[k] : RU[k]; }
function curLang(){ return root.lang === "kk" ? "kk" : "ru"; }
function T(k){ return pick(k, curLang() === "kk") || ""; }
function plain(html){ var d = document.createElement("div"); d.innerHTML = html; return d.textContent; }

/* текст заявки собирается из заголовка услуги на текущем языке */
function setWaLinks(){
  var L = curLang();
  document.querySelectorAll("[data-wa]").forEach(function(a){
    var key = a.dataset.wa, t = WA_TXT[L][key] || WA_TXT[L].hero;
    if (t.indexOf("{t}") > -1) t = t.replace("{t}", a.dataset.waTitle ? plain(T(a.dataset.waTitle)).trim() : "");
    a.href = "https://wa.me/" + (a.dataset.num || WA) + "?text=" + encodeURIComponent(t);
    a.target = "_blank"; a.rel = "noopener";
  });
}

function applyLang(lang){
  var kk = lang === "kk";
  root.setAttribute("lang", kk ? "kk" : "ru");
  document.querySelectorAll("[data-i]").forEach(function(el){
    var v = pick(el.dataset.i, kk); if (v !== undefined) el.innerHTML = v;
  });
  document.querySelectorAll("[data-i-alt]").forEach(function(el){
    var v = pick(el.dataset.iAlt, kk); if (v !== undefined) el.alt = v;
  });
  document.querySelectorAll("[data-i-aria]").forEach(function(el){
    var v = pick(el.dataset.iAria, kk); if (v !== undefined) el.setAttribute("aria-label", v);
  });
  document.querySelectorAll("[data-i-c]").forEach(function(el){
    var v = pick(el.dataset.iC, kk); if (v !== undefined) el.setAttribute("content", v);
  });
  document.querySelectorAll("[data-i-ph]").forEach(function(el){
    var v = pick(el.dataset.iPh, kk); if (v !== undefined) el.setAttribute("placeholder", v);
  });
  var t = document.querySelector("title[data-i-t]");
  if (t) { var tv = pick(t.dataset.iT, kk); if (tv !== undefined) t.textContent = tv; }
  var og = document.querySelector('meta[property="og:locale"]');
  if (og) og.setAttribute("content", kk ? "kk_KZ" : "ru_RU");
  document.querySelectorAll(".lang button").forEach(function(b){
    var on = b.getAttribute("data-lang") === (kk ? "kk" : "ru");
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });
  try { localStorage.setItem("es-lang", kk ? "kk" : "ru"); } catch(e){}
  setWaLinks();
  fillTicker();
  requestAnimationFrame(function(){ fitText(); update(); });
}
/* ?lang=kk в URL сильнее localStorage: русское объявление не должно открыть казахскую версию */
function initLang(){
  var url = new URLSearchParams(location.search).get("lang");
  var saved = null;
  try { saved = localStorage.getItem("es-lang"); } catch(e){}
  var lang = (url === "kk" || url === "ru") ? url : (saved === "kk" ? "kk" : "ru");
  applyLang(lang);
}
document.querySelectorAll(".lang button").forEach(function(b){
  b.addEventListener("click", function(){ applyLang(b.getAttribute("data-lang")); });
});

/* дисплейные строки: казахский длиннее - ужимаем, пока не влезет */
function fitText(){
  document.querySelectorAll(".h1 span").forEach(function(el){
    el.style.fontSize = "";
    var box = el.parentElement.clientWidth;
    if (!box) return;
    var size = parseFloat(getComputedStyle(el).fontSize), base = size;
    while (el.scrollWidth > box + 1 && size > base * 0.5) {
      size *= 0.95;
      el.style.fontSize = size + "px";
    }
  });
}

/* ---------------- БЕГУЩАЯ ЛЕНТА ----------------
   Копий столько, чтобы дорожка была шире двух экранов; шаг цикла - одна копия. */
function fillTicker(){
  var el = document.getElementById("ticker"); if (!el) return;
  var list = curLang() === "kk" ? TICK_KZ : TICK;
  var one = list.map(function(t){ return "<b>" + t + "</b>"; }).join("");
  el.innerHTML = one;
  var w = el.scrollWidth || 1000;
  var need = Math.max(2, Math.ceil((innerWidth * 2) / w) + 1);
  var html = "";
  for (var i = 0; i < need; i++) html += one;
  el.innerHTML = html;
  el.style.setProperty("--tkw", w + "px");
  el.style.setProperty("--tkd", Math.max(16, w / 55) + "s");
}
var rsTimer;
addEventListener("resize", function(){
  update();
  clearTimeout(rsTimer);
  rsTimer = setTimeout(function(){ fillTicker(); fitText(); update(); lanes.forEach(function(l){ l.state(); }); }, 200);
});
if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ fillTicker(); fitText(); update(); });

/* ---------------- МЕНЮ ---------------- */
var burger = document.getElementById("burger");
var mnav = document.getElementById("mnav");
function closeMenu(){
  document.body.classList.remove("menu-open");
  if (burger) burger.setAttribute("aria-expanded", "false");
}
if (burger) burger.addEventListener("click", function(){
  var open = document.body.classList.toggle("menu-open");
  burger.setAttribute("aria-expanded", open ? "true" : "false");
});
if (mnav) mnav.addEventListener("click", function(e){ if (e.target.closest("a")) closeMenu(); });
addEventListener("keydown", function(e){ if (e.key === "Escape") { closeMenu(); closeModal(); } });

/* ---------------- ЯКОРЯ ---------------- */
var HH = function(){ return parseFloat(getComputedStyle(root).getPropertyValue("--hh")) || 70; };
document.addEventListener("click", function(e){
  var a = e.target.closest('a[href^="#"]'); if (!a) return;
  var id = a.getAttribute("href").slice(1); if (!id) return;
  var t = document.getElementById(id); if (!t) return;
  e.preventDefault();
  closeMenu();
  var top = t.getBoundingClientRect().top + scrollY - (t.classList.contains("pw") ? 0 : HH() + 10);
  scrollTo({ top: Math.max(0, top), behavior: RED ? "auto" : "smooth" });
  try { history.pushState(null, "", "#" + id); } catch(err){}
});

/* ---------------- ШАПКА ---------------- */
var hdr = document.getElementById("hdr");
function hdrState(){ if (hdr) hdr.classList.toggle("solid", scrollY > 40); }

/* ---------------- ПЛИТЫ И ЛИНИИ ----------------
   Один слушатель scroll через rAF. На каждую обёртку .pw пишем
   --enter / --exit / --stay и шесть --rN - состояние линий (рядов кадра):
   0 - шторка закрыта, 1 - открыта. Ряды взводятся по очереди, с мерцанием
   включения: пол-яркости, провал, почти полный, провал, ровный свет. */
var N = 6;
function clamp(v){ return v < 0 ? 0 : (v > 1 ? 1 : v); }
function easeInOut(t){ return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
function flick(t){
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  if (t < .18) return .5 * t / .18;
  if (t < .3)  return .12;
  if (t < .5)  return .85;
  if (t < .62) return .3;
  return 1;
}
function rows(pw, prog){
  for (var i = 0; i < N; i++) pw.style.setProperty("--r" + i, flick(clamp(prog * (N + .6) - i)).toFixed(3));
}
var pws = [].slice.call(document.querySelectorAll(".pw"));
var heroPw = document.getElementById("top");
var hero = document.getElementById("hero");
var brks = [].slice.call(document.querySelectorAll(".brk"));
var bar = document.getElementById("bar");
var kont = document.getElementById("kontakty");
var introK = 1, introDone = true;
function update(){
  var H = innerHeight || root.clientHeight;
  pws.forEach(function(pw){
    var r = pw.getBoundingClientRect();
    var enter = clamp(1 - r.top / H);
    var exit  = clamp(1 - r.bottom / H);
    var stay  = r.height > H + 1 ? clamp(-r.top / (r.height - H)) : enter;
    pw.style.setProperty("--enter", enter.toFixed(3));
    pw.style.setProperty("--exit",  exit.toFixed(3));
    pw.style.setProperty("--stay",  stay.toFixed(3));
    pw.classList.toggle("gone", exit >= 1);
    pw.classList.toggle("on", enter > 0.6);
    if (pw === heroPw) {
      rows(pw, introK);
      brks.forEach(function(b, i){ b.classList.toggle("is-on", introK * (N + .6) - i > .75); });
    } else {
      rows(pw, clamp((enter - .3) / .55));
    }
  });
  hdrState();
  /* липкая панель: после 55 % первого экрана, прячется на контактах */
  if (bar) {
    var onKont = kont && kont.getBoundingClientRect().top < H * 0.6;
    bar.classList.toggle("show", scrollY > H * 0.55 && !onKont);
  }
}
if (RED) {
  root.classList.add("no-plate");
  root.classList.add("no-intro");
  if (hero) hero.classList.add("on");
  brks.forEach(function(b){ b.classList.add("is-on"); });
  addEventListener("scroll", function(){ hdrState(); if (bar) bar.classList.toggle("show", scrollY > innerHeight * 0.55); }, {passive:true});
  hdrState();
} else {
  var tick = false;
  addEventListener("scroll", function(){
    if (tick) return; tick = true;
    requestAnimationFrame(function(){ tick = false; update(); });
  }, {passive:true});
  addEventListener("load", update);
  /* интро 1400 мс: автоматы взводятся по очереди, каждый включает свою линию кадра.
     Пропускаем при хэше / прокрутке - человек из рекламы сразу видит собранный экран. */
  var skip = location.hash || scrollY > 80;
  if (skip) {
    root.classList.add("no-intro");
    if (hero) hero.classList.add("on");
    update();
  } else {
    introK = 0; introDone = false; update();
    var t0 = null;
    var step = function(ts){
      if (introDone) return;
      if (t0 === null) t0 = ts;
      var p = clamp((ts - t0) / 1400);
      introK = p;
      update();
      if (p < 1) requestAnimationFrame(step);
      else introDone = true;
    };
    requestAnimationFrame(function(){ if (hero) hero.classList.add("on"); requestAnimationFrame(step); });
    /* страховка: если rAF не тикает (фоновая вкладка), собрать экран по таймеру */
    setTimeout(function(){ if (hero) hero.classList.add("on"); }, 400);
    setTimeout(function(){ if (!introDone) { introDone = true; introK = 1; update(); } }, 2400);
  }
}
/* страховка: пересчитать плиты после догрузки шрифтов и картинок (и под виртуальным временем headless) */
[1500, 3000, 5000].forEach(function(ms){ setTimeout(update, ms); });
window.plateSync = function(){ introDone = true; introK = 1; if (hero) hero.classList.add("on"); update(); };
addEventListener("hashchange", function(){ root.classList.add("no-intro"); });

/* ---------------- ПОЯВЛЕНИЕ В КАТАЛОЖНЫХ СЕКЦИЯХ ---------------- */
if (HAS_IO) {
  if (!RED) root.classList.add("js");
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  }, {threshold:.12, rootMargin:"0px 0px -6% 0px"});
  document.querySelectorAll(".rv").forEach(function(el){ io.observe(el); });
  setTimeout(function(){ document.querySelectorAll(".rv:not(.in)").forEach(function(el){
    if (el.getBoundingClientRect().top < innerHeight) el.classList.add("in");
  }); }, 1500);
} else {
  document.querySelectorAll(".rv").forEach(function(el){ el.classList.add("in"); });
}

/* ---------------- СЧЁТЧИКИ ---------------- */
(function(){
  var nums = [].slice.call(document.querySelectorAll(".num [data-to]"));
  if (!nums.length) return;
  function run(el){
    var to = parseFloat(el.dataset.to), t0 = null;
    if (RED) { el.textContent = to; return; }
    var step = function(ts){
      if (t0 === null) t0 = ts;
      var p = clamp((ts - t0) / 1200), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  if (HAS_IO) {
    var nio = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting){ run(e.target); nio.unobserve(e.target); } }); }, {threshold:.5});
    nums.forEach(function(n){ nio.observe(n); });
  } else nums.forEach(run);
})();

/* ---------------- ВИДЕО ПО ВИДИМОСТИ ----------------
   src подставляется, когда кадр входит в вьюпорт; вне кадра - пауза.
   Класс is-live вешаем по событию playing, чтобы не мигал чёрный кадр. */
(function(){
  var vids = [].slice.call(document.querySelectorAll("video[data-src]"));
  if (!vids.length) return;
  var save = navigator.connection && (navigator.connection.saveData || /2g/.test(navigator.connection.effectiveType || ""));
  vids.forEach(function(v){ v.addEventListener("playing", function(){ v.classList.add("is-live"); }); });
  function on(v){
    if (!v.getAttribute("src")) { v.src = v.dataset.src; v.load(); }
    var p = v.play(); if (p && p.catch) p.catch(function(){});
  }
  function off(v){ if (!v.paused) v.pause(); }
  if (RED || save) return;
  if (HAS_IO) {
    var vio = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting) on(e.target); else off(e.target); });
    }, {threshold:.3});
    vids.forEach(function(v){ vio.observe(v); });
  } else {
    vids.forEach(on);
  }
  document.addEventListener("visibilitychange", function(){
    vids.forEach(function(v){ if (document.hidden) off(v); else if (v.getAttribute("src") && v.getBoundingClientRect().top < innerHeight) on(v); });
  });
})();

/* ---------------- МОДАЛЬНЫЙ ПЛЕЕР ---------------- */
var vm = document.getElementById("vm"), vmVideo = document.getElementById("vm-video"), vmTitle = document.getElementById("vm-title");
var lastFocus = null;
function openModal(src, titleKey){
  if (!vm) return;
  lastFocus = document.activeElement;
  vmTitle.textContent = titleKey ? plain(T(titleKey)) : "";
  vmVideo.src = src;
  vm.classList.add("open");
  document.body.classList.add("vm-open");
  var p = vmVideo.play(); if (p && p.catch) p.catch(function(){});
  document.getElementById("vm-x").focus();
}
function closeModal(){
  if (!vm || !vm.classList.contains("open")) return;
  vm.classList.remove("open");
  document.body.classList.remove("vm-open");
  vmVideo.pause(); vmVideo.removeAttribute("src"); vmVideo.load();
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-video]");
  if (b) { e.preventDefault(); openModal(b.dataset.video, b.dataset.vt); return; }
  if (e.target === vm || e.target.closest("#vm-x")) closeModal();
});

/* ---------------- ЛЕНТЫ С КНОПКАМИ ----------------
   Шаг - ровно одна карточка (ширина + gap из стилей), крайняя кнопка гаснет,
   обе прячутся, если всё влезло. Ленте tabindex=0 - листается стрелками. */
var lanes = [];
document.querySelectorAll(".lane-w").forEach(function(w){
  var lane = w.querySelector(".lane"), prev = w.querySelector(".lbtn.prev"), next = w.querySelector(".lbtn.next");
  if (!lane || !prev || !next) return;
  function stepW(){
    var c = lane.firstElementChild; if (!c) return 300;
    var cs = getComputedStyle(lane);
    var gap = parseFloat(cs.columnGap || cs.gap) || 14;
    return c.getBoundingClientRect().width + gap;
  }
  function state(){
    var max = lane.scrollWidth - lane.clientWidth;
    var none = max <= 1;
    prev.hidden = none; next.hidden = none;
    prev.disabled = lane.scrollLeft <= 1;
    next.disabled = lane.scrollLeft >= max - 1;
  }
  prev.addEventListener("click", function(){ lane.scrollBy({left: -stepW(), behavior: RED ? "auto" : "smooth"}); });
  next.addEventListener("click", function(){ lane.scrollBy({left: stepW(), behavior: RED ? "auto" : "smooth"}); });
  lane.addEventListener("scroll", state, {passive:true});
  lane.addEventListener("keydown", function(e){
    if (e.key === "ArrowRight") { e.preventDefault(); next.click(); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); prev.click(); }
  });
  state();
  addEventListener("load", state);
  lanes.push({state: state});
});

/* ---------------- ФОРМА → WhatsApp ---------------- */
var form = document.getElementById("form");
if (form) form.addEventListener("submit", function(e){
  e.preventDefault();
  var ok = document.getElementById("fmok"), err = document.getElementById("fmerr");
  if (form.company && form.company.value) return;          /* honeypot */
  var name = form.name.value.trim(), phone = form.phone.value.trim(), msg = form.msg.value.trim();
  if (!name || phone.replace(/\D/g, "").length < 10 || !form.agree.checked) { err.hidden = false; ok.hidden = true; return; }
  err.hidden = true;
  var L = curLang();
  var t = (L === "kk"
    ? "Сәлеметсіз бе! Электросервис сайтынан өтінім.\nАты: " + name + "\nТелефон: " + phone + (msg ? "\nНе керек: " + msg : "")
    : "Здравствуйте! Заявка с сайта Электросервис.\nИмя: " + name + "\nТелефон: " + phone + (msg ? "\nЧто нужно: " + msg : ""));
  ok.hidden = false;
  conv("lead");
  window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(t), "_blank", "noopener");
});

/* ---------------- ВИДЕО ГЕРОЯ ----------------
   Петля без звука подключается после интро и только на нормальном соединении. */
(function(){
  var v = document.getElementById("hero-video"); if (!v) return;
  var save = navigator.connection && (navigator.connection.saveData || /2g/.test(navigator.connection.effectiveType || ""));
  if (RED || save) return;
  setTimeout(function(){
    if (!v.getAttribute("src")) { v.src = v.dataset.src; v.load(); }
    var p = v.play(); if (p && p.catch) p.catch(function(){});
  }, 700);
})();

/* ---------------- СТАРТ ---------------- */
snapshot();
initLang();
fillTicker();
fitText();
hdrState();
})();
