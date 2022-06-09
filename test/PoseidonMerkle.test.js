const { expect } = require("chai");
const { ethers } = require("hardhat");
const { buildPoseidon, poseidonContract } =  require("circomlibjs");
const poseidon = require("../helpers/poseidon.js");
const assert = require('assert');

describe("PoseidonMerkle smart contract test", function () {
    let account
    let poseidon2;
    let poseidon4;
    let poseidon5;
    let poseidonBuilder;
    let poseidonMerkle;
    this.timeout(100000);

    before(async () => {
        [account] = await ethers.getSigners();
        poseidonBuilder = await buildPoseidon();
    })

    it("Deploys the hashing contracts", async () => {
        const P2 = new ethers.ContractFactory(
            poseidonContract.generateABI(2),
            poseidonContract.createCode(2),
            account
        );
        const P4 = new ethers.ContractFactory(
            poseidonContract.generateABI(4),
            poseidonContract.createCode(4),
            account
        );
        const P5 = new ethers.ContractFactory(
            poseidonContract.generateABI(5),
            poseidonContract.createCode(5),
            account
        );

        poseidon2 = await P2.deploy();
        poseidon4 = await P4.deploy();
        poseidon5 = await P5.deploy();

        console.log(poseidon2.address)
    });

    it("Calculates the Poseidon hash correctly", async () => {

        const res2 = await poseidon2["poseidon(uint256[2])"]([1,2]);
        const res4 = await poseidon4["poseidon(uint256[4])"]([1,2,3,4]);
        const res5 = await poseidon5["poseidon(uint256[5])"]([1,2,3,4,5]);

        const pos2 = poseidon([1,2]);
        const pos4 = poseidon([1,2,3,4]);
        const pos5 = poseidon([1,2,3,4,5]);

        assert.equal(res2.toString(), pos2.toString());
        assert.equal(res4.toString(), pos4.toString());
        assert.equal(res5.toString(), pos5.toString());

    })

    it("Deploys the PoseidonMerkle contract", async () => {
        var PoseidonMerkle = await ethers.getContractFactory("PoseidonMerkle")
        poseidonMerkle = await PoseidonMerkle.deploy(
            poseidon2.address,
            poseidon4.address,
            poseidon5.address
        )
    })

    it("Calculates the Poseidon hash correctly from the contract", async () => {
        const res2 = await poseidonMerkle.hashPoseidon([1,2]);
        const res4 = await poseidonMerkle.hashPoseidon([1,2,3,4]);
        const res5 = await poseidonMerkle.hashPoseidon([1,2,3,4,5]);

        const pos2 = poseidon([1,2]);
        const pos4 = poseidon([1,2,3,4]);
        const pos5 = poseidon([1,2,3,4,5]);

        assert.equal(res2.toString(), pos2.toString());
        assert.equal(res4.toString(), pos4.toString());
        assert.equal(res5.toString(), pos5.toString());
    })

    it("Gets a root from provided proof and position", async () => {
        const root1 = await poseidonMerkle.getRootFromProof(
            
        )
    })

})