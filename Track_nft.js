//wss://goerli.infura.io/ws/v3/ab96c17dd6c54eb1bfa870b737fc3679 (end point infura)
const Web3 = require("web3");
const web3 = new Web3(
  "wss://mainnet.infura.io/ws/v3/ab96c17dd6c54eb1bfa870b737fc3679"
);

//filtering the event based on the ERC721 and ERC1155
let options721 = {
  topics: [web3.utils.sha3("Transfer(address,address,uint256)")],
};

let options1155 = {
  topics: [
    web3.utils.sha3("TransferSingle(address,address,address,uint256,uint256)"),
  ],
};
//subscraption of event
let subscription721 = web3.eth.subscribe("logs", options721);
let subscription1155 = web3.eth.subscribe("logs", options1155);

//test that subscraption of event working or not
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

//printing ERC1155 event by checking number of return parameter
subscription721.on("data", (event) => {
  if (event.topics.length == 4) {
    //ABI of ERC-721
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
    console.log(
      `\n` +
        `New ERC-721 transaction found in block ${event.blockNumber} with hash ${event.transactionHash}\n` +
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
