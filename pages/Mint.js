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

export default function Mint() {


    const [data, setData] = useState({});
    const [accounts, setAccounts] = useState([]);
    const [ammount, setAmmount] = useState(1);
    const [loader, setLoader] = useState(true);
    const [balance, setBalance] = useState();




    useEffect(() => {
        getAccounts();
        setLoader(false); 
        fetchData()
      }, [accounts[0]])

      

    async function fetchData() {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(address, Contract.abi, provider);
            try {
                
                const priceSale = await contract.priceSale();
                const totalSupply = await contract.totalSupply();
                const MAX_SUPPLY = await contract.MAX_SUPPLY();
                const object = {"priceSale": String(priceSale), "totalSupply": String(totalSupply), "MAX_SUPPLY": String(MAX_SUPPLY) }
                setData(object);
            }
            catch (err) {
                console.log(err);
            }
        }
    }

    async function mint() {
        if (typeof window.ethereum !== 'undefined') {
            let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(address, Contract.abi, signer);
            try {
                let overrides = {
                    from: accounts[0],
                    value: (data.priceSale * ammount).toString()
                }
                const transaction = await contract.saleMint(accounts[0], ammount, overrides);
                await transaction.wait();
                fetchData();
            }
            catch (err) {
                console.log(err);
            }
        }
    }


    const incrementAmmount = () => {
        ammount + 1 <= 5 && setAmmount(ammount + 1);
    }
    const decrementAmmount = () => {
        ammount - 1 >= 1 && setAmmount(ammount - 1)
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
                            <Image className={styles.marketplacephotonftborder1} src="/discordpdp.png" alt="bob" width={800} height={600}/>
                            </div>
                        </div>
                        <div className={styles.btnmarketplace}>
                            <ul className={styles.btnmarketplaceul}>
                                <div className={styles.btnmarketplaceultextmint}>
                                    <h2>Mint Ticket</h2>
                                    <p className={styles.btnmarketplaceulpresentationtexth1supply}>{data.MAX_SUPPLY - data.totalSupply} tickets NFT's restants</p></div>
                                <div className={styles.btnmarketplaceultextbalance}>
                                    <div className={styles.btnmarketplaceultextcontainer}>
                                        <h3>Solde</h3>
                                        <div className={styles.btnmarketplaceultextvoid}></div>
                                        <p>0.013 ETH</p>
                                    </div>
                                    <div className={styles.btnmarketplaceultextline}></div>
                                </div>
                                <div className={styles.btnmarketplaceultextamount}>
                                    <div className={styles.btnmarketplaceultextcontainer}>
                                        <div className={styles.btnmarketplaceultextcontainerbox}>
                                            <h3>Montant</h3>
                                            <p>(max 5)</p>
                                        </div>
                                        <div >
                                            <div className={styles.btnmarkeplaceulquantity}>
                                                
                                                <button className={styles.btnmarkeplaceulquantityl} onClick={decrementAmmount}>-</button>
                                                <button className={styles.btnmarkeplaceulquantityr} onClick={incrementAmmount}>+</button>
                                                
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.btnmarketplaceultextline}></div>
                                </div>
                                <div className={styles.btnmarketplaceultexttotal}>
                                    <div className={styles.btnmarketplaceultextcontainer}>
                                        <h3>Total</h3>
                                        <div className={styles.btnmarketplaceultextvoid}></div>
                                        <p>{data.priceSale/10**18 * ammount} ETH</p>
                                    </div>
                                    <div className={styles.btnmarketplaceultextline}></div>
                                </div>
                                <div className={styles.btnmarketplacemint}>
                                    <button className={styles.btnmint} onClick={mint}>Acheter {ammount}</button>
                                </div>
                            </ul>
                        </div>
                    </div>
                </section>
            
            <Footer/>
        </div >
    )
}
