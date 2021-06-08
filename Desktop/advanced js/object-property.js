const students = [ 
    
    { id:78, name: "rahim" },
    { id: 89, name: "rakim" },
    { id: 90, name: "yamin" },
    { id: 67, name: "ahan" }

]; 

const names = students.map( s => s.name );
const id = students.map( s => s.id );
const filterBigger = students.filter( s => s.id < 80 );
const findBigger = students.find( s => s.id > 80 )

console.log(findBigger);