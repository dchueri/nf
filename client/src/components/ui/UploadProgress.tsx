import React from 'react'
import { motion } from 'framer-motion'
import { CloudArrowUpIcon } from '@heroicons/react/24/outline'

interface UploadProgressProps {
  progress?: number
  fileName?: string
  className?: string
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  progress = 0,
  fileName,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Icon with Animation */}
      <div className="flex justify-center">
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="p-4 bg-blue-100 rounded-full"
        >
          <CloudArrowUpIcon className="h-8 w-8 text-blue-600" />
        </motion.div>
      </div>

      {/* Progress Text */}
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Enviando nota fiscal...
        </h3>
        {fileName && (
          <p className="text-sm text-gray-600 mb-4">
            {fileName}
          </p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-blue-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Progress Percentage */}
      <div className="text-center">
        <span className="text-sm font-medium text-gray-700">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Loading Dots */}
      <div className="flex justify-center space-x-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-blue-600 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  )
}
