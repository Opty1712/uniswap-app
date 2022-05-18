import type { NextPage } from 'next'
import { Header } from '../components/Header'
import { Main } from '../components/Main'
import { TransactionHistory } from '../components/TransactionHistory'

const Home: NextPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-around',
      }}
    >
      <Header />
      <Main />
      <TransactionHistory />
    </div>
  )
}

export default Home
