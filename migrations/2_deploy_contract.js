const Degree = artifacts.require("Degree");

module.exports = function(deployer) {
    deployer.deploy(Degree);
};