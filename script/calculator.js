const display = document.querySelector('.calculator-screen');
const keys = document.querySelector('.buttons');
const smallFullDisplay= document.querySelector('.small-full-display')

const calculator = {
  displayValue: '0',
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
};

const keepStatus = {
  signInput : null,
  percentInput : null
}

function resetCalculator() {
  calculator.displayValue = '0';
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  calculator.operator = null;
  console.log(calculator);
}

function resetFullDisplay()
{
  smallFullDisplay.value = '';
}

function updateSmallFullDisplay()
{
  let firstOperand = 0;
  if(calculator.firstOperand)
  {
    firstOperand =  `${parseFloat(calculator.firstOperand.toFixed(5))}`;
  }
   
  if(calculator.firstOperand === null || calculator.operator === null)
  {
    smallFullDisplay.value = calculator.displayValue;
  }else
  {
    if(!calculator.waitingForSecondOperand)
    {
      if(keepStatus.signInput || keepStatus.percentInput)
        {
          if(calculator.operator != '=')
          {
            smallFullDisplay.value = firstOperand + calculator.operator + calculator.displayValue;
          }else{
            smallFullDisplay.value = calculator.displayValue;
          }
        }else{
          if(calculator.operator != '=')
          {
            smallFullDisplay.value = firstOperand + calculator.operator + calculator.displayValue;
          }else if(!calculator.waitingForSecondOperand)
          {
            smallFullDisplay.value = calculator.displayValue; // handled dot input
          }
        }
    }else{
      if(calculator.operator === '=')
      {
        if(keepStatus.signInput || keepStatus.percentInput)
        {
          smallFullDisplay.value = calculator.displayValue;
        }else{
          if(smallFullDisplay.value === '')
          {
            smallFullDisplay.value = ''; 
          }else{
            if(!smallFullDisplay.value.includes('='))
            {
             smallFullDisplay.value = smallFullDisplay.value + '=' + firstOperand;
            }
          }
        }
      }else{
        if(keepStatus.signInput)
        {
          smallFullDisplay.value = firstOperand + calculator.operator + '(' + calculator.displayValue + ')';
        }else{
          smallFullDisplay.value = firstOperand + calculator.operator;
        }
      }
      
    }
    
  }
  
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
  if(num2 === 0) {
    calculator.displayValue ='Can\'t divide by 0';
    calculator.waitingForSecondOperand = false;
    updateDisplay();
    resetCalculator();
    resetFullDisplay();
  }
  
 else return num1 / num2;
}

function inputPercent() {
  	calculator.displayValue = (calculator.displayValue/100);
    calculator.waitingForSecondOperand = false;
    return;
}


function inputSign() {
  calculator.displayValue = parseFloat(calculator.displayValue * -1);
  if(calculator.waitingForSecondOperand)
  {
    if(calculator.firstOperand === null)
    {
      calculator.firstOperand = calculator.displayValue;
    }else{
      calculator.firstOperand = parseFloat(calculator.firstOperand * -1);
    }
  }
  calculator.waitingForSecondOperand = true;
  console.log(calculator);
  return;
}

function inputDelete() {
  calculator.displayValue = calculator.displayValue.toString().slice(0, -1);
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

  
  if (operator && calculator.waitingForSecondOperand && nextOperator != '=')  {
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

  switch(operator){
    case "+" :
      result = addNumbers(firstOperand, secondOperand);
      break;
    case "-":
      result = substractNumbers(firstOperand, secondOperand);
      break;
    case "*":
        result = multiplyNumbers(firstOperand, secondOperand);
      break;
    case "/":
      result = divideNumbers(firstOperand, secondOperand);
      break;
      default:
        result = secondOperand;
  }
  return result;
}
// function operate(firstOperand, secondOperand, operator) {
//   let result;
//   if (operator === '+') {
//     result = addNumbers(firstOperand, secondOperand);
//   } else if (operator === '-') {
//     result = substractNumbers(firstOperand, secondOperand);
//   } else if (operator === '*') {
//     result = multiplyNumbers(firstOperand, secondOperand);
//   } else if (operator === '/') {
//     result = divideNumbers(firstOperand, secondOperand);
//   }
//   else{
//     result = secondOperand;
//   }

//   return result;
// }

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
    updateSmallFullDisplay();
    return;
  }

  if (target.classList.contains('decimal')) {
    inputDecimal(target.value);
    return;
  }

  if (target.classList.contains('percent')) {
    keepStatus.percentInput = true;
    inputPercent(target.value);
    updateSmallFullDisplay();
    updateDisplay();
    keepStatus.percentInput = null;
    return;
  }

  if (target.classList.contains('sign')) {
    keepStatus.signInput = true;
    inputSign();
    updateDisplay();
    updateSmallFullDisplay();
    keepStatus.signInput = null;
    return;
  }

  if (target.classList.contains('delete')) {
    inputDelete(); 
    updateSmallFullDisplay();
    updateDisplay();
    return;
  }

  if (target.classList.contains('clear')) {
    resetCalculator();
    resetFullDisplay();
    updateDisplay();
    return;
  }
  inputDigit(target.value);
  updateDisplay();
  updateSmallFullDisplay();
});

