import React, { useEffect } from 'react'
import { Form, Button, Input } from 'antd'

const FormSpace = ({
   initialValues = { title: '', description: '' },
   onFinish,
   formVisibility,
}) => {
   const [form] = Form.useForm()
   useEffect(() => {
      if (!formVisibility) {
         form.resetFields()
      }
   })

   return (
      <Form
         name="addHabit"
         labelCol={{ span: 5 }}
         form={form}
         onFinish={(values) => {
            onFinish(values)
            form.resetFields()
         }}
         initialValues={initialValues}
      >
         <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please enter the title' }]}
         >
            <Input placeholder="Enter title" autoFocus={true} />
         </Form.Item>
         <Form.Item label="Description" name="description">
            <Input placeholder="Enter Description" />
         </Form.Item>
         <Form.Item wrapperCol={{ offset: 5 }}>
            <Button type="primary" htmlType="submit">
               Save
            </Button>
         </Form.Item>
      </Form>
   )
}

export default FormSpace
