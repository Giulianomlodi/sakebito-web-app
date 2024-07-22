import Link from "next/link";
import { FaTwitter, FaInstagram, FaDiscord } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { SiThreads } from "react-icons/si";
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
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/artists">Artists</Link>
        </li>
        <li></li>
        <li className={styles.socialIcons}>
          <a
            href="https://twitter.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaXTwitter />
          </a>
          <a
            href="https://www.instagram.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.threads.net/@yourusername"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiThreads />
          </a>
          <a
            href="https://discord.gg/BjGPNPxcbk"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaDiscord />
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default MenuVoices;
