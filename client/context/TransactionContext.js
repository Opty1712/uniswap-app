import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { createContext, useEffect, useState } from 'react'
import { contractABI, contractAddress } from '../lib/constants'
import { client } from '../lib/sanityClient'

export const TransactionContext = createContext()
const eth = typeof window !== 'undefined' && window.ethereum

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(eth)
  const signer = provider.getSigner()
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  )

  return transactionContract
}

export const TransactionProvider = ({ children }) => {
  const router = useRouter()
  const [currentAccount, setCurrentAccount] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ addressTo: '', amount: '' })

  useEffect(() => {
    if (!currentAccount) {
      return
    }
    ;(async () => {
      const userDoc = {
        _type: 'users',
        _id: currentAccount,
        userName: 'Unnamed',
        address: currentAccount,
      }

      await client.createIfNotExists(userDoc)
    })()
  }, [currentAccount])

  useEffect(() => {
    checkWalletIsConnected()
  }, [])

  useEffect(() => {
    if (isLoading) {
      router.push(`/?loading=${currentAccount}`)
    } else {
      router.push(`/`)
    }
  }, [currentAccount, isLoading])

  const connectWallet = async (metamask = eth) => {
    try {
      if (!metamask) {
        return alert('install metamask')
      }
      const accounts = await metamask.request({ method: 'eth_requestAccounts' })
      setCurrentAccount(accounts[0])
    } catch (e) {
      console.error(e)
      throw new Error('no eth obj')
    }
  }

  const checkWalletIsConnected = async (metamask = eth) => {
    try {
      if (!metamask) {
        return alert('install metamask')
      }
      const accounts = await metamask.request({ method: 'eth_accounts' })

      if (accounts.length) {
        setCurrentAccount(accounts[0])
        console.log('wallet is connected')
      }
    } catch (e) {
      console.error(e)
      throw new Error('no eth obj')
    }
  }

  const sendTransaction = async (
    metamask = eth,
    connectedAccount = currentAccount
  ) => {
    try {
      if (!metamask) {
        return alert('install metamask')
      }
      const { addressTo, amount } = formData
      const transactionContract = getEthereumContract()

      const parsedAmount = ethers.utils.parseEther(amount)

      await metamask.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: connectedAccount,
            to: addressTo,
            gas: '0x7EF40',
            value: parsedAmount._hex,
          },
        ],
      })

      const transactionHash = await transactionContract.publishTransaction(
        addressTo,
        parsedAmount,
        `Transfer ETH ${parsedAmount} to addres ${addressTo}`,
        'TRANSFER'
      )

      setIsLoading(true)
      await transactionHash.wait()

      // DB
      await saveTransaction(
        transactionHash.hash,
        amount,
        connectedAccount,
        addressTo
      )

      setIsLoading(false)
    } catch (e) {
      console.error(e)
      throw new Error('no eth obj')
    }
  }

  const handleChange = (e, name) => {
    setFormData((v) => ({ ...v, [name]: e.target.value }))
  }

  const saveTransaction = async (
    txHash,
    amount,
    fromAddress = currentAccount,
    toAddress
  ) => {
    const txDoc = {
      _type: 'transactions',
      _id: txHash,
      fromAddress,
      toAddress,
      timestamp: new Date(Date.now()).toISOString(),
      txHash,
      amount: parseFloat(amount),
    }

    await client.createIfNotExists(txDoc)

    await client
      .patch(currentAccount)
      .setIfMissing({ transactions: [] })
      .insert('after', 'transactions[-1]', [
        {
          _key: txHash,
          _ref: txHash,
          _type: 'reference',
        },
      ])
      .commit()

    return
  }

  return (
    <TransactionContext.Provider
      value={{
        currentAccount,
        connectWallet,
        sendTransaction,
        handleChange,
        formData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}
