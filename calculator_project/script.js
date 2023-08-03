//reminder for users/beginners: .forEach and addEventListener code are used as there are many buttons,  .addEventListener is for only one button option
//for for loops, for(cost variableName of arrayName) is used, an automatically iterates through all elements (use to find i)

// Get const for buttons: numberButtons is numerical button(excludes delete due to function but includes for design style),  
//operatorButtons is */+- button, curr_outputElement is the current output (what player wants to calculate),
//prev_outputElement is previous output (what player already calculated), resultButton is button for = (used to calculate all)
//AC_Button deletes all, deleteButton deletes on character
const numberButtons = document.querySelectorAll('.button:not(#delete)');
const operatorButtons = document.querySelectorAll('.button-operator');
const curr_outputElement = document.getElementById('current-output');
const prev_outputElement = document.getElementById('previous-output');
const resultButton = document.getElementById('result');
const AC_Button = document.getElementById('clear');
const deleteButton = document.getElementById('delete');

//used to show PEMDAS putting */ in high priority over +-, also shows all operators
const operatorsPriority = [
  ['+', '-'], 
  ['*', '/']
];

//object used to store equations and number
const calcInfo = {
  eqArray: [], //for storing all individual numbers and operators, used to seperate them so they can easily go into evaluate() 
  value: ""    //contains full number (that will later be inserted into eqArray after an operator or result button)
               //done in this form to let player put in as many numbers as desired, (and so full number will take on index)
}; 

//checks if last character was an operator, 
//@returns: true if there is no operator, false if there is a previous operator
function lastIndexOperator(){
  const lengthEq = curr_outputElement.textContent.length; //to check last char (at exact index)

  //searches all index of operatorsPriority to find if there is an operator at last char of output
  for(const operator of operatorsPriority){
    if(operator.includes(curr_outputElement.textContent.charAt(lengthEq-1)))
      return false;
  }
      
  return true;
}

//firstString - first number in string form
//operator of equation
//secondString - second number in string form
//will compare operator to solve answer
//@return: numerical answer
function evaluate(firstString, operator, secondString){
  //parses string to number
  const firstNum = parseFloat(firstString);
  const secondNum = parseFloat(secondString);

  switch(operator)
  {
    case "*": return firstNum * secondNum;
    case "/": return firstNum / secondNum;
    case "+": return firstNum + secondNum;
    case "-": return firstNum - secondNum;
  };

}

//will perform most functions for the OperatorButtons function,
//will add in an operator under specific conditions
function simplifyOperatorButton(button){
  const lengthEq = curr_outputElement.textContent.length; //shows length of char in output

  //if there is no output:
  //if the "-" button is selected: outputs and stores "-", so that the next number becomes negative
  //if other operator is selected:outputs a beginning number and the operator (ex: 0/....)
  //-------------------------------------------------------------------------------------------------------------------------------
  //else if there is no operator before(checks if there is an operator before to stop user from including two or more operators):
  //if calcInfo.value is empty: pushes operator into eqArray and output, NOTE: if not implemented, when the player deletes the secondnumber
  //and the operator it would have pushed value (which is empty) into eqArray causing an error (no need to check if there is a number before)
  if(lengthEq === 0){
    if(button.textContent.includes("-")){
      curr_outputElement.textContent += button.textContent; //output operator
      calcInfo.value = "-"; //will be included with number to make it negative
    }
    else{
      curr_outputElement.textContent = "0" + button.textContent; //outputs number and operator
      calcInfo.eqArray.push("0"); //pushes in number and operator
      calcInfo.eqArray.push(button.textContent); //note: did not include calcInfo.value because it is only used on numbers that are
                                                 //changed by players, also if included it will put in an additional zero when choosing numbers
    }
  }
  else if(lastIndexOperator()){
    if(calcInfo.value.length === 0)
    {
      calcInfo.eqArray.push(button.textContent); //stores operator only
      curr_outputElement.textContent += button.textContent; //outputs operator
    }
    else{
      calcInfo.eqArray.push(calcInfo.value); //stores number and operator
      calcInfo.eqArray.push(button.textContent);
      curr_outputElement.textContent += button.textContent; //outputs number and operator
      calcInfo.value = ""; //deletes number in value to start next number
    }
  }
}

//Functions for buttons:
//__________________________________________________________________ 

// function that operates each time you click numerical button
numberButtons.forEach(function(button) {
  button.addEventListener('click', function() {

    //makes sure that the number doesn't have more than one decimal
    if(calcInfo.value.includes(".") && button.textContent.includes("."))
      return;

    
    calcInfo.value += button.textContent; //adds in numbers
    curr_outputElement.textContent += button.textContent; //outputs numbers to be seen
  });
});


//will add in an operator to the output
operatorButtons.forEach(function(button){
  button.addEventListener('click', function(){
    simplifyOperatorButton(button); //calls on majority of operations
  });
});

//will output result of equation
resultButton.addEventListener('click', function(){

  //checks if output is empty to stop function
  if(curr_outputElement.textContent.length == 0)
    return;
  
  prev_outputElement.textContent = curr_outputElement.textContent + "="; //takes current output (equation and =) and shows it as previous output
  calcInfo.eqArray.push(calcInfo.value); //pushes in previous number (as numbers are pushed in when including an operator or result)

  let index = 0; //gets index of current operGator (used to find equation (number operator number))
  let partialResult = 0; //not full answer, stores in every answer from equation

  //while the array is not at length of 1:
  //will find highest priority operator(PEMDAS), call on evaluate() to get partialResult, and replace equation
  //as one index answer within calcinfo.eqArray
  while(calcInfo.eqArray.length != 1){
    //compares index of operatorsPriority to index of eqArray
    //when it finds highest priority operator, initializes index and stops loop
    for(const priority of operatorsPriority)
    {
      for(let i = 0; i < calcInfo.eqArray.length; i++)
      {
        if(priority.includes(calcInfo.eqArray[i]))
        {
          index = i;
          break;
        }
      }
    }

    //try catch to prevent 0/0, otherwises calls on evaluate() to receive partialResult
    //then splices into eqArray(so it deletes the whole equation and replaces the first instance of the number
    //with the partial number)
    try{
      if(parseFloat(calcInfo.eqArray[index+1]) == 0)
        throw new Error;

      partialResult = evaluate(calcInfo.eqArray[index-1], calcInfo.eqArray[index], calcInfo.eqArray[index+1]);
      calcInfo.eqArray.splice(index-1, 3, partialResult.toString());
    }
    catch(error)
    {
      calcInfo.eqArray.length = 0; //deletes everything in array
      calcInfo.eqArray.push("NaN"); //pushes NaN so it will be caught as a mistake
      break; //stops while loop
    }
    
  }  

  //try catch is used to check if parsefloat has an error (NaN), else outputs ans
  try{
    if(Number.isNaN(parseFloat(calcInfo.eqArray[0])))
      throw new Error();

    calcInfo.value = calcInfo.eqArray[0]; //takes in ans as value, so that players can change/delete value
    curr_outputElement.textContent = calcInfo.eqArray[0]; //shows output as ans
    calcInfo.eqArray.length = 0; //empties eqArray
  }
  catch{
    curr_outputElement.textContent = "ERROR"; //output Error
    calcInfo.eqArray.length = 0; //empties array
    calcInfo.eqArray.push("ERROR"); //adds error in array (so that if player adds in number, it will be an ERROR)
  }
});

//deletes every number and operator in current output, array, value
AC_Button.addEventListener('click', function(){
  curr_outputElement.textContent = "";
  calcInfo.eqArray.length = 0;
  calcInfo.value = "";
});

//deletes on character from current output, array, value
deleteButton.addEventListener('click', function(){
  //if current output is not empty:
  //if there is an ERROR message, deletes ERROR in output and eqArray
  if(curr_outputElement.textContent.length != 0){
    if(curr_outputElement.textContent.includes("ERROR")){
      calcInfo.eqArray.length = 0;
      curr_outputElement.textContent = "";
    }
    else{
      //if the last character was not an operator, calcInfo.value will delete last character (as value only deals with numbers)
      if(lastIndexOperator())
        calcInfo.value = calcInfo.value.slice(0, (calcInfo.value.length-1));

      calcInfo.eqArray.pop(); //deletes last array (as other buttons will add in array)
      curr_outputElement.textContent = curr_outputElement.textContent.slice(0, (curr_outputElement.textContent.length-1)); //deletes last char in output
    }
  }
});






