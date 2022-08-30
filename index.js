'use strict';


// declare shortcut function
function $(selector) { return document.querySelector(selector) }
function $$(selector) { return document.querySelectorAll(selector) }
function byId(id) { return document.getElementById(id) }
function _(tag) { return document.createElement(tag) }



const iterations = 25;
const perTest = 3;
const products = [];
const imgDir = './img/';

let testCount;


new Product(imgDir, 'bag.jpg');
new Product(imgDir, 'banana.jpg');
new Product(imgDir, 'bathroom.jpg');
new Product(imgDir, 'boots.jpg');
new Product(imgDir, 'breakfast.jpg');
new Product(imgDir, 'bubblegum.jpg');
new Product(imgDir, 'chair.jpg');
new Product(imgDir, 'cthulhu.jpg');
new Product(imgDir, 'dog-duck.jpg');
new Product(imgDir, 'dragon.jpg');
new Product(imgDir, 'pen.jpg');
new Product(imgDir, 'pet-sweep.jpg');
new Product(imgDir, 'scissors.jpg');
new Product(imgDir, 'shark.jpg');
new Product(imgDir, 'sweep.png');
new Product(imgDir, 'tauntaun.jpg');
new Product(imgDir, 'unicorn.jpg');
new Product(imgDir, 'water-can.jpg');
new Product(imgDir, 'wine-glass.jpg');


startTest();



function Product(imgDir, image) {
  this.image = `${imgDir}${image}`;
  this.name = image.substr(0, image.lastIndexOf('.'));
  this.timesShown = 0;
  this.timesLiked = 0;
  this.id = products.push(this) - 1;
}

function createChoices() {
  const choices = [];
  while (choices.length < perTest) {
    const rand = Math.floor(Math.random() * products.length);
    if (!choices.includes(products[rand])) {
      choices.push(products[rand]);
    }
  }
  return choices;
}

function displayChoices(choices) {
  const container = $('.images');

  while (container.hasChildNodes()) {
    container.innerHTML = '';
  }

  for (let choice of choices) {
    const div = _('div');
    const img = _('img');

    img.src = choice.image;
    img.id = choice.id;
    img.alt = choice.name;
    img.classList.add('testImg');
    img.addEventListener('click', imgClick);

    div.appendChild(img);
    container.appendChild(div);

    choice.timesShown++;
  }
}

function imgClick(e) {
  products[parseInt(e.target.id)].timesLiked++; 
  runTestIteration();
}

function runTestIteration() {
  if (testCount < iterations) {
    const choices = createChoices();
    displayChoices(choices);
    testCount++;
  } else {
    const imgs = $$('.images img')
    console.log(imgs);
    for (let img of imgs) {
      console.log(img);
      img.removeEventListener('click', imgClick);
    }
    const div = $('.main-content');
    const btn = _('button');

    btn.id = 'view-results';
    btn.addEventListener('click', displayResults);
    btn.textContent = 'View Results';
    div.appendChild(btn);
  }
}



function startTest() {
  for (let prod of products) {
    prod.timesShown = 0;
    prod.timesLiked = 0;
  }

  testCount = 0;
  runTestIteration();
}



function displayResults(e) {
  const images = $('.images');
  const result = $('.result');
  const sidebar = $('.sidebar');
  const sidebarTitle = _('h2');
  
  images.innerHTML = '';
  sidebar.innerHTML = '';
  // result.innerHTML = '';
  sidebarTitle.innerHTML = 'Results:';

  let greatest = 0;
  let winner;

  sidebar.appendChild(sidebarTitle);

  for (let prod of products) {
    const p = _('p');
    const winPercentage = prod.timesLiked / prod.timesShown;

    p.innerHTML = `<b>${prod.name}</b>: ${prod.timesLiked} votes, ${prod.timesShown} views`;
    // p.innerHTML = `
    // ${prod.name}: shown ${prod.timesShown} times (${Math.floor(prod.timesShown / 25 * 100)}%)  -  liked ${prod.timesLiked} times (${Math.floor(prod.timesLiked / 25 * 100)}%)`;
    sidebar.appendChild(p);
    if (prod.timesLiked > greatest) {
      greatest = prod.timesLiked;
      winner = prod;
    }
  }

  const winnerDiv = _('div');
  const winnerImg = _('img');
  const winnerContent = _('p');

  winnerDiv.classList.add('winner');

  winnerImg.src = winner.image;
  winnerImg.alt = winner.name;

  winnerContent.innerHTML = `The winner is ${winner.name}, with ${winner.timesLiked} likes out of ${winner.timesShown} times shown and ${iterations} iterations.`

  winnerDiv.appendChild(winnerImg);
  result.appendChild(winnerContent);
  images.appendChild(winnerDiv);

  e.target.removeEventListener('click', displayResults);
}

