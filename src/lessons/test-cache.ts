import { myCache } from "./cache";

myCache.set("user1", "Jonh");
myCache.set("user2", "Mary");
myCache.set("user3", "Peter");

const user1 = myCache.get("user1");

myCache.set("user4", "Sara");

console.log("user 2 still cache:", myCache.has("user2"));
console.log("user 1 still cache:", myCache.has("user1"));
console.log("user 3 still cache:", myCache.has("user3"));
console.log("user 4 still cache:", myCache.has("user4"));
