export type UserId = string
export type UserRole = "supervisor" | "manager"

export type User = {
    userId:UserId,
    role:UserRole,
    firstName:string,
    lastName:string
}