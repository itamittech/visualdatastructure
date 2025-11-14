import React, { useState, useEffect } from 'react'

/**
 * Component that visualizes step-by-step execution of operations
 * Shows iteration count and explains why complexity is what it is
 */
function OperationVisualizer({ operation, steps, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1)
      }, 800)
      return () => clearTimeout(timer)
    } else if (currentStep === steps.length - 1) {
      setIsPlaying(false)
      if (onComplete) onComplete()
    }
  }, [isPlaying, currentStep, steps.length, onComplete])

  if (!steps || steps.length === 0) return null

  const handlePlay = () => {
    if (currentStep === steps.length - 1) {
      setCurrentStep(0)
    }
    setIsPlaying(true)
  }

  const handlePause = () => setIsPlaying(false)
  const handleReset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
  }

  const currentStepData = steps[currentStep]

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-2 border-blue-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-blue-600">
          Step-by-Step: {operation}
        </h3>
        <div className="text-sm font-semibold text-gray-600">
          Step {currentStep + 1} / {steps.length}
          <span className="ml-2 text-orange-600">
            (Operations: {currentStepData?.operationCount || 0})
          </span>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="bg-gray-50 rounded-lg p-6 mb-4 min-h-[200px]">
        <div className="text-center mb-4">
          <div className="text-lg font-semibold text-gray-700 mb-2">
            {currentStepData?.description}
          </div>
          {currentStepData?.code && (
            <div className="bg-gray-800 text-green-400 font-mono text-sm p-3 rounded inline-block">
              {currentStepData.code}
            </div>
          )}
        </div>

        {/* Visual representation */}
        <div className="flex justify-center items-center space-x-2 flex-wrap">
          {currentStepData?.visualization?.map((item, index) => (
            <div
              key={index}
              className={`
                w-16 h-16 border-2 flex items-center justify-center font-bold text-lg
                transition-all duration-300 rounded
                ${item.highlight ? 'bg-yellow-300 border-yellow-600 scale-110 shadow-lg' :
                  item.checked ? 'bg-blue-100 border-blue-400' :
                  item.target ? 'bg-green-200 border-green-500' :
                  'bg-gray-100 border-gray-300'}
              `}
            >
              {item.value}
            </div>
          ))}
        </div>

        {/* Explanation */}
        {currentStepData?.explanation && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-3">
            <div className="text-sm text-blue-900">
              <strong>💡 Why this step:</strong> {currentStepData.explanation}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-3 mb-4">
        {!isPlaying ? (
          <button
            onClick={handlePlay}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold"
          >
            {currentStep === steps.length - 1 ? 'Replay' : 'Play'}
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Pause
          </button>
        )}
        <button
          onClick={handleReset}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold"
        >
          Reset
        </button>
        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            disabled={isPlaying}
          >
            ← Back
          </button>
        )}
        {currentStep < steps.length - 1 && (
          <button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            disabled={isPlaying}
          >
            Next →
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Complexity Summary */}
      {currentStep === steps.length - 1 && (
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-green-700">
                ✓ Operation Complete!
              </div>
              <div className="text-sm text-gray-700 mt-1">
                Total operations: <strong>{currentStepData.operationCount}</strong>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Time Complexity</div>
              <div className="text-2xl font-bold text-green-600">
                {currentStepData.complexity}
              </div>
            </div>
          </div>
          {currentStepData.complexityExplanation && (
            <div className="mt-3 text-sm text-gray-700 bg-white p-3 rounded">
              <strong>Why {currentStepData.complexity}?</strong> {currentStepData.complexityExplanation}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default OperationVisualizer
