const display = document.querySelector('.calculator-screen');
const keys = document.querySelector('.buttons');
const smallFullDisplay = document.querySelector('.small-full-display');

const calculator = {
  displayValue: '0',
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
};

const keepStatus = {
  signInput: null,
  percentInput: null,
  deleteInput : null
}

/**
 * Resets all the values of calculator Obj to original.
 * 
 */
function resetCalculator() {
  calculator.displayValue = '0';
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  calculator.operator = null;
  console.log(calculator);
}

function resetFullDisplay() {
  smallFullDisplay.value = '';
}


/**
 *  Updates small display by showing the ongoing equation.
 * 
 */
function updateSmallFullDisplay() {
  let firstOperand = 0;
  if (calculator.firstOperand) {
    firstOperand = `${parseFloat(calculator.firstOperand.toFixed(5))}`;
  }

  if (calculator.firstOperand === null || calculator.operator === null) {
    smallFullDisplay.value = calculator.displayValue;
  } else {
    if (!calculator.waitingForSecondOperand) {
      if (keepStatus.signInput || keepStatus.percentInput) {
        if (calculator.operator != '=') {
          smallFullDisplay.value = firstOperand + calculator.operator + calculator.displayValue;
        } else {
          smallFullDisplay.value = calculator.displayValue;
        }
      } else {
        if (calculator.operator != '=') {
          smallFullDisplay.value = firstOperand + calculator.operator + calculator.displayValue;
        } else if (!calculator.waitingForSecondOperand) {
          smallFullDisplay.value = calculator.displayValue; // handled dot input
        }
      }
    } else {
      if (calculator.operator === '=') {
        if (keepStatus.signInput || keepStatus.percentInput) {
          smallFullDisplay.value = calculator.displayValue;
        } else {
          if (smallFullDisplay.value === '') {
            smallFullDisplay.value = '';
          } else {
            if(keepStatus.deleteInput) { // Handled backspace input from calculator
              smallFullDisplay.value = ''; 
              smallFullDisplay.value = calculator.displayValue;    
            }else if(!smallFullDisplay.value.includes('=')){
             smallFullDisplay.value = smallFullDisplay.value + '=' + firstOperand;
            }
          }
        }
      } else {
        if (keepStatus.signInput) {
          smallFullDisplay.value = firstOperand + calculator.operator + '(' + calculator.displayValue + ')';
        } else {
          smallFullDisplay.value = firstOperand + calculator.operator;
        }
      }

    }

  }

}

//  Adds two numbers
function addNumbers(num1, num2) {
  return num1 + num2;
}

//  Subtracts two numbers
function substractNumbers(num1, num2) {
  return num1 - num2;
}

//  Multiplies two numbers
function multiplyNumbers(num1, num2) {
  return num1 * num2;
}

//  Divides two numbers
function divideNumbers(num1, num2) {
  if (num2 === 0) {
    calculator.displayValue = 'Can\'t divide by 0';
    calculator.waitingForSecondOperand = false;
    updateDisplay();
    resetCalculator();
    resetFullDisplay();
  }
  else return num1 / num2;
}

//  Calculates the percentage of a number
function inputPercent() {
  calculator.displayValue = (calculator.displayValue / 100);
  calculator.waitingForSecondOperand = false;
  return;
}

//  Changes the sign of the number i.e Positive to negative or negative to positive
function inputSign() {
  calculator.displayValue = parseFloat(calculator.displayValue * -1);
  if (calculator.waitingForSecondOperand) {
    if (calculator.firstOperand === null) {
      calculator.firstOperand = calculator.displayValue;
    } else {
      calculator.firstOperand = parseFloat(calculator.firstOperand * -1);
    }
  }
  calculator.waitingForSecondOperand = true;
  console.log(calculator);
  return;
}

//  Backspace functions: Deletes the last digit from display
function inputDelete() {
  calculator.displayValue = calculator.displayValue.toString().slice(0, -1);
  calculator.firstOperand = +calculator.displayValue;
  return;
}

//  Adds the Decimal to the number
function inputDecimal(dot) {
  if (calculator.waitingForSecondOperand === true) {
    calculator.displayValue = '0.'
    calculator.waitingForSecondOperand = false;
    return;
  }

  // If the `displayValue` property does not contain a decimal point
  if (!calculator.displayValue.includes(dot)) {
    // Append the decimal point
    calculator.displayValue += dot;
  }
  console.log(calculator);
}


/**
 * This function appends the value to display
 * 
 * @returns {string} added to the display
 */
function inputDigit(digit) {

  const displayValue = calculator.displayValue;
  const waitingForSecondOperand = calculator.waitingForSecondOperand;

  if (waitingForSecondOperand === true) {
    calculator.displayValue = digit;
    calculator.waitingForSecondOperand = false;
  } else {
    // Overwrite `displayValue` if the current value is '0' otherwise append to it
    calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
  }
  console.log(calculator);
}


/**
 * 
 * @param {string} nextOperator 
 * @returns Updates the calculator object with firstOperand, secondOperand and Operator values
 */
function handleOperator(nextOperator) {
  // Destructure the properties on the calculator object
  //const { firstOperand, displayValue, operator } = calculator
  const firstOperand = calculator.firstOperand;
  const displayValue = calculator.displayValue;
  const operator = calculator.operator;

  // `parseFloat` converts the string contents of `displayValue`
  // to a floating-point number
  const inputValue = parseFloat(displayValue);

  // verify that `firstOperand` is null and that the `inputValue`
  // is not a `NaN` value and `nextOperator` is not '='.
  if (operator && calculator.waitingForSecondOperand && nextOperator != '=') {
    // Update the firstOperand property
    calculator.operator = nextOperator;
    return;
  }

  if (firstOperand == null && !isNaN(inputValue)) {
    calculator.firstOperand = inputValue;
  } else if (operator) {
    const result = operate(firstOperand, inputValue, operator);

    calculator.displayValue = `${parseFloat(result.toFixed(5))}`;
    calculator.firstOperand = result;
  }

  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;
  console.log(calculator);
}

/**
 * This function performs the Arithmetic operations and outputs the result
 * 
 * @param {string} firstOperand 
 * @param {string} secondOperand 
 * @param {string} operator 
 * @returns {string} result  
 */
function operate(firstOperand, secondOperand, operator) {
  let result;

  switch (operator) {
    case "+":
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


function updateDisplay() {
  // update the value of the element with the contents of `displayValue`
  display.value = calculator.displayValue;
}
updateDisplay();

/**
 * 
 *  Triggers an event on button click and 
 *  filters down to the type of the button clicked followed by its function call
 */
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
    updateSmallFullDisplay();
    updateDisplay();
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
    keepStatus.deleteInput = true;
    inputDelete(); 
    updateSmallFullDisplay();
    updateDisplay();
    keepStatus.deleteInput = null;
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

/**
 *  Handles Keyboard support for numbers and Operators
 */
window.addEventListener('keydown', (event) => {
  //console.log(event);

  const opeartors = ["+", "-", "*", "/"];
  const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  const keyTarget = event.key;

  if (opeartors.includes(keyTarget)) {
    handleOperator(keyTarget);
    updateSmallFullDisplay();
    updateDisplay();
    return;
  }
  if (numbers.includes(keyTarget)) {
    inputDigit(keyTarget);
    updateSmallFullDisplay();
    updateDisplay();
    return;
  }
  if (keyTarget === "=") {
    handleOperator(keyTarget);
    updateSmallFullDisplay();
    updateDisplay();
    return;
  }
  if (keyTarget === ".") {
    inputDecimal(keyTarget);
    updateSmallFullDisplay();
    updateDisplay();
    return;
  }
  if (keyTarget === "Backspace") {
    keepStatus.deleteInput = true;
    inputDelete(); 
    updateSmallFullDisplay();
    updateDisplay();
    keepStatus.deleteInput = null;
    return;
  }
  if (keyTarget === "Delete") {
    resetCalculator();
    resetFullDisplay();
    updateSmallFullDisplay();
    updateDisplay();
    return;
  }
  if (keyTarget === "%") {
    keepStatus.percentInput = true;
    inputPercent(keyTarget);
    updateSmallFullDisplay();
    updateDisplay();
    keepStatus.percentInput = null;
    return;
  }

});


