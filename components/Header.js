import styles from '../styles/Home.module.css'
import { useState } from 'react';
import Link from 'next/link';


export default function Header() {

    const [accounts, setAccounts] = useState([]);
    const [balance, setBalance] = useState();

    async function getAccounts() {
        if(typeof window.ethereum !== 'undefined') {
          let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccounts(accounts);
        }
      }

      return (
<div className={styles.grid}>
<header>
                <nav>
                    <ul>
                        <li className={styles.logo}><Link href="/"> DeFi Lottery</Link></li>
                        <div className="action" />
                        
                        <div className="menu">
                            <ul>
                                <div className="action2">
                                    
                                </div>
                            </ul>

                            
                            
                        </div>

                    </ul>
                    <div className="iconsnavbartwitter"><a className="logotwitter" href="https://twitter.com/?lang=fr" title="Accédez à notre twitter"><i className="fa-brands fa-twitter"></i></a></div>
                    <div className="iconsnavbardiscord"><a className="logodiscord" href="https://discord.gg/mXb4Aq5Bz2" title="Accédez à notre discord communautaire officiel"><i className="fa-brands fa-discord"></i></a></div>
                    <li id="whitepaper"><a href="#" title="Accédez au White Paper">White Paper</a></li>
                    <li id="apropos"><a href="FRindex.html#about" title="Pour mieux comprendre notre projet">A propos</a></li>
                    <button className={styles.walletBTN} onClick={getAccounts}>CONNECT WALLET</button>
                    
                    
                </nav>
            </header ></div>

      )
}
