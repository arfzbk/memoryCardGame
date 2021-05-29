var flipSound;
var successSound;
var winSound;
var loseSound;
let wrongSound;
let acikKartlar = [],
  eslesmeSayici = 0,
  hareketSayici = 0,
  denemeSayici = 0,
  yildizOrani = 3,
  kalanZaman = 120;

//Timer için nesne yaratma ve 2 dakikadan başlatma
const timer = document.createElement("div");
timer.className = "timer";
timer.innerHTML = "02:00";
const panel = document.getElementsByClassName("score-panel");
panel[0].appendChild(timer);
let toplamSaniye;

//Desteyi nesneye atma
let deste = document.getElementsByClassName("deck");
//Hareketleri alma ve 0 değerini atama
let hareketler = document.getElementsByClassName("moves");
hareketler[0].innerHTML = 0;

//Sıfırlama ikonunu elde etme
const restart = document.getElementsByClassName("fa-repeat");
console.log("burası çalıştı");
var semboller = [];
var yol = window.location.pathname;
var page = yol.split("/").pop();
console.log("sayfa" + page);
if (page == "seviye1.html") {
  semboller = ["plane", "bicycle", "subway", "car", "rocket"];
} else if (page == "seviye2.html") {
  semboller = [
    "bitcoin",
    "eur",
    "try",
    "cny",
    "dollar",
    "shekel",
    "gbp",
    "gg",
    "ruble",
  ];
} else {
  semboller = [
    "apple",
    "amazon",
    "google",
    "github",
    "linkedin",
    "reddit",
    "spotify",
    "twitter",
    "instagram",
    "whatsapp",
  ];
}
const kartlar = [...semboller, ...semboller];
function karistir(dizi) {
  var currentIndex = dizi.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = dizi[currentIndex];
    dizi[currentIndex] = dizi[randomIndex];
    dizi[randomIndex] = temporaryValue;
  }
  return dizi;
}
buildCongrats();
function buildCongrats() {
  const page = document.getElementsByClassName("container");
  const popup = document.createElement("div");
  popup.className = "congratsPopup dimmed";
  popup.innerHTML = "";
  page[0].appendChild(popup);
}
restart[0].addEventListener("click", reset);
reset();

function reset() {
  acikKartlar = [];
  eslesmeSayici = 0;
  denemeSayici = 0;
  resetTimer();
  resetSayici();
  resetYildizlar();
  desteTemizle(deste);
  let karisikDeste = karistir(kartlar);
  htmlDesteYarat(karisikDeste);
  tebrikleriGizle();
}
function tebrikleriGizle() {
  const popup = document.getElementsByClassName("congratsPopup");
  popup[0].className = "congratsPopup dimmed";
  popup[0].innerHTML = "";
}
function desteTemizle(deste) {
  deste[0].remove();
}
function resetTimer() {
  clearInterval(kalanZaman);
  toplamSaniye = 120;
  timer.innerHTML = "02:00";
}
function resetSayici() {
  hareketler[0].innerHTML = hareketSayici = 0;
}
function resetYildizlar() {
  yildizOrani = 3;
  const yildizlar = document.getElementsByClassName("fa-star");
  for (let i = 0; i < 3; i++) {
    yildizlar[i].className = "fa fa-star";
  }
}
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function () {
    this.sound.play();
  };
  this.stop = function () {
    this.sound.pause();
  };
}
function htmlDesteYarat(deste) {
  flipSound = new sound("assets/sound/flip.mp3");
  successSound = new sound("assets/sound/success.mp3");
  winSound = new sound("assets/sound/win.mp3");
  loseSound = new sound("assets/sound/lose.mp3");
  wrongSound = new sound("assets/sound/wrong.mp3");
  const ul = document.createElement("ul");
  ul.className = "deck";
  const container = document.getElementsByClassName("container");
  container[0].appendChild(ul);
  for (let i = 0; i < deste.length; i++) {
    const li = document.createElement("li");
    li.className = "card";
    const inner = document.createElement("i");
    inner.className = `fa fa-${deste[i]}`;
    ul.appendChild(li);
    li.appendChild(inner);
    li.addEventListener("click", surecTiklama);
  }
}
//Eğer kart zaten açıksa true döner değilse false
function ayniKartMi(item) {
  const ayniMi = item.className === "card open show" ? true : false;
  return ayniMi;
}
//kart zaten esli ise true döner değil ise false
function zatenEsliMi(item) {
  const esliMi = item.className === "card match" ? true : false;
  return esliMi;
}
//Kart gösterme
function kartGoster(item) {
  item.className = "card open show";
}
//Açılmış sembollerin bir listesine değeri ekleme
function addOpenedList(item) {
  let inner = item.childNodes;
  for (let i = 0; i < inner.length; i++) {
    let symbol = inner[i].className;
    //fa-fa kaldırma
    symbol = symbol.slice(6);
    acikKartlar.push(symbol);
  }
}
function sayiciArttirici() {
  hareketSayici++;
  hareketler[0].innerHTML = hareketSayici;
}
function timerDurdur() {
  clearInterval(kalanZaman);
}
function zamanBitti() {
  loseSound.play();
  const popup = document.getElementsByClassName("congratsPopup");
  popup[0].style.backgroundColor = "#ff6f61";
  popup[0].className = "congratsPopup";
  popup[0].innerHTML = `<h2 style="color:white;"> OOPPSS!! </h2>
          <h3 style="color:white;"> Zaman doldu </h3>
          <p class="congratsPlay" style="position:absolute;bottom:25px;left:0; right:0;" > Tekrar Oyna </p>`;
  const play = document.getElementsByClassName(`congratsPlay`);
  play[0].addEventListener("click", reset);
}
function timerBaslat() {
  --toplamSaniye;
  function sifirEkle(i) {
    return i < 10 ? "0" + i : i;
  }
  let min = sifirEkle(Math.floor(toplamSaniye / 60));
  let sec = sifirEkle(toplamSaniye - min * 60);
  if (toplamSaniye == 0) {
    timerDurdur();
    setTimeout(function () {
      return zamanBitti();
    }, 900);
  }
  timer.innerHTML = `${min}:${sec}`;
}
function eslesenKitle() {
  let faSymbol = `fa-${acikKartlar[0]}`;
  let collection = document.getElementsByClassName(`${faSymbol}`);

  for (let i = 0; i < collection.length; i++) {
    collection[i].parentElement.className = "card match";
  }
  eslesmeSayici += 2;
}
function acikListeKaldir() {
  acikKartlar.pop();
  acikKartlar.pop();
}
function tebrikGoster() {
  const popup = document.getElementsByClassName("congratsPopup");
  popup[0].style.backgroundColor = "#fcf9ed";
  popup[0].className = "congratsPopup";
  popup[0].innerHTML = `<h2 class="congratsHeading" > Tebrikler </h2>
          <h3 class="congratsTagline" > Oyunu Kazandınız </h3>
          <p class="congratsMove" > ${hareketSayici} hareket </p>
          <p class="congratsTime" > ${timer.innerHTML} kalan zaman </p>
          <p class="congratsStar" > ${yildizOrani} yıldızlar </p>
          <h2 class="congratsPoint" > Puanınınız : ${
            toplamSaniye * 10 + yildizOrani * 100 - hareketSayici * 5
          } </h2>
          <p class="congratsPlay" > Tekrar Oyna </p>`;
  const play = document.getElementsByClassName("congratsPlay");
  play[0].addEventListener("click", reset);
}
function kartlariGizle() {
  let openClass = document.getElementsByClassName("open");
  while (openClass.length) {
    openClass[0].className = "card";
  }
}
function yildizDusur() {
  yildizOrani--;
  denemeSayici = 0;
  const stars = document.getElementsByClassName("fa-star");
  stars[yildizOrani].className = "fa fa-star dimmed";
}
function surecTiklama() {
  //Her tıklandığında ses getir.
  flipSound.play();
  if (acikKartlar.length < 2 && !ayniKartMi(this) && !zatenEsliMi(this)) {
    denemeSayici++;
    kartGoster(this);
    addOpenedList(this);
    sayiciArttirici();

    if (hareketSayici === 1) {
      //Timer başlat
      kalanZaman = setInterval(timerBaslat, 1000);
    }
    if (acikKartlar.length === 2) {
      //Eğer iki açık kart eşleşirse
      if (acikKartlar[0] === acikKartlar[1]) {
        successSound.play();
        denemeSayici = 0;
        eslesenKitle();
        acikListeKaldir();
        // Eğer destedeki tüm kartlar eşleşirse
        if (eslesmeSayici === semboller.length * 2) {
          timerDurdur();
          winSound.play();
          //Tebrik mesajı gönder
          setTimeout(function () {
            return tebrikGoster();
          }, 900);
        }
      } else {
        setTimeout(function () {
          return kartlariGizle();
        }, 1000);
        setTimeout(function () {
          return acikListeKaldir();
        }, 1000);
        if (hareketSayici >= 8 && denemeSayici >= 4 && yildizOrani > 0) {
          yildizDusur();
        }
        setTimeout(function () {
          return wrongSound.play();
        }, 500);
      }
    }
  }
}
