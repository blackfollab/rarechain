'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Variants, Easing } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useLogin } from '@privy-io/react-auth'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as Easing,
    },
  }),
}

const Features = () => {
  const router = useRouter()
  const { login } = useLogin()

  const handleLogin = async () => {
    try {
      await login()
      router.push('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <section className="w-full flex flex-col lg:flex-row bg-gradient-to-r from-[#eaf6ff] to-[#f3edfe] px-6 py-20">
      {/* Left */}
      <motion.div
        className="flex-1 flex flex-col justify-center items-start text-left px-4 lg:px-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0}
      >
        <h1 className="text-6xl lg:text-[88px] font-semibold leading-none tracking-tight text-black">
          RCN
        </h1>
        <p className="text-lg text-black mt-6 max-w-md">
          Operate Node Networks for a specified duration, earning rewards as commissions from your node. On The Binance Chain
        </p>
      </motion.div>

      {/* Center Icon */}
      <motion.div
        className="my-12 lg:my-0 lg:mx-8 flex items-center justify-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={1}
      >
        <div className="w-24 h-24 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center">
          <Image src="/assets/bnb-icon.png" alt="stETH Icon" width={40} height={40} />
        </div>
      </motion.div>

      {/* Right */}
      <motion.div
        className="flex-1 flex flex-col justify-center items-start px-4 lg:px-16 text-left"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={2}
      >
        <h2 className="text-4xl lg:text-5xl font-semibold leading-tight text-black">
          Secure and <br className="hidden lg:block" />
          battle tested
        </h2>
        <p className="text-gray-600 mt-2">
          $2,488,269,120 rewards paid since 2020
        </p>

        <motion.div
          className="mt-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={3}
        >
          <h2 className="text-4xl lg:text-5xl font-semibold leading-tight text-black">
            Competitive <br className="hidden lg:block" />
            rewards, deep liquidity
          </h2>
          <p className="text-gray-600 mt-2">
            Run Nodes on Binance Smart Chain, Earn Rewards on the go
          </p>
        </motion.div>

        {/* Icons & Button */}
        <motion.div
          className="flex items-center mt-8 space-x-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={4}
        >
          <div className="w-12 h-12 rounded-full border border-gray-300 bg-white flex items-center justify-center">
            <Image src="/assets/aave-icon.png" alt="Aave" width={32} height={32} />
          </div>
          <div className="w-12 h-12 rounded-full border border-gray-300 bg-white flex items-center justify-center">
            <Image src="/assets/1inch-icon.png" alt="1inch" width={32} height={32} />
          </div>
          <button
            onClick={handleLogin}
            className="text-white bg-black border h-12 px-6 font-medium rounded-full transition-all duration-300 transform hover:translate-y-1"
          >
            Connect Wallet
          </button>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Features
