import { useContext, useState } from 'react'
import { TransactionContext } from '../context/TransactionContext'

export const Header = () => {
  const [nav, setNav] = useState('swap')
  const { currentAccount, connectWallet } = useContext(TransactionContext)

  return (
    <div>
      <span
        onClick={() => setNav('swap')}
        style={{ fontWeight: nav === 'swap' ? 'bold' : 'normal' }}
      >
        Swap
      </span>{' '}
      |{' '}
      <span
        onClick={() => setNav('pool')}
        style={{ fontWeight: nav === 'pool' ? 'bold' : 'normal' }}
      >
        Pool
      </span>{' '}
      |{' '}
      <span
        onClick={() => setNav('vote')}
        style={{ fontWeight: nav === 'vote' ? 'bold' : 'normal' }}
      >
        Vote
      </span>
      <br />
      <br />
      <select style={{ border: '1px solid blue' }}>
        <option selected>Ethereum</option>
      </select>
      <div style={{ background: 'aqua' }}>
        {currentAccount ? (
          <div>{currentAccount}</div>
        ) : (
          <div onClick={() => connectWallet()}>ConnectWallet</div>
        )}
      </div>
      <select style={{ border: '1px solid blue' }}>
        <option selected>...</option>
        <option>Ethereum</option>
      </select>
    </div>
  )
}
