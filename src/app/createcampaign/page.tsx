"use client";
import React, { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { contract } from "@/app/utils/blockchain";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ethers } from "ethers";

import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { checkIfImage, convertEthToBigInt } from "../utils";
import { LoadingSpinner } from "@/components/ui/spinner";

const page = () => {
  return <CreateCampaign />;
};

export default page;

const CreateCampaign = () => {
  const activeAccount = useActiveAccount();
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: sendTransaction } = useSendTransaction();

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    target: "",
    deadline: "",
    image: "",
  });

  async function handleCampaignCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeAccount) {
      console.error("No active account found");
      return;
    }

    if (
      formData.target === "" ||
      formData.deadline === "" ||
      formData.image === ""
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (Number(formData.target) <= 0) {
      alert("Target must be greater than 0");
      return;
    }

    setIsLoading(true);
    checkIfImage(formData.image, async (isValid: Boolean) => {
      if (!isValid) {
        setIsLoading(false);
        alert("Invalid image URL");
        return;
      } else {
        const _owner = activeAccount.address;
        const target = await convertEthToBigInt(formData.target);
        const deadline = BigInt(new Date(formData.deadline).getTime() / 1000);

        const transaction = prepareContractCall({
          contract,
          method:
            "function createCampaign(address _owner, string _title, string _description, uint256 _target, uint256 _deadline, string _image) returns (uint256)",
          params: [
            _owner,
            formData.title,
            formData.description,
            target,
            deadline,
            formData.image,
          ],
        });

        sendTransaction(transaction);
        setIsLoading(false);
      }
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleTextAreaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col w-full justify-center items-center ">
        <LoadingSpinner />
        <h2 className="mt-4">Processing Transaction...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5e6d3] text-[#3c3c3c] p-8">
      <main className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create a New Campaign</CardTitle>
            <CardDescription>
              Fill in the details to launch your crowdfunding campaign
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCampaignCreate} className="space-y-4">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="title">Campaign Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Campaign Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleTextAreaChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="target">Funding Target (in ETH)</Label>
                <Input
                  id="target"
                  name="target"
                  type="number"
                  step="0.01"
                  value={formData.target}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="deadline">Campaign Deadline</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="image">Campaign Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  type="url"
                  value={formData.image}
                  onChange={handleChange}
                  required
                />
              </div>
              <CardFooter className="px-0">
                <Button
                  type="submit"
                  className="w-full bg-[#d9c8b4] text-[#3c3c3c] hover:bg-[#c9b8a4]"
                >
                  Create Campaign
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
