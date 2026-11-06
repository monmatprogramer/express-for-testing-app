import { correlationFormat } from "./logger";

const r = correlationFormat({
  trackId: "trackid sample",
  clientTrackId: "Client track id",
});

console.log("result: ", r);
