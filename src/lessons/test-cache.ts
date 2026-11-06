import { myCache } from "./cache";

myCache.set("user1", "Jonh");
myCache.set("user2", "Mary");
myCache.set("user3", "Peter");

const user1 = myCache.get("user1");
console.log(user1);
