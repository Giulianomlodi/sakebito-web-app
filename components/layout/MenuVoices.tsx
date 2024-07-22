import Link from "next/link";
import { FaTwitter, FaInstagram, FaDiscord } from "react-icons/fa";
import { FaTelegram, FaXTwitter } from "react-icons/fa6";

import { SiFarcaster, SiThreads } from "react-icons/si";
import styles from "@/src/styles/menu.module.css";

const MenuVoices = () => {
  return (
    <nav className={styles.nav}>
      <ul className={styles.menuList}>
        {/*   
        <li>
          <Link href="/about">About</Link>
        </li>
        */}
        <li>
          <Link target="_blank" href="https://www.sakebito.xyz/">Home</Link>
        </li>
        <li>
          <Link href="/">Mint</Link>
        </li>
        <li></li>
        <li className={styles.socialIcons}>
          <a
            href="https://twitter.com/wearesakebito"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaXTwitter />
          </a>
          <a
            href="https://www.instagram.com/sakebito.japan"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>
          <a
            href="https://t.me/+hDMg4hVPy6VlNDQ0"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTelegram />
          </a>
          <a
            href="https://warpcast.com/sakebito"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiFarcaster />
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default MenuVoices;
