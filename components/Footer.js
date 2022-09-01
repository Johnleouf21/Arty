import styles from '../styles/Home.module.css'

export default function Footer() {

    return (
        <footer><div id="deuxiemeTrait"></div>
                <div className={styles.footercontainer}>
                    <div className={styles.footerpresentationdefi}>
                        <div className={styles.footerpresentationdefidescription}>
                            <h3 className={styles.footerpresentationdefih3}><i className="fa-solid fa-ticket"></i> DeFi Lottery</h3>
                            <h4 className={styles.footerpresentationdefih4}>DeFi Lottery lotterie basée sur la technologie blockchain et sécurisée grâce à l utilisation d un contrat intelligent</h4>
                        </div>
                    </div>
                    <div className={styles.footercredits}>
                        <h4><a href="#">Credits</a></h4>
                        <h4><a href="FRindex.html/about" hrefLang="#about">A propos</a></h4>
                        <h4><a href="#">Nous contacter</a></h4>
                        <h4><a href="#">Whitepaper</a></h4>
                        <h4><a href="credits.html">Credits</a></h4>

                        <form action="data.php" method="POST" className={styles.footerform}>
                            <input className={styles.footerforminput} placeholder="E-mail" />
                            <textarea className={styles.footerformtextarea} placeholder="Votre message"></textarea>
                            <button className={styles.footerformbtn}><a>Envoyer</a></button>
                        </form> --{'>'}
                    </div>
                </div>
                <div id="deuxiemeTrait"></div>
                <div id="copyrightEtIcons">
                    <div id="copyright">
                        <span title="Jeunes Entrepreneurs">© 2022, All Rights Reserved</span>

                    </div>
                    <div className={styles.icons}>
                        <a href="https://twitter.com/?lang=fr" title="Accédez à notre twitter"><i className="fa-brands fa-twitter"></i></a>
                        <a href="https://www.youtube.com/?hl=FR" title="Accédez à notre chaine youtube"><i className="fa-brands fa-youtube"></i></a>
                        <a href="https://discord.gg/mXb4Aq5Bz2" title="Accédez à notre discord communautaire officiel"><i className="fa-brands fa-discord"></i></a>
                    </div>
                </div>

            </footer>
    )
}