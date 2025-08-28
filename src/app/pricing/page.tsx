'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../../hooks/useAuth'

export default function Pricing() {
  const { isAuthenticated } = useAuth()
  const [isYearly, setIsYearly] = useState(false)

  const plans = [
    {
      name: 'Developer',
      price: '$0',
      yearlyPrice: '$0',
      period: '/month',
      description: 'Perfect for individual developers and small projects',
      features: [
        '10,000 API calls/month',
        '3 MCP servers',
        '2 LLM providers',
        'Basic analytics',
        'Community support',
        'Standard rate limits'
      ],
      cta: 'Get Started Free',
      highlighted: false,
      icon: '🚀'
    },
    {
      name: 'Professional',
      price: '$29',
      yearlyPrice: '$290',
      period: '/month',
      yearlyPeriod: '/year',
      description: 'For growing teams and production applications',
      features: [
        '100,000 API calls/month',
        '10 MCP servers',
        '5 LLM providers',
        'Advanced analytics',
        'Priority support',
        'Higher rate limits',
        'Custom integrations',
        'Team collaboration'
      ],
      cta: 'Start Free Trial',
      highlighted: true,
      icon: '⚡'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      yearlyPrice: 'Custom',
      period: '',
      description: 'For large organizations with custom requirements',
      features: [
        'Unlimited API calls',
        'Unlimited MCP servers',
        'All LLM providers',
        'Custom analytics',
        'Dedicated support',
        'No rate limits',
        'On-premises deployment',
        'Custom SLA',
        'Advanced security',
        'SSO integration'
      ],
      cta: 'Contact Sales',
      highlighted: false,
      icon: '🏢'
    }
  ]

  const features = [
    {
      category: 'Core Platform',
      items: [
        { name: 'MCP Protocol Support', dev: true, pro: true, enterprise: true },
        { name: 'Multi-LLM Integration', dev: true, pro: true, enterprise: true },
        { name: 'API Explorer', dev: true, pro: true, enterprise: true },
        { name: 'Real-time Analytics', dev: 'Basic', pro: 'Advanced', enterprise: 'Custom' },
        { name: 'Rate Limiting', dev: 'Standard', pro: 'Higher', enterprise: 'None' }
      ]
    },
    {
      category: 'LLM Providers',
      items: [
        { name: 'OpenAI GPT Models', dev: true, pro: true, enterprise: true },
        { name: 'Anthropic Claude', dev: true, pro: true, enterprise: true },
        { name: 'Google Gemini', dev: false, pro: true, enterprise: true },
        { name: 'Meta Llama', dev: false, pro: true, enterprise: true },
        { name: 'Custom Models', dev: false, pro: false, enterprise: true }
      ]
    },
    {
      category: 'MCP Servers',
      items: [
        { name: 'Max Active Servers', dev: '3', pro: '10', enterprise: 'Unlimited' },
        { name: 'Custom Servers', dev: false, pro: true, enterprise: true },
        { name: 'Server Monitoring', dev: 'Basic', pro: 'Advanced', enterprise: 'Enterprise' },
        { name: 'Auto-scaling', dev: false, pro: true, enterprise: true }
      ]
    },
    {
      category: 'Support & Security',
      items: [
        { name: 'Support Level', dev: 'Community', pro: 'Priority', enterprise: 'Dedicated' },
        { name: 'SLA Guarantee', dev: false, pro: '99.9%', enterprise: 'Custom' },
        { name: 'SOC 2 Compliance', dev: false, pro: true, enterprise: true },
        { name: 'SSO Integration', dev: false, pro: false, enterprise: true }
      ]
    }
  ]

  const FeatureValue = ({ value }: { value: string | boolean }) => {
    if (typeof value === 'boolean') {
      return value ? (
        <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm font-bold">
          ✓
        </span>
      ) : (
        <span className="text-gray-400 text-lg">—</span>
      )
    }
    return <span className="text-gray-900 dark:text-white font-medium">{value}</span>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8">
              Simple, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Transparent</span> Pricing
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              Scale from prototype to production with flexible plans designed for every stage of your AI journey. 
              All plans include our core MCP protocol support and multi-LLM integration.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-sm font-medium ${!isYearly ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isYearly ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isYearly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${isYearly ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                Yearly
              </span>
              {isYearly && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  Save 20%
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-gray-50 dark:bg-gray-700 rounded-2xl p-8 relative transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  plan.highlighted 
                    ? 'ring-2 ring-blue-500 scale-105 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20' 
                    : ''
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <div className="text-4xl mb-4">{plan.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">
                      {isYearly ? plan.yearlyPrice : plan.price}
                    </span>
                    <span className="text-lg text-gray-600 dark:text-gray-400">
                      {isYearly ? (plan.yearlyPeriod || '') : plan.period}
                    </span>
                    {isYearly && plan.name === 'Professional' && (
                      <div className="text-sm text-green-600 dark:text-green-400 font-medium mt-1">
                        Save $58/year
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <span className="text-blue-500 mr-3 mt-1 flex-shrink-0">✓</span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={isAuthenticated ? "/dashboard" : "/auth"}
                  className={`block w-full py-4 px-6 rounded-xl font-semibold text-center transition-all duration-200 transform hover:scale-105 ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Know
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Compare features across all plans to find the perfect fit for your needs
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600">
              <h3 className="text-2xl font-bold text-white">
                Feature Comparison
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      🚀 Developer
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      ⚡ Professional
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      🏢 Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {features.map((category, categoryIndex) => (
                    <>
                      <tr key={`category-${categoryIndex}`}>
                        <td
                          colSpan={4}
                          className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-sm font-bold text-gray-900 dark:text-white"
                        >
                          {category.category}
                        </td>
                      </tr>
                      {category.items.map((item, itemIndex) => (
                        <tr key={`${categoryIndex}-${itemIndex}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-center">
                            <FeatureValue value={item.dev} />
                          </td>
                          <td className="px-6 py-4 text-sm text-center">
                            <FeatureValue value={item.pro} />
                          </td>
                          <td className="px-6 py-4 text-sm text-center">
                            <FeatureValue value={item.enterprise} />
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to know about our platform and pricing
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                🤖 What is the Model Context Protocol (MCP)?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                MCP is a standardized protocol for connecting AI models with external tools and data sources, 
                enabling more powerful and context-aware AI applications. It allows seamless integration 
                with databases, APIs, and custom tools.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                🔄 Can I change plans anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated 
                and reflected in your next billing cycle. No hidden fees or cancellation penalties.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                🧠 What LLM providers do you support?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We support OpenAI (GPT-4, GPT-3.5), Anthropic (Claude), Google (Gemini), 
                Meta (Llama), and many others. Enterprise plans include support for custom 
                model endpoints and on-premises deployments.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                🆓 Is there a free trial?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Yes! The Developer plan is free forever with 10K API calls per month. 
                Professional plans include a 14-day free trial with full features and no credit card required.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                📊 How does billing work?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We bill monthly or yearly based on your plan. Usage is tracked in real-time, 
                and you'll receive notifications before reaching your limits. Overage charges 
                are clearly displayed in your dashboard.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                🔒 Is my data secure?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Absolutely. We're SOC 2 compliant with end-to-end encryption, regular security audits, 
                and enterprise-grade infrastructure. Your data is never used to train models or 
                shared with third parties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your AI Workflow?
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-12">
            Join thousands of developers and teams who are building faster, smarter, and more efficiently 
            with Polydev AI. Start your journey today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              href={isAuthenticated ? "/dashboard" : "/auth"}
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Start Free Today →
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200"
            >
              Contact Sales
            </Link>
          </div>

          <div className="text-blue-100 text-sm">
            ✓ Free 14-day trial  ✓ No setup fees  ✓ Cancel anytime
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-12 border-t border-blue-400/20">
            <p className="text-blue-200 mb-6">Trusted by developers at</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-70">
              <div className="text-white font-bold text-lg">TechCorp</div>
              <div className="text-white font-bold text-lg">StartupXYZ</div>
              <div className="text-white font-bold text-lg">InnovateLab</div>
              <div className="text-white font-bold text-lg">DataSystems</div>
              <div className="text-white font-bold text-lg">AIForward</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}