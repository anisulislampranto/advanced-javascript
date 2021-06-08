function stopWatch (){
    let count = 0; 
    return function(){
        count ++;
        return count;
    }
}

const clock = stopWatch();
console.log(clock());
console.log(clock());
console.log(clock());
console.log(clock());
console.log(clock());
console.log(clock());

const clock3 = stopWatch();
console.log(clock3());
console.log(clock3());
console.log(clock3());
console.log(clock3());
console.log(clock3());

console.log(clock());


