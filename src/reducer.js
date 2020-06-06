import { format, eachDayOfInterval, parse } from 'date-fns'

let idCounter = 0
const multiplier = 1 - Math.pow(0.2, 1 / 21)

const actions = new Map([
   [
      'addHabit',
      (state, payload) => {
         const todate = format(new Date(), 'yyyyMMdd')

         return [
            ...state,
            {
               ...payload,
               id: `${idCounter++}`,
               startDate: todate,
               CheckList: { [todate]: 0 },
               score: 0,
            },
         ]
      },
   ],

   [
      'deleteHabit',
      (state, payload) => state.filter((el) => el.id !== payload.id),
   ],

   [
      'editHabit',
      (state, payload) =>
         state.map((el) =>
            el.id === payload.id
               ? {
                    ...el,
                    title: payload.title,
                    description: payload.description,
                 }
               : el
         ),
   ],

   [
      'toggleToday',
      (state, payload) => {
         const todate = format(new Date(), 'yyyyMMdd')

         return state.map((el) =>
            el.id === payload.id
               ? {
                    ...el,
                    CheckList: {
                       ...el.CheckList,
                       [todate]: +!el.CheckList[todate],
                    },
                    score:
                       el.CheckList[todate] === 1
                          ? el.score - multiplier
                          : multiplier * !el.CheckList[todate] +
                            (1 - multiplier) * el.score,
                 }
               : el
         )
      },
   ],
])

const reducer = (state, action) => {
   return actions.get(action.type)(state, action.payload)
}

export default reducer

export const initHelper = (habit) => {
   const daysBetween = eachDayOfInterval({
      start: parse(habit.startDate, 'yyyyMMdd', new Date()),
      end: new Date(),
   }).map((day) => format(day, 'yyyyMMdd'))

   const checks = daysBetween.reduce(
      (acc, day) => ({
         checks: { ...acc.checks, [day]: +acc.checks[day] || 0 },
         values: [...acc.values, +acc.checks[day] || 0],
      }),
      { checks: habit.CheckList, values: [] }
   )

   const score = checks.values.reduce(
      (acc, val) => multiplier * val + acc * (1 - multiplier),
      0
   )

   return {
      ...habit,
      CheckList: checks.checks,
      score: score,
   }
}
