'use client'

import { motion, Variants } from 'framer-motion'
import Image from 'next/image'


const stepVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
}

const Process = () => {
  return (
    <section className="w-full py-20 px-6 bg-[#fefbfa]">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Step 1 - Stake */}
        <motion.div
          className="flex flex-col items-center text-center"
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stepVariant}
        >
          <div className="w-20 h-20 rounded-full border border-gray-300 flex items-center justify-center mb-4">
            <Image src="/assets/bnb-icon.png" alt="ETH" width={32} height={32} />
          </div>
          <h3 className="text-3xl font-semibold tracking-tight">Deposit</h3>
          <p className="text-sm text-gray-700 mt-1 font-bold">BNB</p>
        </motion.div>

        {/* Line 1 */}
        <motion.div
          className="hidden lg:block border-t border-black h-0 w-12"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />

        {/* Step 2 - Receive */}
        <motion.div
          className="flex flex-col items-center text-center"
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stepVariant}
        >
          <div className="w-20 h-20 rounded-full border border-gray-300 flex items-center justify-center mb-4">
            <Image src="/assets/receive.png" alt="stETH" width={32} height={32} />
          </div>
          <h3 className="text-3xl font-semibold tracking-tight">Run Node</h3>
          <p className="text-sm text-gray-700 mt-1 font-bold">Accumulate rewards</p>
        </motion.div>

        {/* Line 2 */}
        <motion.div
          className="hidden lg:block border-t border-black h-0 w-12"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        />

        {/* Step 3 - Use */}
        <motion.div
          className="flex flex-col items-center text-center"
          custom={2}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stepVariant}
        >
          <div className="flex items-center mb-4 space-x-[-10px]">
            <div className="w-12 h-12 rounded-full border border-gray-300 overflow-hidden bg-white">
              <Image src="/assets/aave-icon.png" alt="Aave" width={48} height={48} />
            </div>
            <div className="w-12 h-12 rounded-full border border-gray-300 overflow-hidden bg-white">
              <Image src="/assets/1inch-icon.png" alt="1inch" width={48} height={48} />
            </div>
            <div className="w-12 h-12 rounded-full border border-gray-300 overflow-hidden bg-white">
              <Image src="/assets/curve-icon.png" alt="Curve" width={48} height={48} />
            </div>
          </div>
          <h3 className="text-3xl font-semibold tracking-tight">Withdraw</h3>
          <p className="text-sm text-gray-700 mt-1 font-bold">Rewards To Wallet</p>
          <div className="mt-2 text-sm text-black font-medium hover:underline cursor-pointer">
            Explore <span className="inline-block translate-y-0.5">↓</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Process