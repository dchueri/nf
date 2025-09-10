import { useState } from 'react'
import { InviteValidation } from '../../components/auth/FirstAccess/InviteValidation'
import { DefinePassword } from '../../components/auth/FirstAccess/DefinePassword'
import { Confirmation } from '../../components/auth/FirstAccess/Confirmation'
import { motion } from 'framer-motion'

export const FirstAccess = () => {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')

  const handleNextStep = () => {
    setStep(step + 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 sm:px-6 lg:px-8 flex flex-col justify-center">
      {step === 1 && <InviteValidation handleNextStep={handleNextStep} setEmail={setEmail} />}
      {step === 2 && <DefinePassword handleNextStep={handleNextStep} email={email} />}
      {step === 3 && <Confirmation email={email} />}

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Central de Notas PJ. Todos os direitos
            reservados.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
