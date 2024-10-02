import { getContract, resolveMethod, prepareContractCall } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { client } from "../client";

export const contract = getContract({
  client,
  chain: defineChain(2442),
  address: "0x28D9C656412Cae187F41EBA53101488d813f736d",
});
