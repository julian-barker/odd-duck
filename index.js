'use strict';

// declare shortcut function
function $(selector) { return document.querySelector(selector); }
function $$(selector) { return document.querySelectorAll(selector); }
function byId(id) { return document.getElementById(id); }
function _(tag) { return document.createElement(tag); }



const iterations = 25;
const perTest = 3;
const pastChoices = [];
const products = [];
const imgDir = './img/';

let testCount;

Product.all = [];
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
  Product.all.push(this);
}


// determine which images to display
function createChoices() {
  const choices = [];
  while (choices.length < perTest) {
    const rand = Math.floor(Math.random() * products.length);
    const p = products[rand];
    if (!choices.includes(p) && !pastChoices.includes(p)) {
      choices.push(p);
    }
  }
  for (let choice of choices) {
    if (pastChoices.length > 5) {
      pastChoices.pop();
    }
    pastChoices.unshift(choice);
  }
  return choices;
}


// display the chosen images
function displayChoices(choices) {
  const container = $('.images');

  if (container.hasChildNodes()) {
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
    const imgs = $$('.images img');
    console.log(imgs);
    for (let img of imgs) {
      console.log(img);
      img.removeEventListener('click', imgClick);
    }
    const div = $('.images');
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
  result.innerHTML = '';
  sidebarTitle.innerHTML = 'Results:';

  let greatest = 0;
  let winner;

  sidebar.appendChild(sidebarTitle);

  for (let prod of products) {
    const p = _('p');

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

  winnerContent.innerHTML = `The winner is ${winner.name}, with ${winner.timesLiked} likes out of ${winner.timesShown} times shown and ${iterations} iterations.`;

  winnerDiv.appendChild(winnerImg);
  result.appendChild(winnerContent);
  images.appendChild(winnerDiv);

  renderChart();

  e.target.removeEventListener('click', displayResults);
}


function renderChart() {
  const div = $('.graphs');

  const canvasLike = _('canvas');
  const canvasView = _('canvas');
  const canvasPerc = _('canvas');

  canvasLike.id = 'product-likes';
  canvasLike.width = '600';
  canvasLike.height = '400';

  canvasView.id = 'product-views';
  canvasView.width = '600';
  canvasView.height = '400';

  canvasPerc.id = 'product-percentages';
  canvasPerc.width = '600';
  canvasPerc.height = '400';

  div.appendChild(canvasLike);
  div.appendChild(canvasView);
  div.appendChild(canvasPerc);

  const labels = [];
  const productLikes = [];
  const productViews = [];
  const productPercLikes = [];

  for (let prod of products) {
    labels.push(prod.name.slice(0,1).toUpperCase() + prod.name.slice(1));
    productLikes.push(prod.timesLiked);
    productViews.push(prod.timesShown);
    productPercLikes.push(Math.floor((prod.timesLiked / prod.timesShown) * 100));
  }

  const likeData = {
    labels: labels,
    datasets: [{
      label: 'Likes',
      data: productLikes,
      backgroundColor: ['rgba(255, 99, 132, 0.2)'],
      borderColor: ['rgb(255, 99, 132)'],
      borderWidth: 1
    }]
  };

  const configLike = {
    type: 'bar',
    data: likeData,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  };

  const viewData = {
    labels: labels,
    datasets: [{
      label: 'Views',
      data: productViews,
      backgroundColor: ['rgba(255, 159, 64, 0.2)'],
      borderColor: ['rgb(255, 159, 64)'],
      borderWidth: 1
    }]
  };

  const configView = {
    type: 'bar',
    data: viewData,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  };

  const likePercData = {
    labels: labels,
    datasets: [{
      label: 'Like Percentage',
      data: productPercLikes,
      backgroundColor: ['rgba(150, 159, 255, 0.2)'],
      borderColor: ['rgb(255, 159, 64)'],
      borderWidth: 1
    }]
  };

  const configPerc = {
    type: 'bar',
    data: likePercData,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  };

  const likeChart = new Chart(canvasLike, configLike);
  const viewChart = new Chart(canvasView, configView);
  const percChart = new Chart(canvasPerc, configPerc);

}

