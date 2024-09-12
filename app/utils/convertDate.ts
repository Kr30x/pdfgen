export function convertToRu(date: string) {
    if (!date){
        return "";
    }
    console.log(date);
    const year = date.slice(0, 4);
    const month = date.slice(5,7);
    const day = date.slice(8, 10);
    console.log(day, month, year);
    return `${day}.${month}.${year}`;
}