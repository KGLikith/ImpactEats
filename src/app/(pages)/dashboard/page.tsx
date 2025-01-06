'use client'
import { useRouter } from 'next/navigation'
import React from 'react'


export default function Page() {
  const router = useRouter();
  router.push('/profile')
  return (
    <div>page</div>
  )
}