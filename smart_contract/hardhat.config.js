require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/JwltzxkTQIIVLa4n7U2nvIJt82nc3LP1",
      accounts: [
        "147fecb14574291d3985ac9e5aa80f2f47c99bfaec38f388ca6524a1c600555d",
      ],
    },
  },
};
