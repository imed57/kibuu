// contract.ts
import { ethers } from 'ethers';

const contractAddress = '0xYourContractAddress'; // Replace with your contract's address
const contractABI = [
  // Replace with your contract's ABI
  "function getExpiryTimestamp() view returns (uint256)"
];

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
