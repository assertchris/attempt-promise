const assert = require("assert");
const attempt = require("./index");

(async function() {
  const ok = new Promise(function(resolve, _) {
    setTimeout(function() {
      resolve("ok");
    });
  });

  const error = new Promise(function(_, reject) {
    setTimeout(function() {
      reject("error");
    });
  });

  const [error1, result1] = await attempt(ok);

  assert(typeof error1 === "undefined");
  assert(result1 === "ok");

  const [error2, result2] = await attempt(error);

  assert(error2 === "error");
  assert(typeof result2 === "undefined");

  console.log("everything looks ok!");
})();
