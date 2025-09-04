import z from 'zod'

export const inputSchema=z.object({
    email:z.string().nonempty()
})
