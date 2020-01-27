const elGo = document.querySelector('#go');
const elContainer = document.querySelector('#gameContainer');
const elScored = document.querySelector('.scored');
const elGoBack = document.querySelector('#goBack');
let elAllCells;
let cellsHTML = '';
let clicked = [];
let timeout = [];
let hasAnyLeft = 0;
const icons = new Array(
  'glass',
  'music',
  'search',
  'envelope-o',
  'heart',
  'star',
  'star-o',
  'user',
  'film',
  'th-large',
  'check',
  'times',
  'search-plus',
  'signal',
  'cog',
  'road',
  'home',
  'repeat',
  'inbox',
);
let gridArray = [];
let usedIndexesArray = [];
elGo.onclick = function () {
  const elLevel = document.querySelector('#level').options.selectedIndex;
  switch (elLevel) {
    default:
      elContainer.className = 'flex wrap';
      elContainer.classList.add('beginner');
      elContainer.innerHTML = fillContainer(3);
      break;
    case 1:
      elContainer.className = 'flex wrap';
      elContainer.classList.add('intermediate');
      elContainer.innerHTML = fillContainer(6);
      break;
    case 2:
      elContainer.className = 'flex wrap';
      elContainer.classList.add('professional');
      elContainer.innerHTML = fillContainer(12);
      break;
  }
  elAllCells = document.querySelectorAll('.overlay');
  for (let i = 0; i < elAllCells.length; i++) {
    elAllCells[i].onclick = function () {
      if (clicked.length < 2) {
        elAllCells[i].style.display = 'none';
        if (clicked.includes(elAllCells[i].attributes.placeholder.value)) {
          usedIndexesArray.splice(usedIndexesArray.indexOf(elAllCells[i].attributes.placeholder.value),1);
          timeout.forEach(function (e) {
            clearTimeout(e);
          });
          clicked = [];
          checkIfDone();
        } else {
          clicked.push(elAllCells[i].attributes.placeholder.value);
          timeout[i] = setTimeout(function () {
            elAllCells[i].style.display = 'flex';
            clicked = [];
          }, 1000);
        }
      }
    }
  }
}

function fillContainer(n) {
  cellsHTML = '';
  gridArray = [];
  usedIndexesArray = [];
  for (let i = 0; i < n; i++) {
    let iconIndex = Math.floor(Math.random() * icons.length);
    while (usedIndexesArray.includes(iconIndex)) {
      iconIndex = Math.floor(Math.random() * icons.length);
    }
    usedIndexesArray.push(iconIndex);
    gridArray.push('<div><i class="fa fa-' + icons[iconIndex] + '"></i><div class="overlay" placeholder="fa-' + icons[iconIndex] + '"></div></div>');
    gridArray.push('<div><i class="fa fa-' + icons[iconIndex] + '"></i><div class="overlay" placeholder="fa-' + icons[iconIndex] + '"></div></div>');
  }
  let divsIndexesArray = [];
  for (let i = 0; i < (n * 2); i++) {
    let arrayIndex = Math.floor(Math.random() * (n * 2));
    while (divsIndexesArray.includes(arrayIndex)) {
      arrayIndex = Math.floor(Math.random() * (n * 2));
    }
    divsIndexesArray.push(arrayIndex);
    cellsHTML += gridArray[arrayIndex];
  }
  return cellsHTML;
}

function checkIfDone() {
if (usedIndexesArray.length == 0){
  elScored.style.opacity = '1';
  elScored.style.zIndex = '2';
}
}
elGoBack.onclick = function() {
  elContainer.innerHTML = '';
  elScored.style.opacity = '0';
  elScored.style.zIndex = '-1';
}
