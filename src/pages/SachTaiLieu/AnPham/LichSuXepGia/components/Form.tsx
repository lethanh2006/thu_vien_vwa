import MyDatePicker from '@/components/MyDatePicker';
import ButtonExtend from '@/components/Table/ButtonExtend';
import SelectGiaSach from '@/pages/DanhMuc/GiaSach/components/Select';
import SelectKhoSach from '@/pages/DanhMuc/KhoSach/components/Select';
import SelectKieuTuLieu from '@/pages/DanhMuc/KieuTuLieu/components/Select';
import SelectNguonBoSung from '@/pages/DanhMuc/NguonBoSung/components/Select';
import SelectThuVien from '@/pages/DanhMuc/ThuVien/components/Select';
import SelectDotNhapSach from '@/pages/SachTaiLieu/DotNhapSach/components/Select';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Alert, Button, Col, Divider, Form, Input, InputNumber, Popconfirm, Row } from 'antd';
import { useEffect, useState } from 'react';
import { history, useIntl, useModel } from 'umi';

const FormLichSuXepGia = (props: { onCancel: () => void; onOk: () => void }) => {
	const { onCancel, onOk } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { formSubmiting, putModel, record, visibleForm } = useModel('sachtailieu.anpham.xepgia');
	const { danhSach: danhSachKieuTuLieu } = useModel('danhmuc.kieutulieu');
	const maKhoSach: string = Form.useWatch('maKhoSach', form);
	const [actionType, setActionType] = useState<string>();

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			const index = danhSachKieuTuLieu?.find((item) => item?.ma === record?.maKieuTuLieu);
			form.setFieldsValue({
				...record,
				soDangKyCaBiet: `${index?.ma}/${String((index?.soTuLieu ?? 0) + 1).padStart(6, '0')}`,
			});
		}
	}, [visibleForm, record?._id]);

	const onFinish = async (values: AnPham.IXepGia) => {
		if (record?._id) {
			putModel(
				record?._id,
				{
					...values,
					daXepGia: actionType === 'luu_lai' ? false : true,
				},
				onOk,
				undefined,
				false,
				'Lưu thành công',
			)
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<>
			<Alert
				style={{ marginBottom: 12 }}
				type={record?.daXepGia ? 'success' : 'info'}
				showIcon
				message={
					record?.daXepGia ? (
						<>
							Ấn phẩm đã xếp giá,{' '}
							<a
								onClick={() => {
									history.push('/sach-tai-lieu/an-pham');
									onCancel();
								}}
							>
								Xếp giá tiếp
							</a>
						</>
					) : (
						'Ấn phẩm đang xếp giá'
					)
				}
			/>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Divider>Thông tin xếp giá bổ sung</Divider>
					</Col>
					<Col xs={24}>
						<Form.Item name='dotNhapSachId' label='Sổ đăng ký tổng quát' rules={[...rules.required]}>
							<SelectDotNhapSach />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='maNguonBoSung' label='Nguồn bổ sung' rules={[...rules.required]}>
							<SelectNguonBoSung selectMa />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='maKieuTuLieu' label='Kiểu tư liệu (lưu thông)' rules={[...rules.required]}>
							<SelectKieuTuLieu selectMa />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='ngayBoSung' label='Ngày bổ sung' rules={[...rules.required]}>
							<MyDatePicker />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='donGia' label='Đơn giá (đ/bản)'>
							<InputNumber
								formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								style={{ width: '100%' }}
								placeholder='Nhập đơn giá'
								min={0}
								addonAfter='VNĐ'
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Divider>Thông tin vị trí xếp giá</Divider>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='thuVienId' label='Thư viện' rules={[...rules.required]}>
							<SelectThuVien />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='maKhoSach' label='Kho' rules={[...rules.required]}>
							<SelectKhoSach
								selectMa
								onChange={(val) => {
									const index = danhSachKieuTuLieu?.find((item) => item?.ma === val);
									form.setFieldsValue({
										soDangKyCaBiet: `${index?.ma}/${String((index?.soTuLieu ?? 0) + 1).padStart(6, '0')}`,
									});
									form.resetFields(['giaSachId']);
								}}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='giaSachId' label='Giá sách'>
							<SelectGiaSach condition={{ maKhoSach: maKhoSach }} />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='soDangKyCaBiet' label='Đăng ký cá biệt' rules={[...rules.required]}>
							<Input placeholder='Đăng ký cá biệt' disabled />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='soLuong' label='Số lượng' rules={[...rules.required]}>
							<InputNumber style={{ width: '100%' }} placeholder='Nhập lượng' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='ghiChu' label='Ghi chú'>
							<Input placeholder='Nhập ghi chú' />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<ButtonExtend
						disabled={record?.daXepGia}
						loading={formSubmiting}
						type='primary'
						onClick={() => {
							setActionType('luu_lai');
							form.submit();
						}}
					>
						Lưu lại
					</ButtonExtend>
					<Popconfirm
						onConfirm={() => {
							setActionType('xep_gia');
							form.submit();
						}}
						title='Xác nhận xếp giá, lưu ý khi hoàn thành sẽ không được chỉnh sửa lại giá?'
						placement='topRight'
					>
						<ButtonExtend disabled={record?.daXepGia} loading={formSubmiting} type='primary'>
							Xếp giá
						</ButtonExtend>
					</Popconfirm>
					<Button onClick={() => onCancel()}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</>
	);
};

export default FormLichSuXepGia;
