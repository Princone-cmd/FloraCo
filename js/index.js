import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyCowmKg-VP3HIzoghbj-suz7pQDAs8nBng",
    authDomain: "floraco-e7158.firebaseapp.com",
    databaseURL: "https://floraco-e7158-default-rtdb.firebaseio.com",
    projectId: "floraco-e7158",
    storageBucket: "floraco-e7158.firebasestorage.app",
    messagingSenderId: "672300394740",
    appId: "1:672300394740:web:a2e9e110c9c2c2116616a1"
};

import {getDatabase, ref, child, get, set, update, remove} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

const app = initializeApp(firebaseConfig);

let id = 0;

var productList = [];

const db = getDatabase();

const inputHandler = function(e) {
    document.getElementById('logo').src = e.target.value;
}

document.getElementById('clear-fields').addEventListener('click', function (event) {
    document.getElementById('name').value = "";
    document.getElementById('te').value = "";
    document.getElementById('description').value = "";
    document.getElementById('imageURL').value = "";
    document.getElementById('price').value = 0;
    document.getElementById('type').value = "";
    document.getElementById('dimensions').value = ""; 
});

document.getElementById('show-product').addEventListener('click', function (event) { retrieveData(); });

document.getElementById('add-product').addEventListener('click', function (event) {
    event.preventDefault();

    get(child(ref(db), 'products/id')).then((snapshot)=>{
        
        var id = snapshot.val();

        const newProduct = {
            id: 'FCPS'+id.toString().padStart(5, "0"),
            name: document.getElementById('name').value,
            te: document.getElementById('te').value,
            description: document.getElementById('description').value,
            imageURL: document.getElementById('imageURL').value,
            price: parseFloat(document.getElementById('price').value),
            type: document.getElementById('type').value,
            dimensions: document.getElementById('dimensions').value,
            size: document.getElementById('size').value
        };

        var cat = document.getElementById('category').value;
        if (document.getElementById('name').value.trim()!="") {
            set(ref(db, 'products/all/'+cat+'/'+id), newProduct)
                .then(()=>{
                    alert("Data Added Successfully");
                    id = id+1;
                    set(ref(db, 'products/id'), id);
                })
                .catch((e)=>{
                    alert("Data Unsuccessful");
                    console.log(e);
                });
        }

    });
});

document.getElementById('imageURL').addEventListener('input', inputHandler);
document.getElementById('imageURL').addEventListener('propertychange', inputHandler);

function retrieveData(){
    productList = [];
    document.getElementById('section').innerHTML = "";
    get(child(ref(db), 'products/all/')).then((snapshot)=>{
var getClassOf = Function.prototype.call.bind(Object.prototype.toString);
        if (snapshot.exists()) { 
          let prods=Object.values(snapshot.val());
          for(var p in prods){
              if (getClassOf(prods[p])=="object") {
                  prods[p] = Object.values(prods[p]);
              }
              productList = productList.concat(Object.values(prods[p]));
          }
        }


        productList.forEach((product)=>{
          addSection(product);
        });
    });
}

function addSection(plant){

  const sections = document.getElementById('section');
  const mySection = document.createElement('div');
  mySection.setAttribute("class", "sectionBlock");

  const list = document.createElement("ul");
  list.setAttribute("class", "sectionList");

  addProduct(plant['id'], plant['name'], plant['te'],  plant['description'],  plant['imageURL'], plant['price'],  plant['type'],  plant['dimensions'], plant['size'], list);

  mySection.appendChild(list);
  sections.appendChild(mySection);
};

function addProduct(id, name, te, description, image, price, type, dimens, size, list) {

  const li = document.createElement('li');
  li.setAttribute("class", "liItem");
  const card = document.createElement('div');
  card.setAttribute("class", "card");

  const img = document.createElement('img');
  img.setAttribute("class", "image");
  if (image!="") {
    img.setAttribute("src", ""+image);
  }else{
    img.setAttribute("src", "./media/1.jpg");
  }

  const texts = document.createElement('div');
  texts.setAttribute('class', 'texts');

  const title = document.createElement('h4');
  title.setAttribute("class", "title");
  title.innerHTML = getText(name) + " ("+getText(te)+")";

  const desc = document.createElement('p');
  desc.setAttribute("class", "desc");
  desc.innerHTML = "ID: "+id+"\n"+getText(description) + "\nSize:" +getText(size)+"\nDimensions: "+getText(dimens);

  const cost = document.createElement('h5');
  cost.setAttribute("class", "price");
  cost.innerHTML = "Rs."+(((price+'') !="NaN")?price: "00.00");

  const add = document.createElement('button');
  add.setAttribute("class", "add");
  add.innerHTML = "Add To Garden";

  texts.appendChild(title);
  texts.appendChild(desc);
  texts.appendChild(cost);
  texts.appendChild(add);

  card.appendChild(img);
  card.appendChild(texts);

  li.appendChild(card);
  list.appendChild(li)
}

function getText(text){ return (text != null) ? ((text.toString().trim()!="")?text:" ") : ""; }