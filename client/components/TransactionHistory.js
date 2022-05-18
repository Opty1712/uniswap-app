import { useContext, useEffect, useState } from 'react'
import { TransactionContext } from '../context/TransactionContext'
import { client } from '../lib/sanityClient'

export const TransactionHistory = () => {
  const { isLoading, currentAccount } = useContext(TransactionContext)
  const [transactionHistory, setTransactionHistory] = useState([])

  useEffect(() => {
    ;(async () => {
      if (!isLoading && currentAccount) {
        const query = `
          *[_type == "users" && _id == "${currentAccount}"] {
            "transactionList": transactions[] -> {amount, toAddress, timestamp, txHash}|order(timestamp desc)[0..4]
          }
        `
        const clientRes = await client.fetch(query)
        setTransactionHistory(clientRes[0].transactionList)
      }
    })()
  }, [isLoading, currentAccount])

  return (
    <div>
      {(transactionHistory || []).map((transaction, index) => (
        <div key={index}>
          {transaction.amount} | {transaction.timestamp} |{' '}
          {transaction.toAddress} |{' '}
          <a
            href={`https://rinkeby.etherscan.io/tx/${transaction.txHash}`}
            style={{ textDecoration: 'underline' }}
          >
            {transaction.txHash}
          </a>
          <hr />
        </div>
      ))}
    </div>
  )
}
