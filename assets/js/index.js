let sumElem = document.querySelector('#sum');
let btn = document.querySelector('#btn');
let pzkElem = document.querySelector('#pzk');
let maxSumElem = document.querySelector('#maxSum');
let currInput = document.querySelector('#currency');
let rateSourceSelect = document.querySelector('.rateSourceSelect');
let rateSourceLabel = document.querySelector('.rateSourceLabel');

const startDate = new Date(2020, 10, 6);
const currentDate = new Date();

let today = `${currentDate.getFullYear()}${fixMonthDisplay(currentDate.getMonth() + 1)}${currentDate.getDate()}`;

let maxCost = 0;
const K1 = 27.6798;
const VP1 = 4900;

function nbuRate() {
  let api = `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchangenew?json&valcode=USD&date=${today}`;
  fetch(api)
    .then(function (response) {
      let data = response.json();
      return data;
    })
    .then(function (data) {
      const {rate, exchangedate, cc} = data[0];
      currInput.value = rate;
      calculateCost();

    })
}

function calculateCost() {
  let CostPerMonth;
  let K2 = currInput.value;

  let month = document.querySelector('#month').value;
  if (K2 == '') {
    alert('Введи текущий курс доллара от НБУ');
  } else {
    sumElem.textContent = '';
    maxCost = 0;

    let PZK = ((K2 - K1) / K1) * 100;
    pzkElem.innerText = PZK.toFixed(2);

    for (let maxMonths = 6; month <= maxMonths; month++) {
      if ((PZK > 10 || PZK < -10) && month != 1) {
        CostPerMonth = (VP1 / K1) * K2;
      } else {
        CostPerMonth = 4900;
      }
      maxCost += CostPerMonth;
    }
    maxSumElem.textContent = Math.round(maxCost);
    sumElem.textContent = Math.round(CostPerMonth);
  }
}

function switchRateInputReadonly() {
  let value = this.value;

  if (value === 'nbu') {
    nbuRate();
    currInput.setAttribute('readonly', true);
  } else if (value === 'custom') {
    currInput.removeAttribute('readonly');
  }
}

function fixMonthDisplay(month) {
  return month >= 10 ?  month : `0${month}`;
}

btn.addEventListener('click', calculateCost);
rateSourceSelect.addEventListener('change', switchRateInputReadonly);
nbuRate();
