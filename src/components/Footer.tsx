export default function Footer() {
  return (
    <footer className="bg-[#FFFCFC] text-[#5E5E5E] px-4 md:px-16 py-10 border-t">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* About */}
        <div>
          <h2 className="text-xl font-light mb-4">About</h2>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow">
              {/* <img src="/icons/discord.svg" alt="Discord" className="w-6 h-6" /> */}
            </div>
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow">
              {/* <img src="/icons/telegram.svg" alt="Telegram" className="w-6 h-6" /> */}
            </div>
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow">
              {/* <img src="/icons/x.svg" alt="X" className="w-6 h-6" /> */}
            </div>
          </div>
          <ul className="space-y-2 text-black">
            <li>RareChain Connect</li>
            <li>Opportunities</li>
            <li className="flex items-center">Press Kit <span className="ml-1">↓</span></li>
          </ul>
        </div>

        {/* Analytics */}
        <div>
          <h2 className="text-xl font-light mb-4">Analytics</h2>
          <ul className="space-y-2 text-black">
            <li>All-in-one Rarechain Analytics</li>
            <li>Rarechain Morning Coffee</li>
            <li>(w)BNB in DeFi</li>
          </ul>
        </div>

        {/* Developers */}
        <div>
          <h2 className="text-xl font-light mb-4">Developers</h2>
          <ul className="space-y-2 text-black">
            <li>GitHub</li>
            <li>Bug Bounty</li>
            <li>Audits</li>
            <li>Rare tokens integration guide</li>
            <li>SDK</li>
            <li>Docs</li>
          </ul>
        </div>

        {/* Learn */}
        <div>
          <h2 className="text-xl font-light mb-4">Learn</h2>
          <ul className="space-y-2 text-black">
            <li>Help Center</li>
            <li>FAQ</li>
            <li>Blog</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row items-center justify-between text-sm text-[#999]">
        <div className="flex items-center space-x-2 mb-4 sm:mb-0">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
            <span className="text-[#6EE7F9] text-sm font-bold">V3</span>
          </div>
          <span className="text-black text-lg tracking-widest">RARECHAIN</span>
        </div>
        <div className="space-x-4">
          <a href="#">Privacy Notice</a>
          <a href="#">Terms Of Use</a>
        </div>
      </div>
    </footer>
  );
}
