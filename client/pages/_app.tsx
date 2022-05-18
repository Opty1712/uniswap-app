import { AppProps } from 'next/app'
import { TransactionProvider } from '../context/TransactionContext'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TransactionProvider>
      <Component {...pageProps} />
    </TransactionProvider>
  )
}

export default MyApp
