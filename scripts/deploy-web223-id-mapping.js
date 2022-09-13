const hre = require("hardhat");
const {
  ConfluxSDK,  // The js-conflux-sdk SDK
  conflux,    // The Conflux instance
} = hre;

async function main() {
  const accounts = await conflux.getSigners();

  // We get the contract to deploy
  const Web223IdMapping = await conflux.getContractFactory("Web223IdMapping");
  const deployReceipt = await Web223IdMapping.constructor().sendTransaction({
    from: accounts[0].address,
  }).executed();
  console.log("Web223IdMapping deployed to:", deployReceipt.contractCreated);

  // // Interact with the contract
  // // const contractAddress = 'cfxtest:acdsx75ts9a6zz7zmvrd9pr2rp82k6febesbj0kz9y';
  // const contractAddress = deployReceipt.contractCreated;
  
  // // We got a js-conflux-sdk contract instance
  // const web223IdMapping = await conflux.getContractAt('Web223IdMapping', contractAddress);

  // // Invoke contract write contract, passing a dynamic array of uint256
  // await web223IdMapping.setIds([1, 2]).sendTransaction({
  //   from: accounts[0].address,
  // }).executed();

  // const ids = await web223IdMapping.getIds();
  // console.log(ids);

  // // Passing struct as tuples
  // await web223IdMapping.setUser(['hi', 2]).sendTransaction({
  //   from: accounts[0].address,
  // }).executed();
  
  // // Or direct use of object
  // await web223IdMapping.setUser({name: 'Lili', balance: 100}).sendTransaction({
  //   from: accounts[0].address,
  // }).executed();
  
  // const user = await web223IdMapping.getUser(accounts[0].address);
  // console.log(user);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
