// components/UserMenu.tsx
"use client";

import { useLogin, useLogout, usePrivy } from "@privy-io/react-auth";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import WhiteButton from "@/components/Button/WhiteButton";
import { useStreak } from "@/hooks/useStreak";
import { base } from "viem/chains";
import {
  Avatar,
  Identity,
  Name,
  Badge,
  Address,
} from "@coinbase/onchainkit/identity";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const UserMenu = () => {
  const router = useRouter();
  const { user } = usePrivy();
  const { streakCount, buttonDisabled, handleGMClick } = useStreak();

  const { logout } = useLogout({
    onSuccess: () => {
      router.push("/");
    },
  });

  const { login } = useLogin({
    onComplete: async (user, isNewUser, wasAlreadyAuthenticated) => {
      console.log(
        "User: ",
        user,
        "isNewUser: ",
        isNewUser,
        wasAlreadyAuthenticated
      );
      router.push("/");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const smartWallet = user?.linkedAccounts.find(
    (account) => account.type === "smart_wallet"
  );

  const fullAddress = smartWallet?.address || user?.wallet?.address;

  const getUserDisplayInfo = () => {
    if (user?.google) return { type: "google", value: user.google.email };
    if (user?.email) return { type: "email", value: user.email.address };
    if (user?.discord) return { type: "discord", value: user.discord.username };
    if (user?.twitter) return { type: "twitter", value: user.twitter.username };
    if (user?.farcaster)
      return {
        type: "farcaster",
        value: `${user.farcaster.username} - ${user.farcaster.fid}`,
      };
    return null;
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div className="relative flex items-center gap-4">
        <div className="relative z-10 group md:hidden">
          <button
            style={{
              background:
                "radial-gradient(100% 100% at 50% 0%, #465770 0%, #1E2836 100%)",
            }}
            className={`transition-all select-none rounded-lg font-polysans uppercase flex items-center justify-center text-center border text-sm py-2 px-2 text-gray-10 ${
              buttonDisabled ? "cursor-not-allowed" : "cursor-pointer"
            } border-gray-600`}
            onClick={!buttonDisabled ? handleGMClick : undefined}
          >
            <Image
              src="/gm_fire.png"
              alt="gm"
              width={100}
              height={100}
              unoptimized
              className="w-5 h-5"
            />
            <span className="ml-1 text-sm text-white lg:mr-0">
              {streakCount}&nbsp;
            </span>
            <span className="inline text-gray-200 font-thin">GM</span>
          </button>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 translate-y-full px-4 py-2 w-[380px] bg-black border border-grey text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-md">About Streaks</p>
            <div className="flex gap-3">
              <p className="text-sm my-1">
                Streaks reset every day at 00:00 UTC. Your streak will break if
                you don&apos;t gm tomorrow.
              </p>
            </div>
          </div>
        </div>

        {user ? (
          <MenuButton>
            <Identity
              address={fullAddress as `0x${string}`}
              schemaId={fullAddress as `0x${string}`}
            >
              <Avatar className="w-8" />
              <Name
                address={fullAddress as `0x${string}`}
                chain={base}
                className="text-blue-500 text-sm"
              >
                <Badge className="bg-error" />
              </Name>
              <Address className="text-gray-500 text-xs" />
            </Identity>
          </MenuButton>
        ) : (
          <WhiteButton onClick={() => login()}>
            <div className="relative z-10">
              <div className="active:scale-95 select-none rounded-lg flex items-center justify-start gap-2 subpixel-antialiased focus:outline-highlight focus:ring-0 border whitespace-nowrap group h-9 min-w-[2rem] border-transparent bg-white text-gray-10 hover:bg-gray-100 disabled:bg-gray-50 disabled:text-gray w-full px-2 py-2 font-polysans text-sm transition-all">
                <div style={{ width: "120px" }}>Sign In</div>
              </div>
            </div>
          </WhiteButton>
        )}
      </div>

      <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-800 rounded-md bg-black shadow-lg ring-1 ring-white ring-opacity-5 transition focus:outline-none">
        {user && getUserDisplayInfo() && (
          <div className="px-4 py-3 font-polysans">
            <p className="text-white text-sm">Signed in as</p>
            <p className="truncate text-sm text-gray-400">
              {getUserDisplayInfo()?.value}
            </p>
          </div>
        )}

        <div className="py-1">
          <MenuItem>
            {({ active }) => (
              <button
                type="button"
                className={classNames(
                  active ? "bg-black text-gray-200" : "text-gray-200",
                  "block w-full px-4 py-2 text-left text-sm font-polysans"
                )}
                onClick={logout}
              >
                Sign out
              </button>
            )}
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
};
