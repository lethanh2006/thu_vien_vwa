import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormCapThuMuc = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm, isView } =
		useModel('danhmuc.kieubanghi');
	const { title } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: KieuBanGhi.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(values)
				.then()
				.catch((er) => console.log(er));
	};
	return (
		<Card title={`${edit ? 'Chỉnh sửa' : isView ? 'Chi tiết' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24}>
						<Form.Item name='ma' label='Mã kiểu bản ghi' rules={[...rules.required, ...rules.text]}>
							<Input placeholder='Nhập mã kiểu bản ghi' disabled={edit || isView} />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='ten' label='Tên kiểu bản ghi' rules={[...rules.required, ...rules.text]}>
							<Input placeholder='Nhập tên kiểu bản ghi' />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					{!isView ? (
						<>
							<Button loading={formSubmiting} htmlType='submit' type='primary'>
								{!edit
									? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
									: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
							</Button>
							<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
						</>
					) : (
						<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
					)}
				</div>
			</Form>
		</Card>
	);
};

export default FormCapThuMuc;
