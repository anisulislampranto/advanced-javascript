const nums = [81,92,73,04,65,36,27,48];
const part = nums.slice(2, 6);

const removed = nums.splice(2,4, 23, 34, 56,78,);

console.log(removed);
console.log(nums);


const together = nums.join(" gap ");

console.log(together);


