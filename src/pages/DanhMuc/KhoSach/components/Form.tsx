import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectPhongDoc from '../../PhongDoc/components/Select';

const FormKhoSach = (props: any) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel('danhmuc.khosach');
	const intl = useIntl();
	const [form] = Form.useForm();
	const { title } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: KhoSach.IRecord) => {
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
			title={`${edit ? intl.formatMessage({ id: 'danhmuc.khosach.form.title.chinhsua' }) : intl.formatMessage({ id: 'danhmuc.khosach.form.title.themmoi' })} ${title?.toLowerCase()}`}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item
							label={intl.formatMessage({ id: 'danhmuc.khosach.form.label.makho' })}
							name='ma'
							rules={[...rules.required, ...rules.text, ...rules.length(20)]}
						>
							<Input
								placeholder={intl.formatMessage({ id: 'danhmuc.khosach.form.placeholder.nhapmakho' })}
								disabled={edit}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							label={intl.formatMessage({ id: 'danhmuc.khosach.form.label.tenkho' })}
							name='ten'
							rules={[...rules.required, ...rules.text, ...rules.length(250)]}
						>
							<Input placeholder={intl.formatMessage({ id: 'danhmuc.khosach.form.placeholder.nhaptenkho' })} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							label={intl.formatMessage({ id: 'danhmuc.khosach.form.label.phongdoc' })}
							name='maPhongDoc'
							rules={[...rules.required]}
						>
							<SelectPhongDoc selectMa />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							label={intl.formatMessage({ id: 'danhmuc.khosach.form.label.sodangkycabietcuoi' })}
							name='soLuongAnPhamDaXepGia'
							rules={[...rules.required]}
						>
							<InputNumber
								style={{ width: '100%' }}
								placeholder={intl.formatMessage({ id: 'danhmuc.khosach.form.placeholder.nhapsodangkycabietcuoi' })}
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

export default FormKhoSach;
