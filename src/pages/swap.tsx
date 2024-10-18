import type { NextPage } from "next";
import { useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider"; // Import the provider detection
import { providers, Contract, ethers } from "ethers";
import { parse } from "path";

// Import the ABI of your ERC20 token and your Ttoken contract
// KIBU
const ERC20ABI = [{"inputs":[{"internalType":"address","name":"initialOwner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"_finalBuyTax","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_finalSellTax","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"newTax","type":"uint256"}],"name":"downSellFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"initializePair","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"openTrading","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pair","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"removeLimits","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"rescueETH","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"rescueTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_initialized","type":"bool"}],"name":"setIsInitialized","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_pair","type":"address"}],"name":"setPair","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tradingOpen","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
const TtokenABI = [
	{
		"inputs": [
			{
				"internalType": "contract IERC20",
				"name": "_Kibu",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_baseMintingCostInETH",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newBaseMintingCostInETH",
				"type": "uint256"
			}
		],
		"name": "BaseMintingCostUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ttokenBurned",
				"type": "uint256"
			}
		],
		"name": "Burn",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ttokenAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenBurned",
				"type": "uint256"
			}
		],
		"name": "Mint",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "Kibu",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "WETH",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
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
		"inputs": [],
		"name": "baseMintingCostInETH",
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
		"inputs": [],
		"name": "burnAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "ttokenAmount",
				"type": "uint256"
			}
		],
		"name": "burnTtoken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "KibusAmount",
				"type": "uint256"
			}
		],
		"name": "calculateTtokenFromKibu",
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
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getKibuPriceInETH",
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
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "KibusAmount",
				"type": "uint256"
			}
		],
		"name": "swaptokenForTtoken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "uniswapRouter",
		"outputs": [
			{
				"internalType": "contract IUniswapV2Router",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newBaseMintingCostInETH",
				"type": "uint256"
			}
		],
		"name": "updateBaseMintingCost",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]
const Swap: NextPage = () => {
    const [provider, setProvider] = useState<providers.Web3Provider | null>(null);
    const [account, setAccount] = useState<string | null>(null);
    const [ttokenContract, setTtokenContract] = useState<Contract | null>(null);
    const [tokenAddress, setTokenAddress] = useState<string>("0x853Ac006B41026AD31963C29788525170fa30163"); // KIBU token address
    const [amountToSwap, setAmountToSwap] = useState<string>(""); // Input amount
    const [tkibuAmount, setTkibuAmount] = useState<number | null>(null); // Amount of tKibu to be received
    const [maxKibuAmount, setMaxKibuAmount] = useState<string>("0"); // Maximum KIBU amount held
  
    useEffect(() => {
      const initializeProvider = async () => {
        const ethereumProvider = await detectEthereumProvider();
        if (ethereumProvider) {
          const web3Provider = new providers.Web3Provider(ethereumProvider);
          setProvider(web3Provider);
  
          const accounts = await web3Provider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
  
            // Fetch the user's KIBU balance
            const tokenContract = new Contract(tokenAddress, ERC20ABI, web3Provider.getSigner());
            const balance = await tokenContract.balanceOf(accounts[0]);
            const balanceInKibu = ethers.utils.formatUnits(balance, 18); // Adjust decimals as needed
            setMaxKibuAmount((parseFloat(balanceInKibu)).toFixed(2)); // Adjust decimals as needed
          }
  
          const ttokenContractInstance = new Contract(
            "0xFe525B70d7846FD850a86dCC5728C902ab7C972C", // TKIBU
            TtokenABI,
            web3Provider.getSigner()
          );
          setTtokenContract(ttokenContractInstance);
        }
      };
  
      initializeProvider();
    }, []);
  
    const handleAmountChange = async (value: string) => {
      const amountInKibu = parseFloat(value);
  
      if (!isNaN(amountInKibu)) {
        try {
          // Convert the input KIBU amount to BigNumber using ethers.utils.parseUnits
          const kibu = ethers.utils.parseUnits(value, 18); // Assumes KIBU has 18 decimals
          setAmountToSwap(value);
  
          // Call the contract function to calculate the corresponding tKibu amount
          const tkibu = await ttokenContract.calculateTtokenFromKibu(kibu);
          
          // Format the returned value from BigNumber to a human-readable format (if necessary)
          const formattedTkibu = (ethers.utils.formatUnits(tkibu, 18)); // Adjust decimals if tKibu has fewer/more decimals
  
          const ee = (parseFloat(formattedTkibu)).toFixed(2);
  
          // Update state with the calculated tKibu amount
          setTkibuAmount(parseFloat(ee));
        } catch (error) {
          console.error("Error calculating tKibu:", error);
          setTkibuAmount(null);
        }
      } else {
        setTkibuAmount(null);
      }
    };
  
    const handleApproveAndSwap = async () => {
      if (!ttokenContract || !account || !amountToSwap) return;
  
      try {
        const amountToApprove = ethers.utils.parseUnits(amountToSwap, 18); // Adjust decimals as needed
        const tokenContract = new Contract(tokenAddress, ERC20ABI, provider.getSigner());
  
        // First, approve the transfer
        const approvalTx = await tokenContract.approve(ttokenContract.address, amountToApprove);
        await approvalTx.wait(); // Wait for the approval transaction to be mined
        console.log("Approval successful!", approvalTx);
  
        // Then, perform the swap
        const swapTx = await ttokenContract.swaptokenForTtoken(amountToApprove); // Adjust to match your function
        await swapTx.wait(); // Wait for the swap transaction to be mined
        console.log("Swap successful!", swapTx);
  
      } catch (error) {
        console.error("Transaction failed:", error);
      }
    };
  
    const handleMaxClick = () => {
      setAmountToSwap(maxKibuAmount); // Set input to the maximum amount
      handleAmountChange(maxKibuAmount); // Trigger the logic to calculate tKibu amount
    };
  
    return (
      <div className="swap-container">
        <div className="swap-box">
          <h1>Swap KIBU for tKibu</h1>
  
          <div className="input-container">
            <input
              type="number"
              value={amountToSwap}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="Enter KIBU amount"
            />
            <span onClick={handleMaxClick}>Max: {maxKibuAmount} KIBU</span>
          </div>
  
          <button onClick={handleApproveAndSwap}>
            Swap
          </button>
  
          {tkibuAmount !== null && (
            <div className="swap-result">
              You will receive: {tkibuAmount} tKibu
            </div>
          )}
        </div>
  
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

          .swap-container {
            background-image: url('/uni-bg.jpg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }
  
          .swap-box {
            background: white;
            padding: 30px 50px;
            border-radius: 15px;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(34, 198, 248, 1);
            text-align: center;

          }
  
          h1 {
            font-family: 'Press Start 2P';
            font-size: 22px;
            color: black;
            margin-bottom: 20px;
          }
  
          .input-container {
            margin-bottom: 20px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
  
          input {
            font-family: 'Press Start 2P';
            padding: 15px;
            font-size: 18px;
            width: 100%;
            border-radius: 5px;
            border: 1px solid #ccc;
            outline: none;
            transition: border 0.3s;
          }

          input::placeholder {
            font-family: 'Press Start 2P';
            font-size: 12px; /* You can adjust this size */
            color: #aaa; /* Optional, to customize the placeholder color */
          }
  
          input:focus {
            border: 1px solid #00A3FF;
          }
  
          span {
            margin-top: 10px;
            color: #00A3FF;
            font-size: 10px;
            cursor: pointer;
            text-align: left;
            transition: color 0.3s;
            font-family: 'Press Start 2P';

          }
  
          span:hover {
            color: #0087C4;
          }
  
          button {
            padding: 15px;
            font-size: 18px;
            border-radius: 5px;
            border: none;
            background-color: #00A3FF;
            color: #FFFFFF;
            cursor: pointer;
            width: 100%;
            transition: background 0.3s;
            font-family: 'Press Start 2P';

          }
  
          button:hover {
            background-color: #0087C4;
          }
  
          .swap-result {
            margin-top: 10px;
            color: black;
            font-family: 'Press Start 2P';

          }
        `}</style>
      </div>
    );
    
  };
  
  export default Swap;
  