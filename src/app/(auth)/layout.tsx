import React, { ReactNode } from 'react'

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen grid place-items-center">
        {children}
    </div>
  )
}

export default AuthLayout;
