'use client'

import { motion } from 'framer-motion'

export default function DisclaimerPage() {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="card p-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">📋 Disclaimer</h1>
            <p className="text-gray-600">Important legal information about the Booster NFT Collection Platform</p>
          </div>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">🇨🇭 Swiss Quality Standards</h2>
              <p className="leading-relaxed">
                The Booster NFT Collection Platform operates under Swiss quality standards and regulatory frameworks. 
                All smart contracts and platform features are designed with security, transparency, and user protection in mind.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">⚠️ Risk Disclosure</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  <strong>Cryptocurrency and NFT Trading:</strong> Trading NFTs involves substantial risk and may result in the loss of your invested capital. 
                  You should not invest more than you can afford to lose.
                </p>
                <p className="leading-relaxed">
                  <strong>Market Volatility:</strong> NFT prices are highly volatile and can fluctuate significantly in short periods. 
                  Past performance does not guarantee future results.
                </p>
                <p className="leading-relaxed">
                  <strong>Smart Contract Risk:</strong> While our smart contracts are audited and tested, there is always a risk of bugs, 
                  vulnerabilities, or exploits that could result in loss of funds.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">🔒 Security & Privacy</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  <strong>Wallet Security:</strong> You are responsible for the security of your wallet and private keys. 
                  Never share your private keys or seed phrases with anyone.
                </p>
                <p className="leading-relaxed">
                  <strong>Data Protection:</strong> We follow Swiss data protection laws and implement industry-standard security measures 
                  to protect your personal information and transaction data.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">📜 Legal Framework</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  <strong>Regulatory Compliance:</strong> Our platform operates in compliance with applicable Swiss financial regulations 
                  and international standards for digital asset trading.
                </p>
                <p className="leading-relaxed">
                  <strong>Tax Obligations:</strong> Users are responsible for understanding and complying with their local tax obligations 
                  related to NFT trading and cryptocurrency transactions.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">🌱 Energy & Sustainability</h2>
              <p className="leading-relaxed">
                The Booster platform promotes sustainable energy solutions through our NFT collection. 
                We are committed to environmental responsibility and support renewable energy initiatives.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">📞 Contact Information</h2>
              <div className="space-y-2">
                <p className="leading-relaxed">
                  <strong>Support:</strong> For technical support or questions about the platform, please contact our support team.
                </p>
                <p className="leading-relaxed">
                  <strong>Legal:</strong> For legal inquiries, please consult with qualified legal professionals familiar with 
                  cryptocurrency and blockchain regulations.
                </p>
              </div>
            </section>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
              </p>
              <p className="text-sm text-blue-800 mt-2">
                By using the Booster NFT Collection Platform, you acknowledge that you have read, understood, and agree to this disclaimer.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
} 