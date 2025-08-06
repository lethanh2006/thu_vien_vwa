import MyDatePicker from '@/components/MyDatePicker';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import moment from 'moment';
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
		values.thoiGianBatDau = moment(values.thoiGianBatDau).startOf('d').toISOString();
		values.thoiGianKetThuc = moment(values.thoiGianKetThuc).endOf('d').toISOString();

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
					<Col span={24}>
						<Form.Item name='ten' label='Tên kỳ xuất bản' rules={[...rules.required, ...rules.text]}>
							<Input placeholder='Nhập tên kỳ xuất bản' />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='moTa' label='Mô tả' rules={[...rules.text]}>
							<Input.TextArea rows={3} placeholder='Nhập mô tả' />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='thoiGianBatDau' label='Thời gian bắt đầu'>
							<MyDatePicker format='DD/MM/YYYY' />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='thoiGianKetThuc'
							label='Thời gian kết thúc'
							rules={[...rules.sauNgay(moment(thoiGianBatDau))]}
						>
							<MyDatePicker disabledDate={(cur) => (thoiGianBatDau ? moment(cur).isBefore(thoiGianBatDau) : false)} />
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
