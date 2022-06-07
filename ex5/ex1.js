var name = "Will";
var age = 4;
var favorite_color = "Yellow";
var sum = add(1, multiply(2, subtract(4, 3)));
print("This sum is ", sum)
function print(...args){
  console.log(...args);
}

function add(x, y){
  return x + y;
}

function multiply(x, y){
  return x * y;
}

function subtract(x, y){
  return x - y;
}

function divide(x, y){
  return x / y;
}