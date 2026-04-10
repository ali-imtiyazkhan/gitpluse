import { cn } from '@/lib/utils'
import React from 'react'

const Divider = ({ className }: { className?: string }) => {
  return (
    <div className={cn('w-full h-px bg-[#252525]', className)}></div>
  )
}

export default Divider