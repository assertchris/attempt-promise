const assert = require("assert");
const attempt = require("./index");


(async function() {

  const makeOk = () => new Promise(function(resolve, _) {
    setTimeout(function() {
      resolve("ok");
    });
  });

  const makeError = () => new Promise(function(_, reject) {
    setTimeout(function() {
      reject("error");
    });
  });

  const [error1, result1] = await attempt(makeOk());

  assert(typeof error1 === "undefined");
  assert(result1 === "ok");

  const [error2, result2] = await attempt(makeError());

  assert(error2 === "error");
  assert(typeof result2 === "undefined");

  const [error3, result3] = await attempt.all([
    makeOk(),
    makeOk()
  ]);
  assert(typeof error3 === "undefined");
  result3.forEach(result => assert(result === "ok"));

  const [error4, result4] = await attempt.all([
    makeError(),
    makeError()
  ]);
  error4.forEach(result => assert(result === "error"));
  result4.forEach(result => assert(result === undefined));

  console.log("everything looks ok!");
})();
