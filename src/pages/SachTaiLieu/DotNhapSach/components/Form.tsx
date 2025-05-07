import MyDatePicker from '@/components/MyDatePicker';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormDotNhapSach = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { title } = props;
	const thoiGianBatDau: Date = Form.useWatch('thoiGianBatDau', form);
	const { record: recHocKy } = useModel('daotao.hocky');
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel(
		'sachtailieu.anpham.dotnhapsach',
	);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: AnPham.IDotNhapSach) => {
		values.thoiGianBatDau = moment(values.thoiGianBatDau).startOf('day').toISOString();
		values.thoiGianKetThuc = moment(values.thoiGianKetThuc).endOf('day').toISOString();
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
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item label='Học kỳ'>
							<Input value={recHocKy?.ten} disabled />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label='Tên đợt' name='ten' rules={[...rules.required, ...rules.text, ...rules.length(100)]}>
							<Input placeholder='Nhập tên đợt' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='thoiGianBatDau' label='Thời gian bắt đầu' rules={[...rules.required]}>
							<MyDatePicker
								onChange={(val) => {
									form.validateFields(['thoiGianKetThuc']);
								}}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='thoiGianKetThuc'
							label='Thời gian kết thúc'
							rules={[...rules.required, ...rules.sauNgay(thoiGianBatDau, 'Thời gian bắt đầu')]}
						>
							<MyDatePicker disabledDate={(cur) => moment(cur).isBefore(thoiGianBatDau)} />
						</Form.Item>
					</Col>

					<Col xs={24} md={12}>
						<Form.Item name='soChungTu' label='Số chứng từ' rules={[...rules.text, ...rules.length(100)]}>
							<Input placeholder='Nhập số chứng từ' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='ngayChungTu' label='Ngày chứng từ'>
							<MyDatePicker />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label='Mô tả' name='mota'>
							<Input.TextArea rows={2} placeholder='Nhập mô tả' />
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

export default FormDotNhapSach;
