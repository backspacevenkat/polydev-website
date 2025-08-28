export default function Features() {
  const features = [
    {
      category: 'Model Context Protocol (MCP)',
      items: [
        {
          title: 'Universal Tool Integration',
          description: 'Connect any AI model to external tools, databases, and APIs through standardized MCP servers.',
          icon: '🔌'
        },
        {
          title: 'Real-time Data Access',
          description: 'Enable AI models to access live data from multiple sources simultaneously.',
          icon: '⚡'
        },
        {
          title: 'Custom MCP Servers',
          description: 'Build and deploy custom MCP servers tailored to your specific use cases and requirements.',
          icon: '⚙️'
        },
        {
          title: 'Server Monitoring',
          description: 'Monitor server health, performance metrics, and usage patterns in real-time.',
          icon: '📊'
        }
      ]
    },
    {
      category: 'Multi-LLM Platform',
      items: [
        {
          title: 'Provider Agnostic',
          description: 'Switch between OpenAI, Anthropic, Google, Meta, and custom models seamlessly.',
          icon: '🔄'
        },
        {
          title: 'Model Comparison',
          description: 'Compare responses from different models side-by-side for optimal results.',
          icon: '⚖️'
        },
        {
          title: 'Intelligent Routing',
          description: 'Automatically route requests to the best model based on task type and requirements.',
          icon: '🎯'
        },
        {
          title: 'Cost Optimization',
          description: 'Optimize costs by routing to the most cost-effective model for each task.',
          icon: '💰'
        }
      ]
    },
    {
      category: 'Developer Experience',
      items: [
        {
          title: 'Interactive API Explorer',
          description: 'Test and debug API endpoints with a comprehensive playground interface.',
          icon: '🔍'
        },
        {
          title: 'SDK & Libraries',
          description: 'Official SDKs for Python, JavaScript, Go, and other popular languages.',
          icon: '📚'
        },
        {
          title: 'WebSocket Support',
          description: 'Real-time bidirectional communication for streaming responses and live updates.',
          icon: '🔗'
        },
        {
          title: 'Comprehensive Docs',
          description: 'Detailed documentation with examples, tutorials, and best practices.',
          icon: '📖'
        }
      ]
    },
    {
      category: 'Analytics & Monitoring',
      items: [
        {
          title: 'Usage Analytics',
          description: 'Track API usage, costs, and performance metrics across all your applications.',
          icon: '📈'
        },
        {
          title: 'Real-time Dashboards',
          description: 'Monitor system health, response times, and error rates in real-time.',
          icon: '📺'
        },
        {
          title: 'Custom Alerts',
          description: 'Set up alerts for usage thresholds, errors, and performance anomalies.',
          icon: '🚨'
        },
        {
          title: 'Audit Logs',
          description: 'Complete audit trail of all API calls and system events for compliance.',
          icon: '📋'
        }
      ]
    },
    {
      category: 'Security & Compliance',
      items: [
        {
          title: 'Enterprise Security',
          description: 'SOC 2 compliance, encryption at rest and in transit, and advanced access controls.',
          icon: '🔒'
        },
        {
          title: 'API Key Management',
          description: 'Granular API key permissions with rate limiting and usage controls.',
          icon: '🔑'
        },
        {
          title: 'SSO Integration',
          description: 'Single sign-on integration with popular identity providers.',
          icon: '🎫'
        },
        {
          title: 'Data Privacy',
          description: 'GDPR and CCPA compliant data handling with configurable retention policies.',
          icon: '🛡️'
        }
      ]
    },
    {
      category: 'Scalability & Performance',
      items: [
        {
          title: 'Auto-scaling',
          description: 'Automatic scaling of MCP servers based on demand and usage patterns.',
          icon: '📈'
        },
        {
          title: 'Global CDN',
          description: 'Distributed infrastructure for low-latency access from anywhere in the world.',
          icon: '🌍'
        },
        {
          title: 'Caching Layer',
          description: 'Intelligent caching to reduce latency and costs for repeated requests.',
          icon: '⚡'
        },
        {
          title: 'Load Balancing',
          description: 'Distribute requests across multiple servers for optimal performance.',
          icon: '⚖️'
        }
      ]
    }
  ]

  const integrations = [
    { name: 'OpenAI', logo: '🤖', description: 'GPT-4, GPT-3.5, DALL-E, Whisper' },
    { name: 'Anthropic', logo: '🧠', description: 'Claude 3.5 Sonnet, Haiku, Opus' },
    { name: 'Google AI', logo: '🔍', description: 'Gemini Pro, PaLM, Bard' },
    { name: 'Meta', logo: '🦙', description: 'Llama 2, Code Llama' },
    { name: 'Cohere', logo: '💬', description: 'Command, Embed, Rerank' },
    { name: 'Hugging Face', logo: '🤗', description: 'Open source models' },
    { name: 'Replicate', logo: '🔄', description: 'Custom model deployment' },
    { name: 'Together AI', logo: '🤝', description: 'Optimized inference' }
  ]

  const useCases = [
    {
      title: 'AI Assistants',
      description: 'Build intelligent assistants with access to real-time data and external tools.',
      example: 'Customer support bot with CRM integration'
    },
    {
      title: 'Data Analysis',
      description: 'Enable AI models to query databases, analyze files, and generate insights.',
      example: 'SQL query generation and execution'
    },
    {
      title: 'Content Generation',
      description: 'Create content with access to multiple data sources and formatting tools.',
      example: 'Blog posts with real-time research'
    },
    {
      title: 'Workflow Automation',
      description: 'Automate complex workflows by chaining multiple AI models and tools.',
      example: 'Invoice processing and approval'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Platform Features
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Everything you need to build, deploy, and scale AI applications with 
            the Model Context Protocol and multi-LLM integration.
          </p>
        </div>

        {/* Feature Categories */}
        {features.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              {category.category}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {category.items.map((feature, featureIndex) => (
                <div
                  key={featureIndex}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start">
                    <div className="text-3xl mr-4 flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Integrations */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Supported LLM Providers
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl mb-2">{integration.logo}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {integration.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {integration.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Common Use Cases
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {useCase.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {useCase.description}
                </p>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Example:</span>
                  <span className="text-sm text-gray-900 dark:text-white ml-2">
                    {useCase.example}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture Diagram */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Platform Architecture
          </h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <div className="text-center">
              <div className="flex justify-center items-center space-x-8 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4">
                  <div className="font-semibold text-blue-900 dark:text-blue-100">
                    Your Application
                  </div>
                </div>
                <div className="text-2xl">→</div>
                <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4">
                  <div className="font-semibold text-green-900 dark:text-green-100">
                    Polydev API
                  </div>
                </div>
                <div className="text-2xl">→</div>
                <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-4">
                  <div className="font-semibold text-purple-900 dark:text-purple-100">
                    LLM Providers
                  </div>
                </div>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-2xl">↕</div>
              </div>
              
              <div className="bg-orange-100 dark:bg-orange-900 rounded-lg p-4 inline-block">
                <div className="font-semibold text-orange-900 dark:text-orange-100">
                  MCP Servers & Tools
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
              <p>
                Simple API integration with powerful MCP protocol for tool access 
                and multi-LLM provider support
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build with Polydev?
          </h2>
          <p className="text-xl text-blue-100 mb-6">
            Start building powerful AI applications with MCP and multi-LLM integration today.
          </p>
          <div className="space-x-4">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Get Started Free
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
              View Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}