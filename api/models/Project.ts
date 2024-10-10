import {UserId} from "@/api/models/User";
import {ResourceId} from "@/api/models/Resource";
import {ProblemId} from "@/api/models/Problems";

export type ProjectId = string
export type ProjectStatus = ""

export type Project = {
    id:ProjectId,
    object:string,
    manager_id:UserId,
    supervisor_id:UserId,
    resources:ResourceId[],
    problems:ProblemId[],
    status:ProjectStatus,
    start:Date,
    end:Date,
    location:string,
    clientNumber:string,
}