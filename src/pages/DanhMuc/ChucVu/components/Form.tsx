import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Form, Input } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormChucVu = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel('danhmuc.chucvu');
	const title = props?.title ?? '';
	const intl = useIntl();

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: ChucVu.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(values)
				.then(() => form.resetFields())
				.catch((er) => console.log(er));
	};

	return (
		<Card
			title={
				(edit
					? intl.formatMessage({ id: 'danhmuc.chucvu.form.title.chinhsua' })
					: intl.formatMessage({ id: 'danhmuc.chucvu.form.title.themmoi' })) +
				' ' +
				title?.toLowerCase()
			}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item
					name='ma'
					label={intl.formatMessage({ id: 'danhmuc.chucvu.form.label.ma' })}
					rules={[...rules.required, ...rules.text, ...rules.length(20)]}
				>
					<Input placeholder={intl.formatMessage({ id: 'danhmuc.chucvu.form.placeholder.machucvu' })} />
				</Form.Item>

				<Form.Item
					name='ten'
					label={intl.formatMessage({ id: 'danhmuc.chucvu.form.label.tenchucvu' })}
					rules={[...rules.required, ...rules.text, ...rules.length(250)]}
				>
					<Input placeholder={intl.formatMessage({ id: 'danhmuc.chucvu.form.placeholder.tenchucvu' })} />
				</Form.Item>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit
							? intl.formatMessage({ id: 'danhmuc.chucvu.form.button.themmoi' })
							: intl.formatMessage({ id: 'danhmuc.chucvu.form.button.luu' })}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>
						{intl.formatMessage({ id: 'danhmuc.chucvu.form.button.huy' })}
					</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormChucVu;
