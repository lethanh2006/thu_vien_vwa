import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormMauBienMuc = (props: { afterAddNew?: (rec: MauBienMuc.IRecord) => void }) => {
	const { afterAddNew } = props;
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm, setRecord, setEdit } =
		useModel('danhmuc.maubienmuc');
	const intl = useIntl();
	const [form] = Form.useForm();

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: MauBienMuc.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values)
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
				<Col span={24} md={12}>
					<Form.Item label='Mã mẫu biên mục' name='ma' rules={[...rules.required, ...rules.text, ...rules.length(20)]}>
						<Input placeholder='Nhập mã mẫu biên mục' />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item
						label='Tên mẫu biên mục'
						name='ten'
						rules={[...rules.required, ...rules.text, ...rules.length(250)]}
					>
						<Input placeholder='Nhập tên mẫu biên mục' />
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

export default FormMauBienMuc;
