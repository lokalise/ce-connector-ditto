import z from 'zod'

export const structuredComponentsResponse = z.record(
  z.string(),
  z.object({
    name: z.string(),
    text: z.string(),
    folder: z.string().nullable(),
    variants: z
      .record(
        z.string(),
        z.object({
          text: z.string(),
        }),
      )
      .optional(),
  }),
)
