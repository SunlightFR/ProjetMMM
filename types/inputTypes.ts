import {UserId} from "@/api/models/User";
import {ResourceId, ResourceType} from "@/api/models/Resource";
import {ProblemId} from "@/api/models/Problems";
import {ProjectId, ProjectStatus} from "@/api/models/Project";

export type ProjectInput = {
    object:string,
    manager_id:UserId,
    supervisor_id:UserId,
    resources:ResourceId[],
    status:ProjectStatus,
    start:Date,
    duration:number,
    location:string,
    clientNumber:string,
}

export type ResourceInput = {
    name:string,
    type:ResourceType
}