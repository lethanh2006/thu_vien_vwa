import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormTruongCon = (props: any) => {
	const { title, getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record: recTag } = useModel('danhmuc.truongbienmuc');
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('danhmuc.truongcon');
	const code: string = Form.useWatch('code', form);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	useEffect(() => {
		if (code)
			form.setFieldsValue({
				tagCode: recTag?.ma + code,
			});
	}, [code]);

	const onFinish = async (values: TruongCon.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel({ ...values, tag: recTag?.ma }, getData)
				.then()
				.catch((er) => console.log(er));
	};
	return (
		<Card
			title={`${edit ? intl.formatMessage({ id: 'danhmuc.truongcon.form.title.chinhsua' }) : intl.formatMessage({ id: 'danhmuc.truongcon.form.title.themmoi' })} ${title?.toLowerCase()}`}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col xs={24}>
						<Form.Item
							name='code'
							label={intl.formatMessage({ id: 'danhmuc.truongcon.form.label.code' })}
							rules={[...rules.required]}
						>
							<Input placeholder={intl.formatMessage({ id: 'danhmuc.truongcon.form.placeholder.nhapcode' })} />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item
							name='tagCode'
							label={intl.formatMessage({ id: 'danhmuc.truongcon.form.label.tagcode' })}
							rules={[...rules.required]}
						>
							<Input
								placeholder={intl.formatMessage({ id: 'danhmuc.truongcon.form.placeholder.nhaptagcode' })}
								disabled
							/>
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='tieuDe' label={intl.formatMessage({ id: 'danhmuc.truongcon.form.label.tieude' })}>
							<Input placeholder={intl.formatMessage({ id: 'danhmuc.truongcon.form.placeholder.nhaptieude' })} />
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
		</Card>
	);
};

export default FormTruongCon;
