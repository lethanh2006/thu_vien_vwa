import MyDatePicker from '@/components/MyDatePicker';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormKyXuatBan = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm, isView } =
		useModel('danhmuc.kyxuatban');
	const { title } = props;
	const thoiGianBatDau: Date = Form.useWatch('thoiGianBatDau', form);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: KyXuatBan.IRecord) => {
		values.thoiGianBatDau = dayjs(values.thoiGianBatDau).startOf('d').toISOString();
		values.thoiGianKetThuc = dayjs(values.thoiGianKetThuc).endOf('d').toISOString();

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
			title={`${edit ? intl.formatMessage({ id: 'danhmuc.kyxuatban.form.title.chinhsua' }) : isView ? intl.formatMessage({ id: 'danhmuc.kyxuatban.form.title.chitiet' }) : intl.formatMessage({ id: 'danhmuc.kyxuatban.form.title.themmoi' })} ${title?.toLowerCase()}`}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<Form.Item
							name='ten'
							label={intl.formatMessage({ id: 'danhmuc.kyxuatban.form.label.tenkyxuatban' })}
							rules={[...rules.required, ...rules.text]}
						>
							<Input placeholder={intl.formatMessage({ id: 'danhmuc.kyxuatban.form.placeholder.nhaptenkyxuatban' })} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='moTa'
							label={intl.formatMessage({ id: 'danhmuc.kyxuatban.form.label.mota' })}
							rules={[...rules.text]}
						>
							<Input.TextArea
								rows={3}
								placeholder={intl.formatMessage({ id: 'danhmuc.kyxuatban.form.placeholder.nhapmota' })}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='thoiGianBatDau'
							label={intl.formatMessage({ id: 'danhmuc.kyxuatban.form.label.thoigianbatdau' })}
						>
							<MyDatePicker format='DD/MM/YYYY' />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='thoiGianKetThuc'
							label={intl.formatMessage({ id: 'danhmuc.kyxuatban.form.label.thoigianketthuc' })}
							rules={[...rules.sauNgay(dayjs(thoiGianBatDau))]}
						>
							<MyDatePicker disabledDate={(cur) => (thoiGianBatDau ? dayjs(cur).isBefore(thoiGianBatDau) : false)} />
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

export default FormKyXuatBan;
