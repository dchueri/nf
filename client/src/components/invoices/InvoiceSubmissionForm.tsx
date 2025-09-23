import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { DocumentTextIcon } from '@heroicons/react/24/outline'
import { Modal } from '../ui/Modal'
import { TextField } from '../ui/TextField'
import { MonthPicker } from '../ui/MonthPicker'
import { FileUpload } from '../ui/FileUpload'
import { Button } from '../ui/Button'
import { FeedbackMessage } from '../ui/FeedbackMessage'
import {
  invoiceSubmissionSchema,
  validateFile,
  validateInvoiceNumber,
  validateMonth,
  type InvoiceSubmissionData
} from '../../schemas/invoiceSchemas'
import { invoiceService } from '../../services/invoiceService'
import dayjs from 'dayjs'

interface InvoiceSubmissionFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const InvoiceSubmissionForm: React.FC<InvoiceSubmissionFormProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<Partial<InvoiceSubmissionData>>({
    invoiceNumber: '',
    referenceMonth: dayjs().format('YYYY-MM')
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const { uploadInvoice } = invoiceService

  // Validação em tempo real para feedback imediato
  const validateField = useCallback((field: string, value: any) => {
    let error: string | null = null

    switch (field) {
      case 'file':
        error = validateFile(value)
        break
      case 'invoiceNumber':
        error = validateInvoiceNumber(value || '')
        break
      case 'month':
        error = validateMonth(value || '')
        break
    }

    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error! }))
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }, [])

  const handleFileSelect = useCallback(
    (file: File) => {
      setSelectedFile(file)
      validateField('file', file)
      setSubmitError(null)
    },
    [validateField]
  )

  const handleFileRemove = useCallback(() => {
    setSelectedFile(null)
    validateField('file', null)
  }, [validateField])

  const handleInvoiceNumberChange = useCallback(
    (value: string) => {
      const handledValue = value.replace(/\D/g, '')
      setFormData((prev) => ({ ...prev, invoiceNumber: handledValue }))
      validateField('invoiceNumber', handledValue)
      setSubmitError(null)
    },
    [validateField]
  )

  const handleMonthChange = useCallback(
    (month: string) => {
      setFormData((prev) => ({ ...prev, month }))
      validateField('month', month)
      setSubmitError(null)
    },
    [validateField]
  )

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {}

    // Validar arquivo
    const fileError = validateFile(selectedFile)
    if (fileError) {
      newErrors.file = fileError
    }

    // Validar número da nota fiscal
    const invoiceNumberError = validateInvoiceNumber(
      formData.invoiceNumber || ''
    )
    if (invoiceNumberError) {
      newErrors.invoiceNumber = invoiceNumberError
    }

    // Validar mês
    const monthError = validateMonth(formData.referenceMonth || '')
    if (monthError) {
      newErrors.month = monthError
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [selectedFile, formData.invoiceNumber, formData.referenceMonth])

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return
    }

    if (!selectedFile || !formData.invoiceNumber || !formData.referenceMonth) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const uploadData = {
        invoiceNumber: formData.invoiceNumber,
        referenceMonth: formData.referenceMonth
      }

      await uploadInvoice(selectedFile, uploadData)

      setSubmitSuccess(true)

      // Fechar modal após 2 segundos
      setTimeout(() => {
        setSubmitSuccess(false)
        onSuccess?.()
        onClose()
        // Reset form
        setFormData({
          invoiceNumber: '',
          referenceMonth: dayjs().format('YYYY-MM')
        })
        setSelectedFile(null)
        setErrors({})
      }, 2000)
    } catch (error) {
      console.error('Erro ao enviar nota fiscal:', error)
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Erro ao enviar nota fiscal. Tente novamente.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }, [validateForm, selectedFile, formData, uploadInvoice, onSuccess, onClose])

  const handleClose = useCallback(() => {
    if (isSubmitting) return

    onClose()
    // Reset form
    setFormData({
      invoiceNumber: '',
      referenceMonth: dayjs().format('YYYY-MM')
    })
    setSelectedFile(null)
    setErrors({})
    setSubmitError(null)
    setSubmitSuccess(false)
  }, [isSubmitting, onClose])

  const isFormValid =
    selectedFile &&
    formData.invoiceNumber &&
    formData.referenceMonth &&
    Object.keys(errors).length === 0

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Enviar Nota Fiscal"
      subtitle="Preencha os dados da sua nota fiscal mensal"
      icon={<DocumentTextIcon className="h-6 w-6 text-blue-600" />}
      size="lg"
      disabled={isSubmitting}
    >
      <div className="space-y-6">
        {/* Success Message */}
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <FeedbackMessage
              type="success"
              title="Nota fiscal enviada com sucesso!"
              message="Te vejo no mês que vem! 🤝"
            />
          </motion.div>
        )}

        {/* Error Message */}
        {submitError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <FeedbackMessage
              type="error"
              title="Erro ao enviar nota fiscal"
              message={submitError}
            />
          </motion.div>
        )}

        {/* Form Fields */}
        {!submitSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arquivo da Nota Fiscal *
              </label>
              <FileUpload
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
                selectedFile={selectedFile}
                error={errors.file}
                disabled={isSubmitting}
              />
              <p className="mt-1 text-xs text-gray-500">
                Formatos aceitos: PDF, XML • Tamanho máximo: 10MB
              </p>
            </div>

            {/* Invoice Number */}
            <TextField
              label="Número da Nota Fiscal *"
              value={formData.invoiceNumber || ''}
              onChange={handleInvoiceNumberChange}
              placeholder="001"
              error={errors.invoiceNumber}
              disabled={isSubmitting}
              id="invoice-number"
              autoComplete="off"
              spellCheck={false}
            />

            {/* Month */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mês de Competência *
              </label>
              <MonthPicker
                selectedMonth={
                  formData.referenceMonth || dayjs().format('YYYY-MM')
                }
                onMonthChange={handleMonthChange}
                className={errors.month ? 'border-red-300' : ''}
              />
              {errors.month && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                  aria-live="polite"
                >
                  {errors.month}
                </motion.p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Selecione o mês de referência da nota fiscal
              </p>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        {!submitSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end space-x-3 pt-4 border-t border-gray-200"
          >
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
              type="button"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              loading={isSubmitting}
              type="button"
              leftIcon={
                !isSubmitting ? (
                  <DocumentTextIcon className="h-4 w-4" />
                ) : undefined
              }
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Nota Fiscal'}
            </Button>
          </motion.div>
        )}
      </div>
    </Modal>
  )
}
