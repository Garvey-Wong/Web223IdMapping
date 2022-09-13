const hre = require("hardhat");
const {
  ConfluxSDK,  // The js-conflux-sdk SDK
  conflux,    // The Conflux instance
} = hre;

async function main() {
  const accounts = await conflux.getSigners();

  const epochNumber = await conflux.cfx.epochNumber();
  console.log('Current epochNumber: ', epochNumber);

  const balance = await conflux.cfx.getBalance(accounts[0].address);
  console.log(`Balance of ${accounts[0].address} :`, ConfluxSDK.Drip(balance).toCFX());

  // We get the contract to deploy
  /* const Greeter = await conflux.getContractFactory("Greeter");
  
  const deployReceipt = await Greeter.constructor("Hello, Hardhat!").sendTransaction({
    from: accounts[0].address,
  }).executed();

  console.log("Greeter deployed to:", deployReceipt.contractCreated); */

  // Interact with the contract
  const contractAddress = 'cfxtest:acdes0ybnwh7uu0w8szcvpx01ehaswc6py7vm4f1yk';
  // We got a js-conflux-sdk contract instance
  const greeter = await conflux.getContractAt('Greeter', contractAddress);
  const greeting = await greeter.greet();
  console.log(greeting);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
