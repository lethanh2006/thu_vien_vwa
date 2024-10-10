import MyDatePicker from '@/components/MyDatePicker';
import SelectSinhVienDebounce from '@/pages/SinhVien/component/Select';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Row } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormVaoRaThuVien = (props: any) => {
	const { title, getData } = props;
	const [form] = Form.useForm();
	const { formSubmiting, record, setVisibleForm, edit, visibleForm, postRaVaoThuVienModel } =
		useModel('quanlythuvien.vaorathuvien');
	const { danhSach: danhSachSinhVien } = useModel('sinhvien.sinhvien');
	const [inputDate, setInputDate] = useState<any>();
	const [outputDate, setOutputDate] = useState<any>();

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue(record);
		}
	}, [record?._id, visibleForm]);

	const disabledDateStart = (current: any) => {
		return current && current.isAfter(moment(outputDate)) && outputDate;
	};
	const disabledDateEnd = (current: any) => {
		return current && current.isBefore(moment(inputDate)) && inputDate;
	};

	const onFinish = async (values: any) => {
		postRaVaoThuVienModel(values, getData)
			.then(() => setVisibleForm(false))
			.catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form layout='vertical' onFinish={onFinish} form={form}>
				<Row gutter={[12, 0]}>
					<Col xs={24} md={24}>
						<Form.Item name='maSinhVien' label='Sinh viên' rules={[...rules.required]}>
							<SelectSinhVienDebounce
								keyValue='ma'
								onChange={(val) => {
									const ns = danhSachSinhVien?.find((item) => item?.ma === val);
									form.setFieldsValue({ hoTen: ns?.ten });
								}}
							/>
						</Form.Item>
						<Form.Item name='hoTen' hidden />
					</Col>
					<Col xs={24} md={24}>
						<Form.Item name='thoiGianVao' label='Thời gian vào' rules={[...rules.required]}>
							<MyDatePicker
								format='DD/MM/YYYY HH:mm'
								showTime={{ minuteStep: 1 }}
								onChange={(value) => {
									setInputDate(value);
								}}
								disabledDate={disabledDateStart}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item name='thoiGianRa' label='Thời gian ra'>
							<MyDatePicker
								format='DD/MM/YYYY HH:mm'
								showTime={{ minuteStep: 1 }}
								onChange={(value) => {
									setOutputDate(value);
								}}
								disabledDate={disabledDateEnd}
							/>
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{edit ? 'Lưu lại' : 'Thêm mới'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormVaoRaThuVien;
