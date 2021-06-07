const numbers = [5,5,6,2,4,9];

const output = [];

for(let i = 0; i < numbers.length; i++){
    const element = numbers [i];
    const result = element*element;
    output.push(result);
}

function square (element){
    return  element*element; 
}

const result = numbers.map(function(element){
    return element*element;
})

const squre = element => element*element; 
const squre = x => x * x ;

const result  = numbers.map( x => x*x); 

const result = numbers.filter(x => x>8);

const isThere = numbers.find( x => x < 8);




console.log();