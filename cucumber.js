module.exports = {
  default: {
    require: [
      "steps/**/*.ts",
      "steps/*.ts",
      "support/**/*.ts"
    ],
    requireModule: ["ts-node/register"],
    format: ["progress"],
    publishQuiet: true
  }
};
