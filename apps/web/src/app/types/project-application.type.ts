export type Application = {
    id: string
    fullName: string
    code: string
    motivation: string
    contacted: boolean
    status: "pending" | "approved" | "rejected"
}