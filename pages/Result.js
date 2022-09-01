import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Head from 'next/head';
import Image from 'next/image';
import Contract from '../artifacts/contracts/DefiLottery.sol/DefiLottery.json';
import styles from '../styles/Home.module.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import InfosAccount from '../components/InfosAccount';





/// L'address du contrat
const address = "0x4da268C28C3d4675Db77ac815417824791204d63";

export default function Result() {


    const [data, setData] = useState({});
    const [accounts, setAccounts] = useState([]);
    const [ammount, setAmmount] = useState(1);
    const [loader, setLoader] = useState(true);
    const [balance, setBalance] = useState();



    useEffect(() => {
        getAccounts();
        setLoader(false); 
        getResult()
      }, [accounts[0]])

     

      async function Withdraw() {
        if(typeof window.ethereum !== 'undefined') {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(address, Contract.abi, signer);
          try {
            const transaction = await contract.withdrawToWinner();
            await transaction.wait();
            
            }
            
            
          
          catch(err) {
            console.log(err);
          }
        }
      }
    
      async function getResult() {
        if(typeof window.ethereum !== 'undefined') {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract(address, Contract.abi, provider);
          try {
            const gain = await contract.getBalanceForTheWinner();
            const winnerAddress = await contract.getWinnerAddress();
            const object2 = {"gain": String(gain), "winnerAddress": String(winnerAddress)}
            setData(object2);
            }
          catch(err) {
            console.log(err);
          }
        }
      }
    


    ///-------------------------------------------------------------Button connect-----------------------------------------------------------------------
///Si Metamask est déjà installé
async function getAccounts() {
    if(typeof window.ethereum !== 'undefined') {
      let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccounts(accounts);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(accounts[0]);
      const balanceInEth = ethers.utils.formatEther(balance);
      setBalance(balanceInEth);
    }
  }

    ///<━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━App━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━>


    return (
        <div className={styles.container}>
            <Head>
        <title>lottery</title>
        <meta property="og:image:url" content="/favicon.jpg"></meta>
        <meta name="description" content="The red paws club project, A true passive income NFT, The easy way of earning money" />
        <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header/>
            <InfosAccount accounts={accounts} balance={balance} loader={loader}/>

            
                <section className="fontImg1">
                    <div className="banner-information">


                    </div>
                    <div className={styles.marketplace}>
                        <div className={styles.marketplacephotonft}>
                            <div className={styles.marketplacephotonftborder}>
                            
                            </div>
                        </div>
                        <div className={styles.btnmarketplace}>
                            <ul className={styles.btnmarketplaceul}>
                                <div className={styles.btnmarketplaceultextmint}>
                                    <h2>Claim Reward</h2>
                                    <p className={styles.btnmarketplaceulpresentationtexth1supply}>for the lucky winner</p></div>
                                <div className={styles.btnmarketplaceultextbalance}>
                                    <div className={styles.btnmarketplaceultextcontainer}>
                                        <h3>Winneraddress</h3>
                                        <div className={styles.btnmarketplaceultextvoid}></div>
                                        <p>{data.winnerAddress}</p>
                                    </div>
                                    
                                </div>
                                <div className={styles.btnmarketplaceultextamount}>
                                    
                                    <div className={styles.btnmarketplaceultextline}></div>
                                </div>
                                <div className={styles.btnmarketplaceultexttotal}>
                                    <div className={styles.btnmarketplaceultextcontainer}>
                                        <h3>Gain</h3>
                                        <div className={styles.btnmarketplaceultextvoid}></div>
                                        <p>{data.gain/10**18} ETH</p>
                                    </div>
                                    
                                </div>
                                <div className={styles.btnmarketplacemint}>
                                    <button className={styles.btnmint} onClick={Withdraw}>Acheter</button>
                                </div>
                            </ul>
                        </div>
                    </div>
                </section>
            
            <Footer/>
        </div >
    )
}
