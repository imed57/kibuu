// contract.ts
import { ethers } from 'ethers';

const contractAddress = '0xFc4d2F28d5F4186155Dfcc6F9a16ee3079f68d46'; // Replace with your contract's address
const contractABI = [{"inputs":[{"internalType":"address","name":"_equilibriumToken","type":"address"},{"internalType":"address","name":"_devAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WEEK_DURATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claimReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"devAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"distributeRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"equilibriumToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastDistributionTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"rewardExpiry","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"rewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_equilibriumToken","type":"address"}],"name":"setEquilibriumToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"score","type":"uint256"}],"name":"submitScore","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"topPlayers","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"topScores","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]

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