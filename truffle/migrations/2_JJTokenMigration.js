const JJToken = artifacts.require("JJToken");

module.exports = function(deployer) {
  deployer.deploy(JJToken,"LobsterToken","LT");
};
