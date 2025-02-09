import Toolbar from '@/components/layouts/toolbar'
import React, { ReactNode } from 'react'

const WorspaceLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='bg-muted/50'>
        <div className="grid gap-4 grid-cols-[3rem_1fr] p-2">
            <Toolbar />

            <div className="bg-background">
                {children}
            </div>
        </div>
      
    </div>
  )
}

export default WorspaceLayout
