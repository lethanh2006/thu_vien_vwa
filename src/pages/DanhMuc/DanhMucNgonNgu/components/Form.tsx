import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormNgonNgu = (props: any) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('danhmuc.danhmucngonngu');
	const intl = useIntl();
	const [form] = Form.useForm();
	const { title } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: DanhMucNgonNgu.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values)
				.then()
				.catch((er) => console.log(er));
		} else {
			postModel(values)
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card
			title={`${edit ? intl.formatMessage({ id: 'danhmuc.danhmucngonngu.form.title.chinhsua' }) : intl.formatMessage({ id: 'danhmuc.danhmucngonngu.form.title.themmoi' })} ${title?.toLowerCase()}`}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item
							label={intl.formatMessage({ id: 'danhmuc.danhmucngonngu.form.label.mangonngu' })}
							name='ma'
							rules={[...rules.required, ...rules.text, ...rules.length(20)]}
						>
							<Input
								placeholder={intl.formatMessage({ id: 'danhmuc.danhmucngonngu.form.placeholder.nhapmangonngu' })}
								disabled={edit}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							label={intl.formatMessage({ id: 'danhmuc.danhmucngonngu.form.label.tenngonngu' })}
							name='ten'
							rules={[...rules.required, ...rules.text, ...rules.length(250)]}
						>
							<Input
								placeholder={intl.formatMessage({ id: 'danhmuc.danhmucngonngu.form.placeholder.nhaptenngonngu' })}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label={intl.formatMessage({ id: 'danhmuc.danhmucngonngu.form.label.noidung' })} name='noiDung'>
							<Input.TextArea
								rows={3}
								placeholder={intl.formatMessage({ id: 'danhmuc.danhmucngonngu.form.placeholder.nhapnoidung' })}
							/>
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer' style={{ marginTop: 24 }}>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit
							? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
							: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormNgonNgu;
