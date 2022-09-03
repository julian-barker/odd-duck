'use strict';

// declare shortcut function
function $(selector) { return document.querySelector(selector); }
function $$(selector) { return document.querySelectorAll(selector); }
function _(tag) { return document.createElement(tag); }
// function byId(id) { return document.getElementById(id); }


const iterations = 25;
const perTest = 3;
const pastChoices = [];
const imgDir = './img/';

let products = [];

let testCount;
// console.log(localStorage['products']);
const maybe = localStorage['products'];
if (maybe) {
  products = JSON.parse(maybe);
} else {
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
  localStorage['products'] = JSON.stringify(products);
}

// console.log(products);
for (let prod of products) {
  prod.sessionViews = 0;
  prod.sessionLikes = 0;
}


startTest();


function Product(imgDir, image) {
  this.image = `${imgDir}${image}`;
  this.name = image.substr(0, image.lastIndexOf('.'));
  this.sessionLikes = 0;
  this.sessionViews = 0;
  this.totalLikes = 0;
  this.totalViews = 0;
  this.id = products.push(this) - 1;
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
  // console.log(choices);
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

    choice.sessionViews++;
    choice.totalViews++;
    localStorage['products'] = JSON.stringify(products);
  }
}

// run a new test iteration every time an image is clicked
function imgClick(e) {
  products[parseInt(e.target.id)].sessionLikes++;
  products[parseInt(e.target.id)].totalLikes++;
  localStorage['products'] = JSON.stringify(products);
  runTestIteration();
}

// for a new test iteration, create the array of choices and then display them, adding event handlers to the images
// if max iterations is reached, present user with results button
function runTestIteration() {
  if (testCount === iterations) {
    // for (let prod of products) {
    //   prod.totalLikes += prod.sessionLikes;
    //   prod.totalViews += prod.sessionViews;
    //   // console.log(prod.sessionViews, prod.totalViews);
    // }
    const imgs = $$('.testImg');
    for (let image of imgs) {
      image.removeEventListener('click', imgClick);
    }

    const div = $('.images');
    const btn = _('button');

    btn.id = 'view-results';
    btn.addEventListener('click', displayResults);
    btn.addEventListener('click', runTestIteration);
    btn.textContent = 'View Results';
    div.appendChild(btn);
  } else {
    if (testCount > iterations) {
      displayResults();
    }
    const choices = createChoices();
    displayChoices(choices);
  }
  testCount++;
}


// initializes the test
function startTest() {
  testCount = 0;
  runTestIteration();
}


// displays results after view-results button is pressed
function displayResults() {
  if ($('#view-results')) {
    $('#view-results').remove();
  }

  const images = $('.images');
  const result = $('.result');
  const data = $('.data');
  const sideColumn = $('.side-column');
  const sideColumnTitle = _('h2');

  images.innerHTML = '';
  result.innerHTML = '';
  data.innerHTML = '';
  sideColumn.innerHTML = '';
  sideColumnTitle.innerHTML = 'Results:';

  let greatest = 0;
  let winner;

  sideColumn.appendChild(sideColumnTitle);

  for (let prod of products) {
    const p = _('p');

    p.innerHTML = `<b>${prod.name}</b>: ${prod.sessionLikes} votes, ${prod.sessionViews} views`;
    sideColumn.appendChild(p);
    if (prod.sessionLikes > greatest) {
      greatest = prod.sessionLikes;
      winner = prod;
    }
  }

  const winnerDiv = _('div');
  const winnerImg = _('img');
  const winnerContent = _('p');

  winnerDiv.classList.add('winner');

  winnerImg.src = winner.image;
  winnerImg.alt = winner.name;

  winnerContent.innerHTML = `The winner is ${winner.name}, with ${winner.sessionLikes} likes out of ${winner.sessionViews} times shown and ${testCount - 1} iterations.`;

  winnerDiv.appendChild(winnerImg);
  result.appendChild(winnerDiv);
  result.appendChild(winnerContent);

  renderChart();

  // localStorage['products'] = JSON.stringify(products);
}


// render results charts on results press
function renderChart() {
  const data = $('.data');

  const title = _('h2');
  const div = _('div');
  const session = _('div');
  const total = _('div');
  const sessionRawDiv = _('div');
  const sessionPercDiv = _('div');
  const totalRawDiv = _('div');
  const totalPercDiv = _('div');

  const sessionRawCanvas = _('canvas');
  const sessionPercCanvas = _('canvas');
  const totalRawCanvas = _('canvas');
  const totalPercCanvas = _('canvas');

  div.classList.add('graphs');

  sessionRawCanvas.id = 'session-product-data';
  sessionRawCanvas.width = '500';
  sessionRawCanvas.height = '300';
  sessionPercCanvas.id = 'session-product-percentages';
  sessionPercCanvas.width = '500';
  sessionPercCanvas.height = '300';
  totalRawCanvas.id = 'total-product-data';
  totalRawCanvas.width = '500';
  totalRawCanvas.height = '300';
  totalPercCanvas.id = 'total-product-percentages';
  totalPercCanvas.width = '500';
  totalPercCanvas.height = '300';

  sessionRawDiv.appendChild(sessionRawCanvas);
  sessionPercDiv.appendChild(sessionPercCanvas);
  totalRawDiv.appendChild(totalRawCanvas);
  totalPercDiv.appendChild(totalPercCanvas);

  title.textContent = 'Data';

  session.appendChild(sessionRawDiv);
  session.appendChild(sessionPercDiv);
  total.appendChild(totalRawDiv);
  total.appendChild(totalPercDiv);

  div.appendChild(session);
  div.appendChild(total);

  data.appendChild(title);
  data.appendChild(div);

  const labels = [];
  const sessionLikes = [];
  const sessionViews = [];
  const sessionPercLikes = [];

  const totalLikes = [];
  const totalViews = [];
  const totalPercLikes = [];

  for (let prod of products) {
    labels.push(prod.name.slice(0,1).toUpperCase() + prod.name.slice(1));
    sessionLikes.push(prod.sessionLikes);
    sessionViews.push(prod.sessionViews);
    sessionPercLikes.push(Math.floor((prod.sessionLikes / prod.sessionViews) * 100));
    totalLikes.push(prod.totalLikes);
    totalViews.push(prod.totalViews);
    console.log(prod.totalViews);
    totalPercLikes.push(Math.floor((prod.totalLikes / prod.totalViews) * 100));
  }
  console.log(totalViews);

  const sessionRawData = {
    labels: labels,
    datasets: [{
      label: 'Likes',
      data: sessionLikes,
      backgroundColor: ['rgba(255, 99, 132, 0.2)'],
      borderColor: ['rgb(255, 99, 132)'],
      borderWidth: 1
    },
    {
      label: 'Views',
      data: sessionViews,
      backgroundColor: ['rgba(255, 159, 64, 0.2)'],
      borderColor: ['rgb(255, 159, 64)'],
      borderWidth: 1
    }]
  };

  const sessionRawConfig = {
    type: 'bar',
    data: sessionRawData,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  };

  const sessionPercData = {
    labels: labels,
    datasets: [{
      label: 'Like Percentage',
      data: sessionPercLikes,
      backgroundColor: ['rgba(150, 159, 255, 0.2)'],
      borderColor: ['rgb(255, 159, 64)'],
      borderWidth: 1
    }]
  };

  const sessionPercConfig = {
    type: 'bar',
    data: sessionPercData,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  };

  const totalRawData = {
    labels: labels,
    datasets: [{
      label: 'Total Likes',
      data: totalLikes,
      backgroundColor: ['rgba(255, 99, 132, 0.2)'],
      borderColor: ['rgb(255, 99, 132)'],
      borderWidth: 1
    },
    {
      label: 'Total Views',
      data: totalViews,
      backgroundColor: ['rgba(255, 159, 64, 0.2)'],
      borderColor: ['rgb(255, 159, 64)'],
      borderWidth: 1
    }]
  };

  const totalRawConfig = {
    type: 'bar',
    data: totalRawData,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  };

  const totalPercData = {
    labels: labels,
    datasets: [{
      label: 'Total Like Percentage',
      data: totalPercLikes,
      backgroundColor: ['rgba(150, 159, 255, 0.2)'],
      borderColor: ['rgb(255, 159, 64)'],
      borderWidth: 1
    }]
  };

  const totalPercConfig = {
    type: 'bar',
    data: totalPercData,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  };

  const sessionLikeChart = new Chart(sessionRawCanvas, sessionRawConfig);
  const sessionPercChart = new Chart(sessionPercCanvas, sessionPercConfig);
  const totalLikeChart = new Chart(totalRawCanvas, totalRawConfig);
  const totalPercChart = new Chart(totalPercCanvas, totalPercConfig);
}

