//this file used to export local copy of smart contract

//const provider = new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/aa2659bd6d0e4422a0f450381a7b4d86")

//abi of deployed smart contract
const abi = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "donutBalances", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getVendingMachineBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "purchase", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "restock", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]

//adding abi and contract address on test net
const vendingMachineContract = web3 => {
    return new web3.eth.Contract(abi, "0x176ad2F65D4dFE16116De0491331F678DD34fC64") 
}

export default vendingMachineContract