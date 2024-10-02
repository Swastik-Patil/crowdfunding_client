"use client";
import React, { useState, useEffect } from "react";
import { Bitcoin, Clock, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ethers } from "ethers";
import { convertEthToBigInt, getDaysRemaining } from "../../utils";
import Image from "next/image";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction, useActiveAccount } from "thirdweb/react";
import { contract } from "@/app/utils/blockchain";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/spinner";

export default function page({ params }: { params: { project_id: string } }) {
  return <CampaignDetails />;
}

interface Project {
  owner: string;
  title: string;
  description: string;
  target: string;
  deadline: Date;
  amountCollected: string;
  image: string;
  donators: string[];
  donations: string[];
  pId: number;
}

const CampaignDetails = () => {
  const router = useRouter();
  const activeAccount = useActiveAccount();
  const { mutate: sendTransaction } = useSendTransaction();
  const [fundAmount, setFundAmount] = useState("");
  const [project, setProject] = useState<Project>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let selectedProject = localStorage.getItem("selectedProject");

    if (
      selectedProject === "" ||
      selectedProject === null ||
      selectedProject === undefined
    ) {
      router.push("/");
      return;
    }

    let res = JSON.parse(selectedProject);
    if (!res) {
      return;
    }

    setProject({
      owner: res.owner,
      title: res.title,
      description: res.description,
      target: res.target,
      deadline: res.deadline,
      amountCollected: res.amountCollected,
      image: res.image,
      donators: res.donators,
      donations: res.donations,
      pId: res.pId,
    });
  }, [router]);

  async function handleFundTransfer() {
    // Here you would implement the logic to process the funding
    console.log(`Funding amount: ${fundAmount} ETH`);

    // Check if there is an active account
    if (!activeAccount) {
      console.error("No active account found");
      return;
    }

    if (!project) {
      console.error("No project found");
      return;
    }

    // Check if the user has entered a valid amount
    if (fundAmount === "") {
      console.error("Please enter a valid amount");
      return;
    }

    // Check if the user has entered a valid amount
    if (Number(fundAmount) <= 0) {
      console.error("Please enter a valid amount");
      return;
    }

    // Check if the user has entered a valid amount
    if (Number(fundAmount) > Number(project?.target)) {
      console.error("Please enter a valid amount");
      return;
    }

    setLoading(true);

    // Prepare the contract call
    const transaction = await prepareContractCall({
      contract,
      method: "function donateToCampaign(uint256 _id) payable",
      params: [BigInt(project?.pId)],
      value: await convertEthToBigInt(fundAmount),
    });

    sendTransaction(transaction);

    setLoading(true);
  }

  if (loading) {
    return (
      <div className="h-screen flex flex-col w-full justify-center items-center ">
        <LoadingSpinner />
        <h2 className="mt-4">Processing Transaction...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5e6d3] text-[#3c3c3c] p-8">
      {project ? (
        <main className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">{project.title}</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>About the Project</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mt-4">
                    {project.image && (
                      <Image
                        src={project.image}
                        alt={project.title}
                        width={800}
                        height={400}
                      />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {project.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center space-x-2">
                    <span>Owner : {project.owner}</span>
                  </div>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Fund this Project</CardTitle>
                  <CardDescription>
                    Support Innovative Project X
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">
                        {project.amountCollected} ETH
                      </span>
                      <span className="font-semibold">
                        {project.target} ETH Goal
                      </span>
                    </div>
                    <Progress
                      value={
                        (Number(project.amountCollected) /
                          Number(project.target)) *
                        100
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{project.donators.length} backers</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          {String(getDaysRemaining(project.deadline))} days left
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-stretch">
                  <Input
                    type="number"
                    placeholder="Amount in ETH"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    step={0.01}
                    className="mb-2"
                  />
                  <Button
                    onClick={handleFundTransfer}
                    className="w-full bg-[#d9c8b4] text-[#3c3c3c] hover:bg-[#c9b8a4]"
                  >
                    Fund this Project
                  </Button>
                </CardFooter>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Rewards</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>
                      🎁 {(Number(project.target) * 20) / 100} ETH - Early
                      Access
                    </li>
                    <li>
                      🏆 {(Number(project.target) * 50) / 100} ETH - Limited
                      Edition NFT
                    </li>
                    <li>🌟 {project.target} ETH - Premium Membership</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner />
        </div>
      )}

      <footer className="mt-12 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} BlockFund. All rights reserved.</p>
      </footer>
    </div>
  );
};
