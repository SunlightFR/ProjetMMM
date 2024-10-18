import {expect} from "@jest/globals";
import {AFTERNOON, areDatesNotOverlapping, getEndDate, MORNING} from "@/utils/dateUtils";

describe('getEndDate', ()=>{
    test("", ()=>{
        const start = new Date(2024, 10, 17, MORNING);
        const duration = 1
        const expected = new Date(2024, 10, 17, MORNING);
        expect(getEndDate(start, duration)).toEqual(expected);
    })

    test("",()=>{
        const start = new Date(2024, 10, 15, MORNING);
        const duration = 2;
        const expected = new Date(2024, 10, 15,AFTERNOON);
        expect(getEndDate(start, duration)).toEqual(expected);
    })

    test("",()=>{
        const start = new Date(2024, 6, 15, AFTERNOON);
        const duration = 1;
        const expected = new Date(2024, 6,15,AFTERNOON);
        expect(getEndDate(start, duration)).toEqual(expected);
    })

    test("",()=>{
        const start = new Date(2024, 6, 15, AFTERNOON);
        const duration = 2;
        const expected = new Date(2024, 6,16,MORNING);
        expect(getEndDate(start, duration)).toEqual(expected);
    })
})

describe("areDatesNotOverlapping", ()=>{
    test("Dates consécutives", ()=>{
        const date1 = new Date(2024, 6, 15, AFTERNOON);
        const duration1 = 2
        const date2 = new Date(2024, 6, 16, AFTERNOON);
        const duration2 = 30
        expect(areDatesNotOverlapping(date1, duration1, date2, duration2)).toEqual(true);
    })

    test("Dates consécutives sym", ()=>{
        const date1 = new Date(2024, 6, 15, AFTERNOON);
        const duration1 = 2
        const date2 = new Date(2024, 6, 16, AFTERNOON);
        const duration2 = 30
        expect(areDatesNotOverlapping(date2, duration2, date1, duration1)).toEqual(true);
    })


    test("Dates consécutives le même jour", ()=>{
        const date1 = new Date(2024, 6, 15, MORNING);
        const duration1 = 1
        const date2 = new Date(2024, 6, 15, AFTERNOON);
        const duration2 = 30
        expect(areDatesNotOverlapping(date1, duration1, date2, duration2)).toEqual(true);
    })

    test("Dates consécutives le même jour sym", ()=>{
        const date1 = new Date(2024, 6, 15, MORNING);
        const duration1 = 1
        const date2 = new Date(2024, 6, 15, AFTERNOON);
        const duration2 = 30
        expect(areDatesNotOverlapping(date2, duration2, date1, duration1)).toEqual(true);
    })

    test("Début et fin au même moment", ()=>{
        const date1 = new Date(2024, 6, 15, AFTERNOON);
        const duration1 = 2
        const date2 = new Date(2024, 6, 15, AFTERNOON);
        const duration2 = 2
        expect(areDatesNotOverlapping(date1, duration1, date2, duration2)).toEqual(false);
    })

    test("Début et fin au même moment sym", ()=>{
        const date1 = new Date(2024, 6, 15, AFTERNOON);
        const duration1 = 2
        const date2 = new Date(2024, 6, 15, AFTERNOON);
        const duration2 = 2
        expect(areDatesNotOverlapping(date2, duration2, date1, duration1)).toEqual(false);
    })

    test("Overlap sur la même journée", ()=>{
        const date1 = new Date(2024, 6, 15, AFTERNOON);
        const duration1 = 2
        const date2 = new Date(2024, 6, 15, MORNING);
        const duration2 = 2
        expect(areDatesNotOverlapping(date1, duration1, date2, duration2)).toEqual(false);
    })

    test("Overlap sur la même journée sym", ()=>{
        const date1 = new Date(2024, 6, 15, AFTERNOON);
        const duration1 = 2
        const date2 = new Date(2024, 6, 15, MORNING);
        const duration2 = 2
        expect(areDatesNotOverlapping(date2, duration2, date1, duration1)).toEqual(false);
    })

    test("Dates éloignées", ()=>{
        const date1 = new Date(2024, 6, 17, AFTERNOON);
        const duration1 = 2
        const date2 = new Date(2024, 6, 15, MORNING);
        const duration2 = 2
        expect(areDatesNotOverlapping(date1, duration1, date2, duration2)).toEqual(true);
    })

    test("Dates éloignées sym", ()=>{
        const date1 = new Date(2024, 6, 17, AFTERNOON);
        const duration1 = 2
        const date2 = new Date(2024, 6, 15, MORNING);
        const duration2 = 2
        expect(areDatesNotOverlapping(date2, duration2, date1, duration1)).toEqual(true);
    })

    test("Overlap sur plusieurs jours", ()=>{
        const date1 = new Date(2024, 6, 15, AFTERNOON);
        const duration1 = 10
        const date2 = new Date(2024, 6, 14, MORNING);
        const duration2 = 7
        expect(areDatesNotOverlapping(date1, duration1, date2, duration2)).toEqual(false);
    })

    test("Overlap sur plusieurs jours sym", ()=>{
        const date1 = new Date(2024, 6, 15, AFTERNOON);
        const duration1 = 10
        const date2 = new Date(2024, 6, 14, MORNING);
        const duration2 = 7
        expect(areDatesNotOverlapping(date2, duration2, date1, duration1)).toEqual(false);
    })

    test("Durée contenue dans une autre", ()=>{
        const date1 = new Date(2024, 6, 15, AFTERNOON);
        const duration1 = 10
        const date2 = new Date(2024, 6, 17, MORNING);
        const duration2 = 1
        expect(areDatesNotOverlapping(date1, duration1, date2, duration2)).toEqual(false);
    })

    test("Durée contenue dans une autre sym", ()=>{
        const date1 = new Date(2024, 6, 15, AFTERNOON);
        const duration1 = 10
        const date2 = new Date(2024, 6, 17, MORNING);
        const duration2 = 1
        expect(areDatesNotOverlapping(date2, duration2, date1, duration1)).toEqual(false);
    })



})