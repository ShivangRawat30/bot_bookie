import Link from 'next/link'
import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
// import ConnectBtn from './ConnectBtn'

const Header: React.FC = () => {
  return (
    <div className="shadow-sm shadow-blue-900 py-4 text-blue-700">
      <div className="lg:w-2/3 w-full mx-auto flex justify-between items-center flex-wrap">
        <Link href={'/'} className="text-2xl mb-2">
          <span className="text-black">BookieBot</span>
        </Link>

        <div className="flex justify-end items-center space-x-2 md:space-x-4 mt-2 md:mt-0">
          <ConnectButton />
        </div>
      </div>
    </div>
  )
}

export default Header