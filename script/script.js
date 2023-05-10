const display = document.querySelector('.calculator-screen');
const keys = document.querySelector('.buttons');

const calculator = {
  displayValue: '0',
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
};

function resetCalculator() {
  calculator.displayValue = '0';
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  calculator.operator = null;
  console.log(calculator);
}

function addNumbers(num1, num2){
  return num1 + num2;
}

function substractNumbers(num1, num2){
  return num1 - num2;
}

function multiplyNumbers(num1, num2)
{
  return num1*num2;
}

function divideNumbers(num1, num2)
{
  if(num2 == 0) {
    calculator.displayValue="Error";
    calculator.waitingForSecondOperand = false;
    updateDisplay();
  }
  
 else  return num1 / num2;
}

function inputPercent() {
  	calculator.displayValue = (calculator.displayValue/100);
    calculator.waitingForSecondOperand = false;
    return;
}


function inputSign() {
  calculator.displayValue = (calculator.displayValue * -1);
  calculator.firstOperand = calculator.displayValue;
  calculator.waitingForSecondOperand = true;
  return;
}

function inputDecimal(dot) {
  if (calculator.waitingForSecondOperand === true) {
  	calculator.displayValue = '0.'
    calculator.waitingForSecondOperand = false;
    return
  }

  // If the `displayValue` property does not contain a decimal point
  if (!calculator.displayValue.includes(dot)) {
    // Append the decimal point
    calculator.displayValue += dot;
  }
  console.log(calculator);
}


function inputDigit(digit){
 // const displayValue = caculator.displayValue;
 const displayValue = calculator.displayValue;
 const waitingForSecondOperand =calculator.waitingForSecondOperand;

 if(waitingForSecondOperand === true){
  calculator.displayValue = digit;
  calculator.waitingForSecondOperand = false;
  }else{
  calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
  }
  console.log(calculator);
}


function handleOperator(nextOperator) {
  //const { firstOperand, displayValue, operator } = calculator
  const firstOperand = calculator.firstOperand;
  const displayValue = calculator.displayValue;
  const operator = calculator.operator;

  const inputValue = parseFloat(displayValue);

  
  if (operator && calculator.waitingForSecondOperand)  {
    calculator.operator = nextOperator;
    return;
  }

  if(firstOperand == null && !isNaN(inputValue)){
    calculator.firstOperand = inputValue;
  }  else if (operator) {
    const result = operate(firstOperand, inputValue, operator);

    calculator.displayValue = `${parseFloat(result.toFixed(5))}`;
    calculator.firstOperand = result;
  }

  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;
  console.log(calculator);
}


function operate(firstOperand, secondOperand, operator) {
  let result;
  if (operator === '+') {
    result = addNumbers(firstOperand, secondOperand);
  } else if (operator === '-') {
    result = substractNumbers(firstOperand, secondOperand);
  } else if (operator === '*') {
    result = multiplyNumbers(firstOperand, secondOperand);
  } else if (operator === '/') {
    result = divideNumbers(firstOperand, secondOperand);
  }
  else{
    result = secondOperand;
  }

  return result;
}

function updateDisplay() {
  // update the value of the element with the contents of `displayValue`
  display.value = calculator.displayValue;
}
updateDisplay();

keys.addEventListener('click', (event) => {
  // Access the clicked element
  const target = event.target;

  // Check if the clicked element is a button.
  // If not, exit from the function
  if (!target.matches('button')) {
    return;
  }

  if (target.classList.contains('operator')) {
    handleOperator(target.value);
    updateDisplay();
    return;
  }

  if (target.classList.contains('decimal')) {
    inputDecimal(target.value);
    return;
  }

  if (target.classList.contains('percent')) {
    inputPercent(target.value);
    updateDisplay();
    return;
  }

  if (target.classList.contains('sign')) {
    inputSign();
    updateDisplay();
    return;
  }

  if (target.classList.contains('clear')) {
    resetCalculator();
    updateDisplay();
    return;
  }
  inputDigit(target.value);
  updateDisplay();
});

