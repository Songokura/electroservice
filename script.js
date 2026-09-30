/* ============================================================
   ЭЛЕКТРОСЕРВИС - скрипт страницы (тёмная версия, 30.09.2026).
   Анимаций прокрутки нет по просьбе клиента: ни плит, ни появлений,
   ни счётчиков. Здесь только: конверсии · перевод RU/KZ (словарь KZ -
   assets/lang/kk.js по клику, ?lang= сильнее localStorage) · меню ·
   ленты с кнопками · видео по нажатию · WhatsApp с названием услуги ·
   форма в WhatsApp. Библиотек нет.
   ============================================================ */
(function(){
"use strict";
var WA = "77769991286";                  /* основной WhatsApp Электросервис */
var root = document.documentElement;

/* ---------------- КОНВЕРСИИ GOOGLE ADS ----------------
   Ярлыки задаёт index.html (window.ES_CONV). Клики по телефону и WhatsApp
   ловим делегированием в фазе захвата, переход не блокируем.
   Пустой ярлык - событие не шлём. */
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

/* ---------------- ПЕРЕВОД ----------------
   Разметка русская. Казахский словарь заполняется из assets/lang/kk.js.
   Ключа нет - строка остаётся русской. */
var KZ = {};
var WA_TXT = {
ru:{
  hero:"Здравствуйте! Пишу с сайта Электросервис. Нужен электромонтаж:\n",
  card:"Здравствуйте! Хочу рассчитать стоимость:\n{t}\nОбъект и адрес: ",
  kontakty:"Здравствуйте! Пишу с сайта Электросервис. Вопрос: ",
  form:["Здравствуйте! Заявка с сайта Электросервис.\nИмя: ", "\nТелефон: ", "\nЧто нужно: "]
}
};
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

/* текст заявки собирается из заголовка услуги на текущем языке.
   Ссылки переписываются заранее (не в момент клика), поэтому трекер
   LeadBot дописывает код обращения уже в готовый href. */
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
  kkReviews(kk);
}
/* ?lang=kk в URL сильнее localStorage: русское объявление не должно открыть казахскую версию */
function initLang(){
  var url = new URLSearchParams(location.search).get("lang");
  var saved = null;
  try { saved = localStorage.getItem("es-lang"); } catch(e){}
  var lang = (url === "kk" || url === "ru") ? url : (saved === "kk" ? "kk" : "ru");
  setLang(lang);
}

/* Казахский словарь лежит отдельным файлом и грузится только когда человек сам
   выбрал KZ (или открыл ?lang=kk). Версия файла берётся из ?v= этого скрипта -
   бампается вместе с остальными ассетами. Не загрузился - остаёмся на русском. */
var ASSET_V = ((document.currentScript && document.currentScript.src.match(/[?&]v=([^&]+)/)) || [])[1] || "";
var KK_REV = "", kkLoaded = false;
function loadKK(done){
  if (kkLoaded) return done(true);
  var s = document.createElement("script");
  s.src = "assets/lang/kk.js" + (ASSET_V ? "?v=" + ASSET_V : "");
  s.onload = function(){
    var d = window.SITE_KK;
    if (!d) return done(false);
    KZ = d.dict; WA_TXT.kk = d.wa; KK_REV = d.reviews || ""; kkLoaded = true;
    done(true);
  };
  s.onerror = function(){ done(false); };
  document.head.appendChild(s);
}
function setLang(lang){
  if (lang !== "kk") return applyLang("ru");
  loadKK(function(ok){ applyLang(ok ? "kk" : "ru"); });
}
/* казахские отзывы 2ГИС - в ленту только в казахской версии */
function kkReviews(kk){
  var lane = document.getElementById("rlane");
  if (!lane) return;
  lane.querySelectorAll("[data-kk-rev]").forEach(function(el){ el.remove(); });
  if (kk && KK_REV) lane.insertAdjacentHTML("beforeend", KK_REV);
  lanes.forEach(function(l){ l.state(); });
}
document.querySelectorAll(".lang button").forEach(function(b){
  b.addEventListener("click", function(){ setLang(b.getAttribute("data-lang")); });
});

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
addEventListener("keydown", function(e){ if (e.key === "Escape") closeMenu(); });
addEventListener("resize", function(){ if (innerWidth > 1100) closeMenu(); });

/* ---------------- ЛЕНТЫ С КНОПКАМИ ----------------
   Шаг - ровно одна карточка (ширина + gap), крайняя кнопка гаснет,
   обе прячутся, если всё влезло. Ленте tabindex=0 - листается стрелками. */
var lanes = [];
document.querySelectorAll(".lnav[data-lane]").forEach(function(nav){
  var lane = document.getElementById(nav.dataset.lane);
  var prev = nav.querySelector(".prev"), next = nav.querySelector(".next");
  if (!lane || !prev || !next) return;
  function stepW(){
    var c = lane.firstElementChild; if (!c) return 300;
    var gap = parseFloat(getComputedStyle(lane).columnGap) || 20;
    return c.getBoundingClientRect().width + gap;
  }
  function state(){
    var max = lane.scrollWidth - lane.clientWidth;
    var none = max <= 1;
    nav.hidden = none;
    prev.disabled = lane.scrollLeft <= 1;
    next.disabled = lane.scrollLeft >= max - 1;
  }
  prev.addEventListener("click", function(){ lane.scrollBy({left: -stepW(), behavior: "smooth"}); });
  next.addEventListener("click", function(){ lane.scrollBy({left: stepW(), behavior: "smooth"}); });
  lane.addEventListener("scroll", state, {passive:true});
  lane.addEventListener("keydown", function(e){
    if (e.key === "ArrowRight") { e.preventDefault(); next.click(); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); prev.click(); }
  });
  addEventListener("resize", state);
  addEventListener("load", state);
  state();
  lanes.push({state: state});
});

/* ---------------- ВИДЕО ПО НАЖАТИЮ ----------------
   Сами ролики не включаются: в карточке постер и кнопка. По нажатию
   на месте постера появляется плеер со звуком (карточка раскрывается
   до 9:16, чтобы ролик был виден целиком), остальные ставятся на паузу. */
document.addEventListener("click", function(e){
  var b = e.target.closest(".vbtn[data-video]"); if (!b) return;
  document.querySelectorAll(".vcard video").forEach(function(v){ v.pause(); });
  var card = b.closest(".vcard");
  var v = document.createElement("video");
  v.src = b.dataset.video;
  v.controls = true; v.playsInline = true; v.setAttribute("playsinline", "");
  v.preload = "auto";
  var img = b.querySelector("img"); if (img) v.poster = img.currentSrc || img.src;
  v.setAttribute("aria-label", b.getAttribute("aria-label") || "");
  v.addEventListener("play", function(){
    document.querySelectorAll(".vcard video").forEach(function(o){ if (o !== v) o.pause(); });
  });
  if (card) card.classList.add("playing");
  b.replaceWith(v);
  var p = v.play(); if (p && p.catch) p.catch(function(){});
  lanes.forEach(function(l){ l.state(); });
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
  var F = WA_TXT[curLang()].form;
  var t = F[0] + name + F[1] + phone + (msg ? F[2] + msg : "");
  ok.hidden = false;
  conv("lead");
  window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(t), "_blank", "noopener");
});

/* ---------------- СТАРТ ---------------- */
snapshot();
initLang();
})();
