"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { contract } from "./utils/blockchain";
import { useReadContract } from "thirdweb/react";
import { ethers } from "ethers";
import { LoadingSpinner } from "@/components/ui/spinner";

export default function page() {
  return <HomePage />;
}

function HomePage() {
  const { data, isPending } = useReadContract({
    contract,
    method:
      "function getActiveCampaigns() view returns ((address owner, string title, string description, uint256 target, uint256 deadline, uint256 amountCollected, string image, address[] donators, uint256[] donations)[])",
    params: [],
  });

  if (isPending) {
    return (
      <div className="h-screen flex w-full justify-center items-center ">
        <LoadingSpinner />
      </div>
    );
  }

  const res = data?.map((project) => {
    if (project.amountCollected >= project.target) {
      // Go to next project
      return;
    }

    return {
      owner: project.owner,
      title: project.title,
      description: project.description,
      target: ethers.formatEther(project.target),
      deadline: project.deadline,
      amountCollected: ethers.formatEther(project.amountCollected),
      image: project.image,
      donators: project.donators,
      donations: project.donations.map((donation) =>
        ethers.formatEther(donation)
      ),
    };
  });

  return (
    <>
      <main className="flex-grow min-h-screen bg-[#f5e6d3] text-[#3c3c3c]">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Blockchain Crowdfunding
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Fund innovative projects with the power of blockchain technology.
              Transparent, secure, and decentralized.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <Link href="/createcampaign" prefetch>
                <Button className="w-full sm:w-auto">Start a Campaign</Button>
              </Link>

              <Link href="/explore">
                <Button
                  variant="outline"
                  className="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto"
                >
                  Explore Campaigns
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
            {res && res.length > 0 ? "Active Campaigns" : "No Active Campaigns"}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {res &&
              res.map(
                (project, index) =>
                  project && (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription>
                          {project.description.slice(0, 100)}...
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <Progress
                            value={
                              (Number(project.amountCollected) /
                                Number(project.target)) *
                              100
                            }
                            className="w-full"
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Raised: {project.amountCollected} ETH</span>
                          <span>Goal: {Number(project.target)} ETH</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        {project.amountCollected >= project.target ? (
                          <Button className="w-full bg-green-800" disabled>
                            Funding Completed
                          </Button>
                        ) : (
                          <Button
                            className="w-full"
                            onClick={() => {
                              let dataToStore = {
                                ...project,
                                amountCollected: Number(
                                  project.amountCollected
                                ),
                                target: Number(project.target),
                                deadline: Number(project.deadline),
                              };

                              localStorage.setItem(
                                "selectedProject",
                                JSON.stringify({ ...dataToStore, pId: index })
                              );

                              window.location.href = `/project/${project.title}`;
                            }}
                          >
                            Fund This Project
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  )
              )}
          </div>
        </section>
      </main>
    </>
  );
}
