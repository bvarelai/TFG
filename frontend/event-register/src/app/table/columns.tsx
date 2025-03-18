"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Inscription = {
  event_id: number
  inscription_description: string
  inscription_date : string
}

export const columns: ColumnDef<Inscription>[] = [
  {
    accessorKey: "event_id",
    header: "ID",
  },
  {
    accessorKey: "inscription_description",
    header: "Description",
  },
  {
    accessorKey: "inscription_date",
    header: "Date",
  },
]
