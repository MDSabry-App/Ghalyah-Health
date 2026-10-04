export function resolveDoseTime(type: string, meals: {breakfastTime:string, lunchTime:string, dinnerTime:string}, custom?: string){
  const toMin = (t:string) => { const [h,m]=t.split(":").map(Number); return h*60+m }
  const toStr = (min:number) => {
    if(min<0) min+=1440; 
    return `${String(Math.floor(min/60)%24).padStart(2,\'0\')}:${String(min%60).padStart(2,\'0\')}`
  }
  if(type === \'before_breakfast_30m\') return toStr(toMin(meals.breakfastTime) - 30)
  if(type === \'before_lunch_15m\') return toStr(toMin(meals.lunchTime) - 15)
  if(type === \'after_lunch\') return toStr(toMin(meals.lunchTime) + 30)
  if(type === \'after_dinner\') return toStr(toMin(meals.dinnerTime) + 30)
  if(type === \'on_empty_stomach\') return "06:30"
  if(type === \'custom\') return custom!
  return "08:00"
}