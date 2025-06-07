import React from 'react'

function FailurePage() {
  return (
    <div className="p-8 text-center">
    <h1 className="text-3xl font-bold text-red-600">El pago falló</h1>
    <p className="mt-4 text-gray-700">Hubo un problema al procesar tu pago. Intentá nuevamente.</p>
  </div>
  )
}

export default FailurePage
  