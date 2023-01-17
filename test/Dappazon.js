const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

// Global values to be used as item info
const ID = 1;
const NAME = "Shoe";
const CATEGORY = "Closing";
const IMAGE = "IMAGE";
const COST = tokens(1);
const RATING = 4;
const STOCK = 5;

describe("Dappazon", () => {
  let dappazon;
  let deployer;
  let buyer;
  // This block runs before each test
  beforeEach(async () => {
    const Dappazon = await ethers.getContractFactory("Dappazon");
    dappazon = await Dappazon.deploy();
    [deployer, buyer] = await ethers.getSigners();
    // console.log(deployer.address, buyer.address);
  });
  describe("Deployment for Dappazon", () => {
    it("Check if the deployer and the owner have the same address", async () => {
      expect(await dappazon.owner()).to.equal(deployer.address);
    });
  });

  describe("Listing", () => {
    let transactions;
    beforeEach(async () => {
      transactions = await dappazon
        .connect(deployer)
        .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);

      await transactions.wait();

      transactions = await dappazon.connect(buyer).buy(ID, { value: COST });
      await transactions.wait();
    });

    it("Returns item attribute", async () => {
      const itemOne = await dappazon.items(1);
      expect(itemOne.id).to.equal(1);
      expect(itemOne.category).to.equal(CATEGORY);
      // we can test all the attributes if they are equal to the ones we have provided them
    });

    // check if the event is emitted on new item added into mapping
    it("Emits the List event", async () => {
      expect(transactions).to.emit(dappazon, "List");
    });

    it("The value of the dappazone contract ether amount shoud increase!", async () => {
      const amount = await ethers.provider.getBalance(dappazon.address);
      expect(amount).to.equal(COST);
    });
  });
});
