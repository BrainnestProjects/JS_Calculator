const display = document.querySelector('.calculator-screen');
const keys = document.querySelector('.buttons');

const calculator = {
  displayValue: '0',
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
};

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

function inputDecimal(dot) {
  // If the `displayValue` property does not contain a decimal point
  if (!calculator.displayValue.includes(dot)) {
    // Append the decimal point
    calculator.displayValue += dot;
  }
  console.log(calculator);
}

function handleOperator(nextOperator){
  //const { firstOperand, displayValue, operator } = calculator
  const firstOperand = calculator.firstOperand;
  const displayValue = calculator.displayValue;
  const operator = calculator.operator;

  const inputValue = parseFloat(displayValue);

  if(firstOperand === null && !isNaN(inputValue)){
    calculator.firstOperand = inputValue;
  }  

  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;
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
    return;
  }

  if (target.classList.contains('decimal')) {
    inputDecimal(target.value);
    return;
  }

  if (target.classList.contains('all-clear')) {
    console.log('clear', target.value);
    return;
  }
  inputDigit(target.value);
  updateDisplay();
});

