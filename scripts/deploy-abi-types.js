const hre = require("hardhat");
const {
  ConfluxSDK,  // The js-conflux-sdk SDK
  conflux,    // The Conflux instance
} = hre;

async function main() {
  const accounts = await conflux.getSigners();

  // We get the contract to deploy
  const AbiTypes = await conflux.getContractFactory("AbiTypes");
  const deployReceipt = await AbiTypes.constructor().sendTransaction({
    from: accounts[0].address,
  }).executed();
  console.log("AbiTypes deployed to:", deployReceipt.contractCreated);

  // Interact with the contract
  // const contractAddress = 'cfxtest:acdsx75ts9a6zz7zmvrd9pr2rp82k6febesbj0kz9y';
  const contractAddress = deployReceipt.contractCreated;
  
  // We got a js-conflux-sdk contract instance
  const abiTypes = await conflux.getContractAt('AbiTypes', contractAddress);

  // Invoke contract write contract, passing a dynamic array of uint256
  await abiTypes.setIds([1, 2]).sendTransaction({
    from: accounts[0].address,
  }).executed();

  const ids = await abiTypes.getIds();
  console.log(ids);

  // Passing struct as tuples
  await abiTypes.setUser(['hi', 2]).sendTransaction({
    from: accounts[0].address,
  }).executed();
  
  // Or direct use of object
  await abiTypes.setUser({name: 'Lili', balance: 100}).sendTransaction({
    from: accounts[0].address,
  }).executed();
  
  const user = await abiTypes.getUser(accounts[0].address);
  console.log(user);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
