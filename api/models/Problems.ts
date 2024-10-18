export type ProblemId = string

export type Problem = {
    id:ProblemId,
    object:string,
    description?:string,
    date?:string,
}