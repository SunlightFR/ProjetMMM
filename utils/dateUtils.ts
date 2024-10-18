export const MORNING = 0
export const AFTERNOON = 12

export function getEndDate(start:Date, duration:number){
    let hours = (duration-1)*12
    let result = new Date(start);
    result.setHours(result.getHours()+hours)

    return result;
}

export function areDatesNotOverlapping(date1:Date, duration1:number, date2:Date, duration2:number){
    const endDate1 = getEndDate(date1, duration1);
    const endDate2 = getEndDate(date2, duration2);

    return date1 > endDate2 || date2 > endDate1
}