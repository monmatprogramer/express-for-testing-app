// @ts-check
import { module } from "@prisma/composer";
import expressForTestingAppService from "./service.mjs";

export default module("express-for-testing-app", ({ provision }) => {
  provision(expressForTestingAppService, { id: "expressfortestingapp" });
});
