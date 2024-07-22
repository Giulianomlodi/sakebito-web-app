import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { polygon, sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "SAKEbito Web App",
  projectId: "YOUR_PROJECT_ID",
  chains: [
    polygon,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [sepolia] : []),
  ],
  ssr: true,
});
