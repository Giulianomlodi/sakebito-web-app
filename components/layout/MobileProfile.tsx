import React, { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "../../src/styles/mobile-profile.module.css";
import { FaTimes } from "react-icons/fa";
import { useAccount } from "wagmi";

function MobileProfile() {
  const [account, setAccount] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const { isConnected: isRainbowKitConnected, address: rainbowKitAddress } =
    useAccount();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      setAccount(user);
    }
  }, []);

  const handleCloseOptions = () => {
    setShowOptions(false);
  };

  return (
    <div className={styles.containerMobilyno}>
      {!showOptions && (
        <button
          className={styles.connectButton}
          onClick={() => setShowOptions(true)}
        >
          {account ? "Connect" : "Profile"}
        </button>
      )}
      {showOptions && (
        <div className={styles.connectOptions}>
          <div className={styles.closeIcon} onClick={handleCloseOptions}>
            <FaTimes />
          </div>
          <>
            <ConnectButton />
          </>
        </div>
      )}
    </div>
  );
}

export default MobileProfile;
