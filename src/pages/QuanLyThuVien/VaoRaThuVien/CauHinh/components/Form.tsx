import MyDatePicker from '@/components/MyDatePicker';
import { EThuTrongTuan, mapNameThuTrongTuan } from '@/services/QuanLyThuVien/constants';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Divider, Form, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormCauHinhVaoRaThuVien = (props: any) => {
	const { getData, danhSach } = props;
	const [form] = Form.useForm();
	const { visibleForm, setVisibleForm, record, edit } = useModel('quanlythuvien.cauhinh');
	const { formSubmiting, postCauHinhThuVienModel } = useModel('quanlythuvien.vaorathuvien');

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record) {
			form.setFieldsValue(record);
		}
	}, [record, visibleForm]);

	const onFinish = async (values: QuanLyThuVien.ICauHinhVaoRaThuVien) => {
		const filteredThoiGian = danhSach?.thoiGian?.filter((item: any) => item?.thu !== values?.thu) || [];

		const updatedThoiGian = [...filteredThoiGian, values];

		const data = {
			thoiGian: updatedThoiGian,
		};

		postCauHinhThuVienModel(data as any, getData)
			.then(() => setVisibleForm(false))
			.catch((er) => console.log(er));
	};

	return (
		<Form layout='vertical' onFinish={onFinish} form={form}>
			<Row gutter={[12, 0]}>
				<Col xs={24} md={24}>
					<Form.Item name='thu' label='Thứ' rules={[...rules.required]}>
						<Select
							disabled={edit}
							options={(!edit
								? Object.values(EThuTrongTuan).filter(
										(item) => !danhSach?.thoiGian?.map((items: any) => items?.thu).includes(Number(item)),
								  )
								: Object.values(EThuTrongTuan)
							)?.map((item) => ({
								value: Number(item),
								label: mapNameThuTrongTuan[String(item) as EThuTrongTuan],
							}))}
							placeholder='Chọn thứ bắt đầu'
						/>
					</Form.Item>
				</Col>
				<Col xs={24}>
					<Divider orientation='left'>Sáng</Divider>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='thoiGianMoCuaBuoiSang' label='Thời gian mởi' rules={[...rules.required]}>
						<MyDatePicker
							pickerStyle='time'
							format='HH:mm'
							placeholder='Chọn thời gian bắt đầu'
							showTime={{ minuteStep: 1 }}
							saveFormat='HH:mm'
						/>
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='thoiGianDongCuaBuoiSang' label='Thời gian đóng' rules={[...rules.required]}>
						<MyDatePicker
							pickerStyle='time'
							format='HH:mm'
							placeholder='Chọn thời gian bắt đầu'
							showTime={{ minuteStep: 1 }}
							saveFormat='HH:mm'
						/>
					</Form.Item>
				</Col>
				<Col xs={24}>
					<Divider orientation='left'>Chiều</Divider>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='thoiGianMoCuaBuoiChieu' label='Thời gian mởi' rules={[...rules.required]}>
						<MyDatePicker
							pickerStyle='time'
							format='HH:mm'
							placeholder='Chọn thời gian bắt đầu'
							showTime={{ minuteStep: 1 }}
							saveFormat='HH:mm'
						/>
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='thoiGianDongCuaBuoiChieu' label='Thời gian đóng' rules={[...rules.required]}>
						<MyDatePicker
							pickerStyle='time'
							format='HH:mm'
							placeholder='Chọn thời gian bắt đầu'
							showTime={{ minuteStep: 1 }}
							saveFormat='HH:mm'
						/>
					</Form.Item>
				</Col>
				<Col xs={24}>
					<Divider orientation='left'>Tối</Divider>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='thoiGianMoCuaBuoiToi' label='Thời gian mởi' rules={[...rules.required]}>
						<MyDatePicker
							pickerStyle='time'
							format='HH:mm'
							placeholder='Chọn thời gian bắt đầu'
							showTime={{ minuteStep: 1 }}
							saveFormat='HH:mm'
						/>
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='thoiGianDongCuaBuoiToi' label='Thời gian đóng' rules={[...rules.required]}>
						<MyDatePicker
							pickerStyle='time'
							format='HH:mm'
							placeholder='Chọn thời gian bắt đầu'
							showTime={{ minuteStep: 1 }}
							saveFormat='HH:mm'
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
	);
};

export default FormCauHinhVaoRaThuVien;
