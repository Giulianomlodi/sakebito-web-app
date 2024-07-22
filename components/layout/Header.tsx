import React, { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "@/src/styles/header.module.css";
import MenuVoices from "./MenuVoices";
import Image from "next/image";

function Header() {
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      setAccount(user);
    }
  }, []);

  return (
    <header className={styles.headerWrapper}>
      <div className={styles.stickyHeader}>
        <div className={styles.leftArea}>
          <span className={styles.LogoClass}>
            <Image
              src="/Logo.png"
              alt="SAKEbito Logo"
              width={180}
              height={39}
            />
          </span>

        </div>
        <div className={styles.rightArea}>
          <MenuVoices />
          <ConnectButton />

        </div>
      </div>
    </header>
  );
}

export default Header;
