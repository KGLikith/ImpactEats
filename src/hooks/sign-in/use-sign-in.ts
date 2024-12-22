'use client'
// import { useToast } from '@/components/ui/use-toast'
import { UserLoginProps, UserLoginSchema } from '@/schemas/auth.schema'
import { useSignIn } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useToast } from '../use-toast'

export const useSignInForm = () => {
  const { isLoaded, setActive, signIn } = useSignIn()
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const { toast } = useToast()
  const methods = useForm<UserLoginProps>({
    resolver: zodResolver(UserLoginSchema),
    mode: 'onChange',
  })
  const onHandleSubmit = methods.handleSubmit(
    async (values: UserLoginProps) => {
      if (!isLoaded) return
      console.log("hello")
      try {
        setLoading(true)
        console.log(values.email , values.password)
        const authenticated = await signIn.create({
          identifier: values.email,
          password: values.password,
        })

        if (authenticated.status === 'complete') {
          await setActive({ session: authenticated.createdSessionId })
          toast({
            title: 'Success',
            description: 'Welcome back!',
          })
          router.push('/profile')
        }
      } catch (error: any) {
        setLoading(false)
        console.log(error.errors[0].code)
        if (error.errors[0].code === 'form_password_incorrect')
          toast({
            title: 'Error',
            description: 'email/password is incorrect try again',
          })
      }
    }
  )

  return {
    methods,
    onHandleSubmit,
    loading,
  }
}
