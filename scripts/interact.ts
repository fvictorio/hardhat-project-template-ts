// An example script that shows how to interact programmatically with a deployed contract
// You must customise it according to your contract's specifications
import { ethers } from "hardhat";

async function main() {
  const address = "0xDfD1Bab99dDcEFfE42EB35cc2F838159953c64c2"; // Specify here your contract address
  const contract = await ethers.getContractAt("Greeter", address); // Specify here your contract name

  ////////////////
  //  PAYLOAD  //
  //////////////

  const newGreeting = "Buongiorno!"; // Specify here the payload of the to-be-called function

  ////////////////
  //  SENDING  //
  //////////////

  const tx = await contract.setGreeting(newGreeting); // Specify here the to-be-called function name
  console.log("The transaction hash is:", tx.hash);
  const receipt = await tx.wait(); // wait until the transaction is confirmed
  console.log(
    "The transaction returned the following transaction receipt:\n",
    receipt,
  );
}

// To run it, invoke `npx hardhat run scripts/interact.ts --network <network_name>`
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
