import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  const dataStructures = [
    {
      name: 'Array',
      description: 'A collection of elements stored at contiguous memory locations',
      path: '/array',
      color: 'bg-blue-500'
    },
    {
      name: 'Linked List',
      description: 'A linear data structure where elements are linked using pointers',
      path: '/linkedlist',
      color: 'bg-green-500'
    },
    {
      name: 'Set',
      description: 'A collection of unique elements with no duplicates',
      path: '/set',
      color: 'bg-purple-500'
    }
  ]

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Visual Data Structure
        </h1>
        <p className="text-xl text-gray-600">
          Learn and visualize how data structures work with interactive animations
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {dataStructures.map((ds) => (
          <Link
            key={ds.name}
            to={ds.path}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6"
          >
            <div className={`${ds.color} w-16 h-16 rounded-lg mb-4 flex items-center justify-center`}>
              <span className="text-white text-2xl font-bold">
                {ds.name[0]}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {ds.name}
            </h2>
            <p className="text-gray-600">
              {ds.description}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Features</h2>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Interactive visualizations of data structure operations
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Time and space complexity analysis
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Both scratch implementations and library-provided implementations
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Real-time code execution and animation
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Home
