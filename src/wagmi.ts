import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { polygon, sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "SAKEbito Web App",
  projectId: "13e4f8639f1394481fc735b67e0133b6",
  chains: [
    polygon,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [sepolia] : []),
  ],
  ssr: true,
});
