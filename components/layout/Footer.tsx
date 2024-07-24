import React from 'react'
import styles from '@/src/styles/footer.module.css'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.footerLeft}>
                    All rights reserved - © 2024 - SAKEbito
                </div>
                <div className={styles.footerRight}>
                    <a href="https://x.com/otakun_0x" rel="noopener noreferrer" target="_blank">
                        Made with ❤️ by your fren otakun_0x
                    </a>
                </div>
            </div>
        </footer>
    )
}