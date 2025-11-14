import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  const learningPath = [
    {
      step: 1,
      title: 'Introduction',
      description: 'Start your journey! Learn what this platform offers and how to use it effectively.',
      path: '/introduction',
      icon: '🎯',
      color: 'from-blue-500 to-blue-600',
      borderColor: 'border-blue-500',
      time: '5 min read'
    },
    {
      step: 2,
      title: 'Understanding Complexity',
      description: 'Master Big O notation, time complexity, and amortized analysis. Essential foundation!',
      path: '/complexity',
      icon: '📊',
      color: 'from-purple-500 to-purple-600',
      borderColor: 'border-purple-500',
      time: '15 min read'
    },
    {
      step: 3,
      title: 'Array',
      description: 'Contiguous memory, O(1) access, O(n) insertion. Learn when arrays shine!',
      path: '/array',
      icon: '📦',
      color: 'from-green-500 to-green-600',
      borderColor: 'border-green-500',
      time: '20 min'
    },
    {
      step: 4,
      title: 'Linked List',
      description: 'Pointer-based structure, O(1) insert at head, O(n) access. Perfect for dynamic data!',
      path: '/linkedlist',
      icon: '🔗',
      color: 'from-yellow-500 to-yellow-600',
      borderColor: 'border-yellow-500',
      time: '20 min'
    },
    {
      step: 5,
      title: 'Hash Set',
      description: 'O(1) lookup magic! Learn hash functions, collisions, and why sets are so fast.',
      path: '/set',
      icon: '⚡',
      color: 'from-orange-500 to-orange-600',
      borderColor: 'border-orange-500',
      time: '20 min'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg shadow-2xl p-12">
        <h1 className="text-5xl font-bold mb-4">
          Visual Data Structures
        </h1>
        <p className="text-2xl mb-6 opacity-90">
          Master Data Structures Through Interactive Learning
        </p>
        <p className="text-lg opacity-80 max-w-3xl mx-auto">
          Follow our guided path from basics to mastery. Each step builds on the previous,
          with interactive visualizations, step-by-step animations, and detailed explanations.
        </p>
      </div>

      {/* Learning Path */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Guided Learning Path</h2>
          <span className="ml-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
            Recommended for Students
          </span>
        </div>

        <p className="text-gray-600 mb-8 text-lg">
          Follow this path sequentially for the best learning experience. Each topic builds on concepts from previous steps.
        </p>

        <div className="space-y-6">
          {learningPath.map((item, index) => (
            <div key={item.step}>
              <Link
                to={item.path}
                className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 border-l-4 hover:scale-[1.02] transform duration-200"
                style={{ borderLeftColor: item.borderColor.replace('border-', '') }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-6 flex-1">
                    {/* Step Number */}
                    <div className={`bg-gradient-to-br ${item.color} w-16 h-16 rounded-lg flex items-center justify-center shrink-0 shadow-lg`}>
                      <span className="text-white text-3xl font-bold">{item.step}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-3xl">{item.icon}</span>
                        <h3 className="text-2xl font-bold text-gray-800">{item.title}</h3>
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-gray-600 text-lg">{item.description}</p>
                    </div>

                    {/* Arrow */}
                    <div className="text-gray-400 text-3xl self-center">
                      →
                    </div>
                  </div>
                </div>
              </Link>

              {/* Connector Line */}
              {index < learningPath.length - 1 && (
                <div className="flex justify-center my-4">
                  <div className="w-1 h-8 bg-gradient-to-b from-gray-300 to-gray-100"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Or Jump to Any Topic</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/complexity"
            className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border-2 border-purple-200"
          >
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Complexity Guide</h3>
            <p className="text-gray-600">Big O notation & analysis</p>
          </Link>

          <Link
            to="/array"
            className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border-2 border-green-200"
          >
            <div className="text-4xl mb-3">📦</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Array</h3>
            <p className="text-gray-600">Contiguous memory structure</p>
          </Link>

          <Link
            to="/linkedlist"
            className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border-2 border-yellow-200"
          >
            <div className="text-4xl mb-3">🔗</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Linked List</h3>
            <p className="text-gray-600">Pointer-based structure</p>
          </Link>

          <Link
            to="/set"
            className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border-2 border-orange-200"
          >
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Hash Set</h3>
            <p className="text-gray-600">O(1) lookup performance</p>
          </Link>
        </div>
      </div>

      {/* Features Highlight */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          What Makes This Platform Special
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-5xl mb-3">🎬</div>
            <h3 className="font-bold text-gray-800 mb-2">Step-by-Step</h3>
            <p className="text-sm text-gray-600">
              Watch operations execute one step at a time with explanations
            </p>
          </div>

          <div className="text-center">
            <div className="text-5xl mb-3">📈</div>
            <h3 className="font-bold text-gray-800 mb-2">Complexity Proofs</h3>
            <p className="text-sm text-gray-600">
              Visual demonstrations of why operations have their complexity
            </p>
          </div>

          <div className="text-center">
            <div className="text-5xl mb-3">💻</div>
            <h3 className="font-bold text-gray-800 mb-2">Code Examples</h3>
            <p className="text-sm text-gray-600">
              Both scratch implementations and Java library usage
            </p>
          </div>

          <div className="text-center">
            <div className="text-5xl mb-3">🎓</div>
            <h3 className="font-bold text-gray-800 mb-2">Learning Mode</h3>
            <p className="text-sm text-gray-600">
              Interactive mode with operation counting and detailed feedback
            </p>
          </div>
        </div>
      </div>

      {/* Stats / Impact */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">3</div>
          <div className="text-gray-600">Data Structures</div>
          <div className="text-sm text-gray-500 mt-1">With more coming soon</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">15+</div>
          <div className="text-gray-600">Operations Visualized</div>
          <div className="text-sm text-gray-500 mt-1">Insert, delete, search & more</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
          <div className="text-gray-600">Interactive</div>
          <div className="text-sm text-gray-500 mt-1">Learn by doing, not just reading</div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg shadow-xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
        <p className="text-xl mb-6 opacity-90">
          Begin with the Introduction or jump straight to Complexity Analysis
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/introduction"
            className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg transition-colors shadow-lg"
          >
            Start from Beginning
          </Link>
          <Link
            to="/complexity"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-3 rounded-lg font-bold text-lg transition-colors shadow-lg"
          >
            Learn Complexity First
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
