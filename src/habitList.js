import React, { useContext } from 'react'
import { List, Avatar, Popconfirm, Modal, message, Button } from 'antd'
import { RightCircleTwoTone, DeleteFilled, EditFilled } from '@ant-design/icons'
import { format } from 'date-fns'
import { contextDispach } from './App'
import FormSpace from './FormSpace'

class HabitListItem extends React.Component {
   constructor(props) {
      super(props)
      this.state = { formVisibility: false }
   }
   render() {
      const {
         title,
         description = '',
         idName,
         dispach,
         CheckList,
         score,
      } = this.props

      const setFormVisibility = (value) =>
         this.setState({ formVisibility: value })
      const { formVisibility } = this.state
      const todate = format(new Date(), 'yyyyMMdd')
      const doneState = CheckList[todate] || false

      return (
         <>
            <List.Item
               actions={[
                  <Button
                     type="ghost"
                     htmlType="button"
                     onClick={() =>
                        dispach({
                           type: 'toggleToday',
                           payload: { id: idName },
                        })
                     }
                  >
                     {doneState ? 'Done' : 'Yet to do'}
                  </Button>,
                  <EditFilled
                     onClick={() => setFormVisibility(true)}
                     style={{ fontSize: 'large' }}
                  />,
                  <Popconfirm
                     title="Are you sure to delete this task?"
                     onConfirm={() =>
                        dispach({
                           type: 'deleteHabit',
                           payload: { id: idName },
                        })
                     }
                  >
                     <DeleteFilled style={{ fontSize: 'large' }} />
                  </Popconfirm>,
               ]}
            >
               <List.Item.Meta
                  title={title}
                  avatar={
                     <Avatar
                        icon={<RightCircleTwoTone />}
                        style={{ backgroundColor: 'transparent' }}
                        size="large"
                     />
                  }
                  description={description}
               />
               <>Score: {Math.round(score * 100)}</>
            </List.Item>

            <Modal
               title="Edit Habit"
               onCancel={() => {
                  setFormVisibility(false)
               }}
               footer={null}
               visible={formVisibility}
            >
               {formVisibility ? (
                  <FormSpace
                     onFinish={(values) => {
                        dispach({
                           type: 'editHabit',
                           payload: { id: idName, ...values },
                        })
                        message.success('Saved', 1)
                     }}
                     initialValues={{ title, description }}
                     formVisibility={formVisibility}
                  />
               ) : (
                  'Closing'
               )}
            </Modal>
         </>
      )
   }
}

const HabitList = ({ habits }) => {
   const dispach = useContext(contextDispach)

   return (
      <List itemLayout="horizontal" dataSource={habits}>
         {habits.map(
            ({ id, title, description, key = id, CheckList, score }) => {
               return (
                  <HabitListItem
                     idName={id}
                     title={title}
                     description={description}
                     dispach={dispach}
                     CheckList={CheckList}
                     score={score}
                     key={key}
                  />
               )
            }
         )}
      </List>
   )
}

export default HabitList
