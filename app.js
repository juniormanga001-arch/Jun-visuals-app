const API="https://jun-visuals-backend.onrender.com";
const fallback=[
 {name:"Retouche photo HD/4K",price:"10$",description:"Retouche et amélioration haute qualité",icon:"✦"},
 {name:"Affiche événement",price:"15$",description:"Affiche professionnelle pour événement",icon:"▣"},
 {name:"Pochette musicale",price:"20$",description:"Cover premium pour ton projet musical",icon:"♫"},
 {name:"Montage vidéo",price:"Sur devis",description:"Montage créatif adapté à ton projet",icon:"▶"}
];
let services=[];
const $=id=>document.getElementById(id);
function show(id){document.getElementById(id)?.scrollIntoView({behavior:"smooth"});}
function toggleMenu(){$("drawer").classList.toggle("hidden")}
$("menuBtn").onclick=toggleMenu;

function render(list){
 services=list.length?list:fallback;
 $("serviceGrid").innerHTML=services.map((s,i)=>`<article class="service"><div class="ico">${s.icon||"✦"}</div><h3>${s.name||s.title||"Service"}</h3><p>${s.description||"Service JUN VISUALS"}</p><p style="color:#d6aa45;margin-top:8px">${s.price? s.price+"":""}</p><button onclick="pick(${i})">Commander</button></article>`).join("");
 $("serviceSelect").innerHTML=services.map((s,i)=>`<option value="${i}">${s.name||s.title}</option>`).join("");
}
function pick(i){$("serviceSelect").value=i;show("order");}
async function load(){
 try{
  const r=await fetch(API+"/api/services");
  if(!r.ok)throw Error();
  const data=await r.json();
  render(Array.isArray(data)?data:(data.services||[]));
  $("apiStatus").textContent="EN LIGNE";
 }catch(e){render(fallback);$("apiStatus").textContent="EN LIGNE (mode secours)";}
}
$("orderForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = $("customerName").value.trim();
  const contact = $("phone").value.trim();
  const description = $("description").value.trim();
  const serviceSelect = $("serviceSelect");
  const s = services[serviceSelect.value];

  if (!name || !contact || !description) {
    $("result").textContent = "Veuillez remplir tous les champs.";
    return;
  }

  const payload = {
    name: name,
    contact: contact,
    service: s?.name || "Service",
    details: description,
    price: s?.price || ""
  };

  $("result").textContent = "Envoi de la commande...";

  try {
    const r = await fetch(API + "/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await r.json();

    if (!r.ok) {
      throw new Error(data.message || "Erreur lors de l'envoi.");
    }

    $("result").textContent = "Commande envoyée avec succès !";
    e.target.reset();

  } catch (err) {
    $("result").textContent = "Erreur : " + err.message;
  }
});
load(); 
