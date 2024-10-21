import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  mainnet,
  sepolia,
  polygonAmoy,
  baseSepolia,
  base
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    mainnet,
    sepolia,
    baseSepolia,
    base,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  ssr: true,
});