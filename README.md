# web223-id-mapping

Identity mapping from web2 to web3  

Developed by Garvey, Niubee Group.

A demo for [北斗计划](https://edu.tree-graph.org.cn/)

A demo bases on Conflux, Fluent Wallet, react, antd, js-conflux-sdk, hardhat-conflux.

## Usage
An dapp that assists organizations and individuals to complete identity mapping from web2 to web3.

## Dependencies
- git
- nodejs (This project is developed with node v16.16.0, npm 8.11.0. Strongly recommend installing [nvm](https://github.com/nvm-sh/nvm) for better version controlling of nodejs.)
- chrome
- chrome plugin: Fluent Wallet [Seeing Fluent Wallet Website](https://fluentwallet.com/)


## Getting started

clone this project
```bash
git clone https://github.com/Garvey-Wong/Web223IdMapping.git
```

change directory
```bash
cd web223-id-mapping
```

install dependencies
```bash
npm install
```

start server
```bash
npm run start
```

config Fluent Wallet
- Create your account in Fluent Wallet
- Switch to Conflux Testnet
- Faucet from [faucet.confluxnetwork.org](https://faucet.confluxnetwork.org/)




## Deploy your own smart contract

This project presets a default smart contract address (@see /src/lib/ContractWeb223IdMapping.js).

You can deploy a new smart contract with empty data storage by your own for your testing. Follow these step: 

1. Create .env file in project directory. Structure like:  
web223-id-mapping (project directory)  
|- .env

2. Write your private key in .env file    
   `TESTNET_PRIVATE_KEY=${PrivateKey}`  
    Find your private key in your Fluent Wallet then replace ${PrivateKey}. That would be like `TESTNET_PRIVATE_KEY=5f35c67583dc866d7b3ffdaxxxxxxxxxxxxxxxxxxxxxxxxx`  
    This account will be used to deploy smart contract. Make sure it gets enough CFX. (You can faucet CFX in [faucet.confluxnetwork.org](https://faucet.confluxnetwork.org/))

3. Run script in project directory.
   ```bash
   npx hardhat run scripts/deploy-web223-id-mapping.js --network testnet
   ```
   You could get the contract address in your console.  
   `Web223IdMapping deployed to: {an address start with 'cfxtest'}`

4. Copy this address and paste it into const valuable CONTRACR_ADDRESS in /src/lib/ContractWeb223IdMapping.js 
5. Restart node server


## Modify smart contract
If you want to modify smart contract, follow these steps:  

1. Modify conctract in <Project_Dir>/contracts/Web223IdMapping.sol

2. As building and deploying your contract above. Run  
    ```bash
    npx hardhat run scripts/deploy-web223-id-mapping.js --network testnet
    ```
3. Paste address into const valuable CONTRACR_ADDRESS in /src/lib/ContractWeb223IdMapping.js 

4. Replace ABI file (important)
   - Find <Project_Dir>/artifacts/Web223IdMapping.sol/Web223IdMapping.json. 
   - Open it in text editor. 
   - Find json key 'abi'. The value is an array.
   - Copy this long long long array. (Don't miss brackets [])
   - Paste it into <Project_Dir>/src/lib/abi/Web223IdMapping.json

5. Modify codes in <Project_Dir>/src/lib/ContractWeb223IdMapping.js and your Components.

6. Restart node server