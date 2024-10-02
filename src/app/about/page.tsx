import React from "react";

import { Bitcoin, Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function page() {
  return (
    <div className="min-h-screen bg-[#f5e6d3] text-[#3c3c3c] ">
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">About BlockFund</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="mb-4">
            BlockFund is a revolutionary blockchain-powered crowdfunding
            platform that aims to democratize fundraising for innovative
            projects. We believe in the power of decentralized technology to
            connect visionary creators with a global community of supporters.
          </p>
          <p>
            Our mission is to provide a transparent, secure, and efficient
            platform where groundbreaking ideas can find the backing they need
            to become reality. By leveraging blockchain technology, we ensure
            that every transaction is traceable, immutable, and free from
            intermediaries.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Why Choose BlockFund?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                All transactions are recorded on the blockchain, providing full
                transparency to backers.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
              </CardHeader>
              <CardContent>
                Smart contracts ensure that funds are only released when
                predefined conditions are met.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Global Reach</CardTitle>
              </CardHeader>
              <CardContent>
                Connect with supporters from around the world, unrestricted by
                geographical boundaries.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Lower Fees</CardTitle>
              </CardHeader>
              <CardContent>
                By eliminating intermediaries, we can offer lower fees compared
                to traditional platforms.
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sakshi Patil",
                image: "/placeholder.svg?height=100&width=100",
              },
              {
                name: "Snehal Patil",
                image: "/placeholder.svg?height=100&width=100",
              },
              {
                name: "Swastik Patil",
                image: "/placeholder.svg?height=100&width=100",
              },
            ].map((member) => (
              <Card key={member.name}>
                <CardContent className="flex flex-col items-center p-6">
                  {/* <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full mb-4" /> */}
                  <h3 className="font-semibold">{member.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
          <p className="mb-4">
            Be part of the blockchain revolution in crowdfunding. Whether{" "}
            {"you're"} a creator with a groundbreaking idea or a supporter
            looking to back the next big thing, BlockFund is your platform.
          </p>
          <div className="flex space-x-4">
            <Button className="bg-[#d9c8b4] text-[#3c3c3c] hover:bg-[#c9b8a4]">
              Start a Campaign
            </Button>
            <Button
              variant="outline"
              className="border-[#3c3c3c] text-[#3c3c3c]"
            >
              Explore Projects
            </Button>
          </div>
          <div>
            <h3 className="text-lg font-semibold mt-8 mb-4">
              See All Transations at Cardona
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://cardona-zkevm.polygonscan.com/"
                target="_blank"
                className="underline underline-offset-8 hover:bg-white hover:text-black"
              >
                Click Here
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
