import { useRouter } from 'next/router'
import { useContext } from 'react'
import Modal from 'react-modal'
import { TransactionContext } from '../context/TransactionContext'

Modal.setAppElement('#__next')

export const Main = () => {
  const router = useRouter()

  const {
    currentAccount,
    connectWallet,
    sendTransaction,
    handleChange,
    formData,
  } = useContext(TransactionContext)

  const { addressTo, amount } = formData

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!addressTo || !amount) {
      return
    }

    sendTransaction()
  }

  return (
    <div>
      <div>SWAP</div>
      <input
        type="text"
        placeholder="0.00"
        pattern="^[0-9]*[.,]?[0-9]*$"
        onChange={(e) => handleChange(e, 'amount')}
        style={{ border: '1px solid blue' }}
      />
      <select style={{ border: '1px solid blue' }}>
        <option selected>ETH</option>
      </select>
      <input
        type="text"
        placeholder="0x...."
        onChange={(e) => handleChange(e, 'addressTo')}
        style={{ border: '1px solid blue' }}
      />
      <button onClick={(e) => handleSubmit(e)} style={{ background: 'aqua' }}>
        Confirm
      </button>

      <Modal isOpen={Boolean(router.query.loading)}>loader</Modal>
    </div>
  )
}
