export default function Pricing() {
  const plans = [
    {
      name: 'Developer',
      price: '$0',
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
      highlighted: false
    },
    {
      name: 'Professional',
      price: '$29',
      period: '/month',
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
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
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
      highlighted: false
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
        <span className="text-green-600">✓</span>
      ) : (
        <span className="text-gray-400">—</span>
      )
    }
    return <span className="text-gray-900 dark:text-white">{value}</span>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Choose the plan that fits your needs. All plans include our core MCP protocol support 
            and multi-LLM integration capabilities.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 relative ${
                plan.highlighted 
                  ? 'ring-2 ring-blue-500 transform scale-105' 
                  : ''
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {plan.period}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1 flex-shrink-0">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  plan.highlighted
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Feature Comparison
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Feature
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Developer
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Professional
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {features.map((category, categoryIndex) => (
                  <>
                    <tr key={`category-${categoryIndex}`}>
                      <td
                        colSpan={4}
                        className="px-6 py-4 bg-gray-100 dark:bg-gray-700 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {category.category}
                      </td>
                    </tr>
                    {category.items.map((item, itemIndex) => (
                      <tr key={`${categoryIndex}-${itemIndex}`}>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
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

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                What is the Model Context Protocol (MCP)?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                MCP is a standardized protocol for connecting AI models with external tools and data sources, 
                enabling more powerful and context-aware AI applications.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated 
                and reflected in your next billing cycle.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                What LLM providers do you support?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We support OpenAI, Anthropic, Google, Meta, and many others. Enterprise plans 
                include support for custom model endpoints.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! The Developer plan is free forever, and Professional plans include a 
                14-day free trial with full features.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-blue-600 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-6">
            Join thousands of developers building the future with MCP and multi-LLM integration.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Start Free Trial
          </button>
        </div>
      </div>
    </div>
  )
}