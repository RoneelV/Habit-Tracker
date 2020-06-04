import { format, eachDayOfInterval, parse } from 'date-fns'

let idCounter = 0

const actions = new Map([
   [
      'addHabit',
      (state, payload) => {
         const today = format(new Date(), 'yyyyMMdd')

         return [
            ...state,
            {
               ...payload,
               id: `${idCounter++}`,
               startDate: today,
               CheckList: { [today]: 0 },
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
         const daysBetween = (start) =>
            eachDayOfInterval({
               start: parse(start, 'yyyyMMdd', new Date()),
               end: new Date(),
            }).map((day) => format(day, 'yyyyMMdd'))

         const theHabit = state.find((el) => el.id === payload.id)
         const checks = daysBetween(theHabit.startDate).reduce(
            (acc, day) => ({
               CheckList: {
                  ...acc.CheckList,
                  [day]:
                     day === todate
                        ? +!acc.CheckList[todate]
                        : acc.CheckList[day] || 0,
               },
               array: [
                  day === todate
                     ? +!acc.CheckList[todate]
                     : acc.CheckList[day] || 0,
                  ...acc.array,
               ],
            }),
            { CheckList: theHabit.CheckList, array: [] }
         )

         // 80% on 21th consecutive day
         const multiplier = 1 - Math.pow(0.2, 1 / 21)
         const score = checks.array.reduce(
            (acc, val) => multiplier * val + acc * (1 - multiplier),
            0
         )

         return state.map((el) =>
            el.id === payload.id
               ? {
                    ...el,
                    CheckList: checks.CheckList,
                    score: score,
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
