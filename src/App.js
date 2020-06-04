import React, { useState, createContext, useReducer, useEffect } from 'react'
import { Modal, Space, Button, Typography, message } from 'antd'
import HabitList from './habitList'
import FormSpace from './FormSpace'
import reducer from './reducer'
import './App.less'

export const contextDispach = createContext(() => {})

const App = () => {
   const [formVisibility, setFormVisibility] = useState(false)
   const [habitsAppState, dispach] = useReducer(
      reducer,
      JSON.parse(localStorage.getItem('habitsAppState') || '[]') || []
   )
   useEffect(() => {
      localStorage.setItem('habitsAppState', JSON.stringify(habitsAppState))
   }, [habitsAppState])

   return (
      <contextDispach.Provider value={dispach}>
         <section
            style={{ textAlign: 'center', marginTop: 48, marginBottom: 40 }}
         >
            <Space align="start">
               <Typography.Title level={2} style={{ marginBottom: 0 }}>
                  Habits Tracker
               </Typography.Title>
            </Space>
         </section>
         <main>
            <Space direction="vertical" style={{ width: '100%' }}>
               <Button
                  type="primary"
                  htmlType="button"
                  onClick={() => setFormVisibility(true)}
               >
                  Add Habits
               </Button>

               <Modal
                  title="Add Habits"
                  visible={formVisibility}
                  footer={null}
                  onCancel={() => setFormVisibility(false)}
               >
                  <FormSpace
                     onFinish={(values) => {
                        dispach({
                           payload: values,
                           type: 'addHabit',
                        })
                        message.success('Added', 1)
                     }}
                     formVisibility={formVisibility}
                  />
               </Modal>

               <HabitList habits={habitsAppState} />
            </Space>
         </main>
      </contextDispach.Provider>
   )
}
export default App
