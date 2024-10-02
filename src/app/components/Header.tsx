"use client";
import React from "react";
import { ConnectButton } from "thirdweb/react";
import { client } from "../client";
import { Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Sun className="h-8 w-8 text-yellow-500" />
          <span className="ml-2 text-xl font-bold text-gray-900">
            BlockFund
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link href="/explore">
            <Button variant="ghost">Campaigns</Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost">About</Button>
          </Link>
          <ConnectButton
            client={client}
            appMetadata={{
              name: "Example App",
              url: "http://localhost:3000",
            }}
          />
        </div>
      </nav>
    </header>
  );
};

export default Header;
