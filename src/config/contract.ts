// contract.ts
import { ethers } from 'ethers';

const contractAddress = '0xf705B5Dfa45f68fc3732c948a3bCbC3391250fc1'; // Replace with your contract's address
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
// Function to create a reusable contract instance
export const getContractInstance = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum); // MetaMask provider
    const signer = provider.getSigner(); // Get the user account (signer)
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    return contract;
  } catch (error) {
    console.error('Error creating contract instance:', error);
    throw new Error('Failed to create contract instance');
  }
};