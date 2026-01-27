import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormThuVienQuocTe = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm, isView } =
		useModel('danhmuc.thuvienquocte');
	const { title } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: Z3950.IMayChu) => {
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
		<Card
			title={`${edit ? intl.formatMessage({ id: 'danhmuc.thuvienquocte.form.title.chinhsua' }) : isView ? intl.formatMessage({ id: 'danhmuc.thuvienquocte.form.title.chitiet' }) : intl.formatMessage({ id: 'danhmuc.thuvienquocte.form.title.themmoi' })} ${title?.toLowerCase()}`}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24}>
						<Form.Item
							name='name'
							label={intl.formatMessage({ id: 'danhmuc.thuvienquocte.form.label.tenmaychu' })}
							rules={[...rules.required]}
						>
							<Input placeholder={intl.formatMessage({ id: 'danhmuc.thuvienquocte.form.placeholder.tenmaychu' })} />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item
							name='port'
							label={intl.formatMessage({ id: 'danhmuc.thuvienquocte.form.label.cong' })}
							rules={[...rules.required]}
						>
							<Input placeholder={intl.formatMessage({ id: 'danhmuc.thuvienquocte.form.placeholder.cong' })} />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item
							name='host'
							label={intl.formatMessage({ id: 'danhmuc.thuvienquocte.form.label.maychu' })}
							rules={[...rules.required]}
						>
							<Input placeholder={intl.formatMessage({ id: 'danhmuc.thuvienquocte.form.placeholder.maychu' })} />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item
							name='database'
							label={intl.formatMessage({ id: 'danhmuc.thuvienquocte.form.label.cosodulieu' })}
							rules={[...rules.required]}
						>
							<Input placeholder={intl.formatMessage({ id: 'danhmuc.thuvienquocte.form.placeholder.cosodulieu' })} />
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

export default FormThuVienQuocTe;
