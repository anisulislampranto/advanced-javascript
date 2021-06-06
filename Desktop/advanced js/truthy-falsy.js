// falsy 
// 0, null, undefined, NaN, "",  -0, 0n, false 
// truthy 
// '0', "0", {}, [], "false"


const name = 13; 

if(name || name == 0){
    console.log("condition is true")}
else {
    console.log("condition is false")
}
