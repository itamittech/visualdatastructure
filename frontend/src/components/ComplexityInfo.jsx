import React from 'react'

function ComplexityInfo({ data }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Time & Space Complexity</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Operation</th>
              <th className="px-4 py-2 text-left">Time Complexity</th>
              <th className="px-4 py-2 text-left">Space Complexity</th>
              <th className="px-4 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {data.operations.map((op, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{op.name}</td>
                <td className="px-4 py-2">
                  <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {op.time}
                  </code>
                </td>
                <td className="px-4 py-2">
                  <code className="bg-green-100 text-green-800 px-2 py-1 rounded">
                    {op.space}
                  </code>
                </td>
                <td className="px-4 py-2 text-gray-600 text-sm">
                  {op.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <h3 className="font-bold mb-2">Complexity Notation Guide:</h3>
        <ul className="space-y-1">
          <li><strong>O(1)</strong> - Constant time: Operation takes same time regardless of size</li>
          <li><strong>O(log n)</strong> - Logarithmic time: Time increases logarithmically with size</li>
          <li><strong>O(n)</strong> - Linear time: Time increases linearly with size</li>
          <li><strong>O(n log n)</strong> - Linearithmic time: Common in efficient sorting algorithms</li>
          <li><strong>O(n²)</strong> - Quadratic time: Time increases quadratically with size</li>
        </ul>
      </div>
    </div>
  )
}

export default ComplexityInfo
