import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormTruongBienMuc = (props: { afterAddNew?: (rec: TruongBienMuc.IRecord) => void; getData: () => void }) => {
	const { afterAddNew, getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm, isView, setRecord, setEdit } =
		useModel('danhmuc.truongbienmuc');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: TruongBienMuc.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(values, getData, false)
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
					<Form.Item name='ma' label='Mã trường biên mục' rules={[...rules.required, ...rules.text]}>
						<Input placeholder='Nhập mã ' disabled={edit || isView} />
					</Form.Item>
				</Col>
				<Col xs={24}>
					<Form.Item name='noiDung' label='Nội dung trường biên mục' rules={[...rules.required, ...rules.text]}>
						<Input placeholder='Nhập nội cung' />
					</Form.Item>
				</Col>
				<Col xs={24}>
					<Form.Item name='ghiChu' label='Ghi chú' rules={[...rules.text]}>
						<Input.TextArea rows={3} placeholder='Nhập ghi chú' />
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

export default FormTruongBienMuc;
