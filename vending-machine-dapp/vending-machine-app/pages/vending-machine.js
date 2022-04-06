import Head from 'next/head'
import { useState, useEffect } from 'react'
import Web3 from 'web3'
//import local smart contract
import vendingMachineContract from '../blockchain/vending'
import 'bulma/css/bulma.css'
import styles from '../styles/VendingMachine.module.css'

const VendingMachine = () => {
    const [error, setError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [inventory, setInventory] = useState('')
    const [myDonutCount, setMyDonutCount] = useState('')
    const [buyCount, setBuyCount] = useState('')
    const [web3, setWeb3] = useState(undefined)
    const [address, setAddress] = useState(undefined)
    const [vmContract, setVmContract] = useState(undefined)
    const [purchases, setPurchases] = useState(0)


    useEffect(() => {
        if (vmContract) getMyDonutCountHandler()
        if (vmContract && address) getInventoryHandler()
    }, [vmContract, address])

    //get inventory from smart contract by reading from chain and putting into setInventory()
    const getInventoryHandler = async () => {
        const inventory = await vmContract.methods.getVendingMachineBalance().call()
        setInventory(inventory)
    }

    const getMyDonutCountHandler = async () => {
        //use metamask api to retrieve list of accounts from wallet
        const count = await vmContract.methods.donutBalances(address).call()
        setMyDonutCount(count)
    }

    //set amount of donuts to buy with the button event
    const updateDonutQuantity = event => {
        setBuyCount(event.target.value)
    }

    //buy donuts
    const buyDonutHandler = async () => {
        try {
            await vmContract.methods.purchase(buyCount).send({
                from: address,
                //value is in wei
                value: web3.utils.toWei('2','ether') * buyCount
            })

            setSuccessMsg('Donuts successfully purchased')

            //update page in real-time
            if (vmContract) getMyDonutCountHandler()
            if (vmContract && address) getInventoryHandler()
        } catch (err) {
            setError(err.message)
        }
    }


    const connectWalletHandler = async () => {
        //check for metamask
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
                //request wallet connection
                await window.ethereum.request({ method: "eth_requestAccounts" })

                //instantiate web3
                web3 = new Web3(window.ethereum)
                setWeb3(web3)

                //get list of wallet accounts
                const accounts = await web3.eth.getAccounts()

                //set account
                setAddress(accounts[0])

                //set local contract instance
                const vm = vendingMachineContract(web3)
                setVmContract(vm)

            } catch (err) {
                setError(err.message)
            }
            
        } else {
            //metamask not installed
            alert("Please install MetaMask")
        }
    }
    return (
        <div className={styles.main}>
            <Head>
                <title>Vending Machine App</title>
                <meta name="description" content="A blockchain vending machine app" />
            </Head>
            <nav className="navbar mt-4 mb-4">
                <div className="container">
                    <div className="navbar-brand">
                        <h1>Vending Machine</h1>
                    </div>
                    <div className="navbar-end">
                        <button onClick={connectWalletHandler} className="button is-primary">Connect Wallet</button>
                    </div>
                </div>
            </nav>
            <section>
                <div className="container">
                    <h2>Vending Machine Inventory: {inventory}</h2>
                </div>
            </section>
            <section>
                <div className="container">
                    <h2>My Donuts: {myDonutCount}</h2>
                </div>
            </section>
            <section className="mt-5">
                <div className="container">
                    <div className="field">
                        <label className="label">Buy Donuts</label>
                        <div className="control">
                            <input onChange={updateDonutQuantity} className="input" type="text" placeholder="Enter Amount..." />
                        </div>
                        <button onClick={buyDonutHandler} className="button is-primary mt-2">Buy</button>
                    </div>
                </div>
            </section>
            <section>
                <div className="container has-text-danger">
                    <p>{error}</p>
                </div>
            </section>
            <section>
                <div className="container has-text-success">
                    <p>{successMsg}</p>
                </div>
            </section>
        </div>
    )
}

export default VendingMachine