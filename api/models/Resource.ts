export type ResourceId = string
export type ResourceType = "vehicle" | "staff" | "tools" | string

export type Resource = {
    id:ResourceId,
    name:string,
    type:ResourceType
}

export type ResourceWithAvailability = Resource & {
    available:boolean
}