
const fs = require('fs');
require('colors');
const { ethers } = require("ethers");
const hre = require("hardhat");



async function main() {

	// npx hardhat verify --network bsc 0x144960C94c846D30C3b4f373C348ed5f13C1f42a "0x56083560594e314b5cdd1680ec6a493bb851bbd8" "0x7e214F5f19ef8f3FEC429D6f4cdd205A6681F413"
	// npx hardhat verify --network networkname DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1" "Constructor argument 2"


	const netId = "BSC"
	const stakeTokenAddress = "0x56083560594e314b5cdd1680ec6a493bb851bbd8";//THC coin address on bsc mainnet
	const stakeTokenAddress_test = "0x5697A61D1DD5E2bbD730Dce55bc84cbB386d1444";//THC coin address on bsc testnet
	const marketingWalletAddress_test = "0x36a77B8d365257499fe7e3B203AE206d0b64fC59";//'staking test' address to my wallet
	const marketingWalletAddress = "0x7e214F5f19ef8f3FEC429D6f4cdd205A6681F413";// wallet address of client
	// 0x7e214F5f19ef8f3FEC429D6f4cdd205A6681F413   -> this is your market wallet

	const signer = await hre.ethers.getSigner();
	const network = await signer.provider._networkPromise;
	const rpc = 'https://data-seed-prebsc-1-s1.binance.org:8545'; // signer.provider.connection.url;
	const explorer = 'https://testnet.bscscan.com/'; // signer.provider.connection.url;
	const chainId = network.chainId;

	console.log('Starting ' + netId + ('(' + String(chainId).red + ')') + ' by ', signer.address.yellow);
	console.log('Deploying ' + netId + ' Staking contract...'.blue);
	const Staking = await hre.ethers.getContractFactory("Staking");
	const _Staking = await Staking.deploy(stakeTokenAddress_test, marketingWalletAddress);

	console.log('\tStaking' + '\t' + _Staking.address.green);
	console.log('writing network...'.blue);
}

main().then(() => {
}).catch((error) => {
	console.error(error);
	process.exit(1);
});
