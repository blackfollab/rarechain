'use client'

import { useEffect, useState } from 'react'
import { ethers, Eip1193Provider } from 'ethers'
import { getUserInvestments } from '../../../utils/web3'

type Investment = {
  planId: number
  amount: string
  startTime: number
  withdrawn: boolean
  completed: boolean
}

export default function HistoryPage() {
  const [investments, setInvestments] = useState<Investment[]>([])

  useEffect(() => {
    const load = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum as unknown as Eip1193Provider)
        const signer = await provider.getSigner()
        const user = await signer.getAddress()

        const data = await getUserInvestments(user)
        const formattedData: Investment[] = data.map((i: {
          planId: number | string
          amount: bigint
          startTime: number | string
          withdrawn: boolean
          completed: boolean
        }) => ({
          planId: Number(i.planId),
          amount: ethers.formatEther(i.amount),
          startTime: Number(i.startTime),
          withdrawn: Boolean(i.withdrawn),
          completed: Boolean(i.completed),
        }))
        setInvestments(formattedData)
      } else {
        console.error("Ethereum provider not found")
      }
    }

    load()
  }, [])

  return (
    <div className="p-8 text-white bg-black min-h-screen">
      <h1 className="text-2xl mb-4">Activation History</h1>
      <table className="w-full border-collapse border border-gray-700">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-2 border">Plan</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Start</th>
            <th className="p-2 border">Withdrawn</th>
            <th className="p-2 border">Completed</th>
          </tr>
        </thead>
        <tbody>
          {investments.map((inv, i) => (
            <tr key={i} className="text-center">
              <td className="p-2 border">Plan {inv.planId}</td>
              <td className="p-2 border">{inv.amount}</td>
              <td className="p-2 border">
                {new Date(inv.startTime * 1000).toLocaleString()}
              </td>
              <td className="p-2 border">{inv.withdrawn ? '✅' : '❌'}</td>
              <td className="p-2 border">{inv.completed ? '✅' : '⏳'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
