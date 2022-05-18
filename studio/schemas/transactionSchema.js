export const transactionSchema = {
  name: "transactions",
  title: "Transactions",
  type: "document",
  fields: [
    { name: "txHash", title: "Transaction hash", type: "string" },
    { name: "fromAddress", title: "From (WalletAddress)", type: "string" },
    { name: "toAddress", title: "To (WalletAddress)", type: "string" },
    { name: "amount", title: "Amount", type: "number" },
    { name: "timestamp", title: "Timestamp", type: "datetime" },
  ],
};
