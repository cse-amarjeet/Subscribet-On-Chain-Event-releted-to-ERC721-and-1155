const Web3 = require("web3");
const web3 = new Web3(
  "wss://mainnet.infura.io/ws/v3/ab96c17dd6c54eb1bfa870b737fc3679"
);

let options721 = {
  topics: [web3.utils.sha3("Transfer(address,address,uint256)")],
};

let options1155 = {
  topics: [
    web3.utils.sha3("TransferSingle(address,address,address,uint256,uint256)"),
  ],
};

let subscription721 = web3.eth.subscribe("logs", options721);
let subscription1155 = web3.eth.subscribe("logs", options1155);

subscription721.on("data", (event) => {
  if (event.topics.length == 4) {
    let transaction = web3.eth.abi.decodeLog(
      [
        {
          type: "address",
          name: "from",
          indexed: true,
        },
        {
          type: "address",
          name: "to",
          indexed: true,
        },
        {
          type: "uint256",
          name: "tokenId",
          indexed: true,
        },
      ],
      event.data,
      [event.topics[1], event.topics[2], event.topics[3]]
    );

    if (transaction.from == "0x495f947276749ce646f68ac8c248420045cb7b5e") {
      console.log("Specified address sent an NFT!");
    }
    if (transaction.to == "0x495f947276749ce646f68ac8c248420045cb7b5e") {
      console.log("Specified address received an NFT!");
    }
    if (
      event.address == "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D" &&
      transaction.tokenId == 2500
    ) {
      console.log("Specified NFT was transferred!");
    }

    console.log(
      `\n` +
        `New ERC-712 transaction found in block ${event.blockNumber} with hash ${event.transactionHash}\n` +
        `From: ${
          transaction.from === "0x0000000000000000000000000000000000000000"
            ? "New mint!"
            : transaction.from
        }\n` +
        `To: ${transaction.to}\n` +
        `Token contract: ${event.address}\n` +
        `Token ID: ${transaction.tokenId}`
    );
  }
});

subscription1155.on("data", (event) => {
  let transaction = web3.eth.abi.decodeLog(
    [
      {
        type: "address",
        name: "operator",
        indexed: true,
      },
      {
        type: "address",
        name: "from",
        indexed: true,
      },
      {
        type: "address",
        name: "to",
        indexed: true,
      },
      {
        type: "uint256",
        name: "id",
      },
      {
        type: "uint256",
        name: "value",
      },
    ],
    event.data,
    [event.topics[1], event.topics[2], event.topics[3]]
  );

  console.log(
    `\n` +
      `New ERC-1155 transaction found in block ${event.blockNumber} with hash ${event.transactionHash}\n` +
      `Operator: ${transaction.operator}\n` +
      `From: ${
        transaction.from === "0x0000000000000000000000000000000000000000"
          ? "New mint!"
          : transaction.from
      }\n` +
      `To: ${transaction.to}\n` +
      `id: ${transaction.id}\n` +
      `value: ${transaction.value}`
  );
});

subscription721.on("error", (err) => {
  throw err;
});
subscription1155.on("error", (err) => {
  throw err;
});

subscription721.on("connected", (nr) =>
  console.log("Subscription on ERC-721 started with ID %s", nr)
);
subscription1155.on("connected", (nr) =>
  console.log("Subscription on ERC-1155 started with ID %s", nr)
);
