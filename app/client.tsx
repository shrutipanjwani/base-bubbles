"use client";

import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { SmartWalletsProvider } from "@privy-io/react-auth/smart-wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base, baseSepolia } from "viem/chains";
import { http } from "viem";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";
import { OnchainKitProvider } from "@coinbase/onchainkit";

export const wagmiConfig = createConfig({
  chains: [baseSepolia, base],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ClientProvider = ({ children }: any) => {
  const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID as string;

  const defaultChain =
    process.env.NODE_ENV === "production" ? base : baseSepolia;

  const queryClient = new QueryClient();

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ["email", "wallet", "google", "farcaster"],
        supportedChains: [base, baseSepolia],
        // Customize Privy's appearance in your app
        appearance: {
          theme: "#0e1016",
          accentColor: "#0055FF",
          logo: "/logo_blue.png",
          walletList: ["coinbase_wallet", "metamask", "rainbow"],
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
          noPromptOnSignature: true,
        },
        defaultChain: defaultChain,
      }}
      // onSuccess={() => handleSuccess(user)}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
          <OnchainKitProvider
            apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
            chain={defaultChain} // add baseSepolia for testing
          >
            <SmartWalletsProvider>{children}</SmartWalletsProvider>
          </OnchainKitProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
};

export default ClientProvider;
