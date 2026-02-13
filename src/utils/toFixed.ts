export const toFixed = (num: string | number, digits: number) => {
  console.log(num, digits)
  return Number(num).toFixed(digits)
}
