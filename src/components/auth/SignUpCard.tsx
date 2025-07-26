import React from 'react'
import { useForm, FormProvider, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import AsyncSelect from 'react-select/async'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'

import { useRegisterMutation, useLoginMutation } from '../../services/api/authApi.js'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form.tsx'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group.tsx'
import { Input } from '../ui/input.tsx'
import { Button } from '../ui/button.tsx'
import { AiFillRocket } from 'react-icons/ai'
import { toast } from '../ui/use-toast.tsx'

const signUpFormSchema = z.object({
  role: z.enum(['TENANT', 'OWNER'], { required_error: 'Role required' }),
  propertyId: z.preprocess(
    v => typeof v === 'object' && v !== null && 'value' in (v as any) ? (v as any).value : v,
    z.string().min(1, { message: 'Select a property' })
  ),
  unitIds: z.preprocess(
    v => Array.isArray(v) ? v.map(u => typeof u === 'object' && u !== null && 'value' in u ? u.value : u) : v,
    z.array(z.string()).min(1, { message: 'Select at least one unit' })
  ),
  first_name: z.string().min(1, { message: 'Please enter your first name' }),
  last_name: z.string().min(1, { message: 'Please enter your last name' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  code: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.role === 'TENANT') {
    if (data.unitIds.length !== 1) {
      ctx.addIssue({ code: 'custom', path: ['unitIds'], message: 'Tenants must select exactly one unit' })
    }
    if (data.code) {
      ctx.addIssue({ code: 'custom', path: ['code'], message: 'Code is not allowed for tenants' })
    }
  }
  if (data.role === 'OWNER' && data.code === '') {
    data.code = undefined as any
  }
}).superRefine(({ password }, ctx) => {
  const containsUppercase = (ch: string) => /[A-Z]/.test(ch)
  const containsLowercase = (ch: string) => /[a-z]/.test(ch)
  let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0
  for (let i = 0; i < password.length; i++) {
    const ch = password.charAt(i)
    if (!isNaN(+ch)) countOfNumbers++
    else if (containsUppercase(ch)) countOfUpperCase++
    else if (containsLowercase(ch)) countOfLowerCase++
  }
  if (countOfLowerCase < 1 || countOfUpperCase < 1 || countOfNumbers < 1) {
    ctx.addIssue({ code: 'custom', path: ['password'], message: 'Please use at least one uppercase, one lowercase letter and one number' })
  }
})

export type SignUpValues = z.infer<typeof signUpFormSchema>

export const SignUpCard = () => {
  const navigate = useNavigate()
  const [registerUser, { isLoading }] = useRegisterMutation()
  const [loginUser, { isLoading: loginLoading }] = useLoginMutation()

  const methods = useForm<SignUpValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      role: 'TENANT',
      propertyId: '',
      unitIds: [],
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      code: ''
    }
  })

  // watch role to conditionally render owner-specific fields

  const onSubmit = async (values: SignUpValues) => {
    const payload = {
      role: values.role,
      propertyId: (values.propertyId as any)?.value || values.propertyId,
      unitIds: (values.unitIds as any[]).map(u => (u as any)?.value || u),
      code: values.code || undefined,
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      password: values.password
    }
    try {
      await registerUser(payload as any).unwrap()
      const loginRes = await loginUser({ email: values.email, password: values.password })
      if ('data' in loginRes) navigate('/home')
    } catch (err: any) {
      const message = err?.data?.message || 'Something went wrong'
      toast({ title: 'Error', description: message, variant: 'error' })
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen rounded-xl shadow-inner">
      <Card className="shadow-2xl flex w-fit flex-col p-5">
        <CardHeader className="flex flex-col justify-center items-center py-10">
          <AiFillRocket className="w-12 h-12" />
          <CardTitle className="text-3xl">Welcome!</CardTitle>
          <p className="text-muted-foreground">Please enter your details to sign up.</p>
        </CardHeader>
        <CardContent className="w-[275px] md:w-[350px]">
          <FormProvider {...methods}>
            <Form {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-y-4 w-full">
                <div className="space-y-4">
                  <FormField control={methods.control} name="role" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
                          <RadioGroupItem value="TENANT" id="r1" />
                          <FormLabel htmlFor="r1" className="mr-4">Tenant</FormLabel>
                          <RadioGroupItem value="OWNER" id="r2" />
                          <FormLabel htmlFor="r2">Owner</FormLabel>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={methods.control} name="first_name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={methods.control} name="last_name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={methods.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={methods.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {/* Property selector */}
                  <FormField
                    control={methods.control}
                    name="propertyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property</FormLabel>
                        <FormControl>
                          <AsyncSelect
                            cacheOptions
                            defaultOptions
                            loadOptions={async input => {
                              const res = await fetch(`/api/properties${input ? '?search=' + input : ''}`)
                              const json = await res.json()
                              const list = Array.isArray(json.data) ? json.data : json
                              return list.map(p => ({
                                label: p.title ?? p.name ?? p.street,
                                value: p.id.toString(),
                              }))
                            }}
                            onChange={opt => field.onChange(opt?.value || '')}
                            value={field.value ? { label: '…', value: field.value } : null}
                            placeholder="Search properties..."
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />

                  {/* Unit selector */}
                  <FormField
                    control={methods.control}
                    name="unitIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit{methods.watch('role')==='OWNER'?'s':''}</FormLabel>
                        <FormControl>
                          <AsyncSelect
                            cacheOptions
                            defaultOptions
                            isMulti={methods.watch('role') === 'OWNER'}
                            loadOptions={async () => {
                              const pid = methods.watch('propertyId')
                              const res = await fetch(`/api/properties/${pid}/units`)
                              const json = await res.json()
                              const list = Array.isArray(json.data) ? json.data : json
                              return list.map(u => ({
                                label: u.unitNumber ?? u.name ?? u.unitIdentifier,
                                value: u.id.toString(),
                              }))
                            }}
                            onChange={opts => {
                              const vals =
                                Array.isArray(opts)
                                  ? (opts as Array<{ label: string; value: string }>).map(o => o.value)
                                  : opts && "value" in opts
                                    ? [(opts as { label: string; value: string }).value]
                                    : [];
                              field.onChange(vals)
                            }}
                            value={
                              Array.isArray(field.value)
                                ? field.value.map(v => ({ label: '…', value: v }))
                                : []
                            }
                            placeholder="Search units..."
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />

                  {methods.watch('role') === 'OWNER' && (
                    <>
                      {/* Owner name preview */}
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input
                            disabled
                            value={`${methods.watch('first_name')} ${methods.watch('last_name')}`}
                          />
                        </FormControl>
                      </FormItem>

                      {/* Overwrite code */}
                      <FormField
                        control={methods.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Overwrite Code (optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Admin code to overwrite owner" {...field} />
                            </FormControl>
                            <FormMessage/>
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>

                <Button type="submit" className="w-full mt-4">
                  Sign Up
                </Button>

              </form>
            </Form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUpCard
