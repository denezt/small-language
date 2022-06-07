let f = () => {return 1};
let g = (a, b) => {return add(multiply(2, a), b)};
let h = (x, y) => {return g(x, y)};
let result = h(3, 4);
print("result = ", result)
print("f = ", f())
print("g(f f) = ", g(f(), f()))
/*
* Runtime Functions
*/

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

function sqrt(x){
    return Math.sqrt(x);
}

function pow(x, y){
    return Math.pow(x, y);
}