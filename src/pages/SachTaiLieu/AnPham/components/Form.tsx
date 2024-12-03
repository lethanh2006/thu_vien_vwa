import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormAnPham = (props: { afterAddNew?: (rec: AnPham.IRecord) => void }) => {
	const { afterAddNew } = props;
	const [form] = Form.useForm();
	const intl = useIntl();
	const { edit, record, setRecord, setEdit, formSubmiting, visibleForm, setVisibleForm, putModel, postModel } =
		useModel('sachtailieu.anpham.anpham');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: AnPham.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values, undefined)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(values, undefined, false)
				.then((rec) => {
					setRecord(rec);
					setEdit(true);
					if (afterAddNew) afterAddNew(rec);
				})
				.catch((er) => console.log(er));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]}>
				<Col xs={24}>
					<Form.Item name='ten' label='Tên ấn phẩm' rules={[...rules.required, ...rules.text]}>
						<Input placeholder='Nhập tên ấn phẩm' />
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					{!edit
						? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
						: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
				</Button>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default FormAnPham;
