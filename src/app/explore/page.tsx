"use client";
import React from "react";
import { ethers } from "ethers";
import { useReadContract } from "thirdweb/react";
import { contract } from "@/app/utils/blockchain";
import { LoadingSpinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default function page() {
  return <ProjectList />;
}

const ProjectList = () => {
  const LIMIT = 6n;
  const [offset, setOffset] = React.useState(0n);

  const { data, isPending } = useReadContract({
    contract,
    method:
      "function getCurrentCampaigns(uint256 offset, uint256 limit) view returns ((address owner, string title, string description, uint256 target, uint256 deadline, uint256 amountCollected, string image, address[] donators, uint256[] donations)[])",
    params: [0n, offset + LIMIT],
  });

  if (isPending) {
    return (
      <div className="h-screen flex w-full justify-center items-center ">
        <LoadingSpinner />
      </div>
    );
  }

  if (data?.length === 0) {
    return <h1 className="text-3xl font-bold">No Projects Found</h1>;
  }

  const res = data?.map((project) => {
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

  async function loadMoreCampaigns() {
    if (data) {
      setOffset((prev) => prev + LIMIT);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5e6d3] text-[#3c3c3c] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">Projects</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
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
                              amountCollected: Number(project.amountCollected),
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
        <div className="mt-4">
          <Button className="w-full" onClick={loadMoreCampaigns}>
            Load More
          </Button>
        </div>
      </div>
    </div>
  );
};
