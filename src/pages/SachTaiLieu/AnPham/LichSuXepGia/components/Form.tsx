import MyDatePicker from '@/components/MyDatePicker';
import ButtonExtend from '@/components/Table/ButtonExtend';
import useDkcbPreview from '@/hooks/useDkcbPreview';
import SelectGiaSach from '@/pages/DanhMuc/GiaSach/components/Select';
import SelectKhoSach from '@/pages/DanhMuc/KhoSach/components/Select';
import SelectKieuTuLieu from '@/pages/DanhMuc/KieuTuLieu/components/Select';
import SelectNguonBoSung from '@/pages/DanhMuc/NguonBoSung/components/Select';
import SelectThuVien from '@/pages/DanhMuc/ThuVien/components/Select';
import SelectDotNhapSach from '@/pages/SachTaiLieu/DotNhapSach/components/Select';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { LoadingOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Divider, Form, Input, InputNumber, Popconfirm, Row } from 'antd';
import { useEffect, useState } from 'react';
import { history, useIntl, useModel } from 'umi';

const FormLichSuXepGia = (props: { onCancel: () => void; onOk: () => void; visible?: boolean }) => {
	const { onCancel, onOk, visible } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { formSubmiting, putModel, record, visibleForm } = useModel('sachtailieu.anpham.xepgia');
	const maKhoSach: string = Form.useWatch('maKhoSach', form);
	const [actionType, setActionType] = useState<'luu_lai' | 'xep_gia'>('luu_lai');
	const isVisible = visible ?? visibleForm;
	const dkcbPreview = useDkcbPreview(maKhoSach, isVisible && !record?.daXepGia);

	useEffect(() => {
		if (!isVisible) {
			resetFieldsForm(form);
		} else if (record?._id) {
			resetFieldsForm(form);
			form.setFieldsValue(record);
			setActionType('luu_lai');
		}
	}, [isVisible, record?._id]);

	const onFinish = async (values: AnPham.IXepGia) => {
		if (record?._id) {
			const payload: Partial<AnPham.IXepGia> = {
				...values,
				daXepGia: record.daXepGia || actionType === 'xep_gia',
			};
			if (record.daXepGia) {
				delete payload.anPhamId;
				delete payload.maKhoSach;
				delete payload.soLuong;
			} else {
				payload.anPhamId = record.anPhamId;
			}
			putModel(record?._id, payload, onOk, undefined, false, 'Lưu thành công')
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
									history.push('/bien-muc/an-pham');
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
				description={
					record?.daXepGia
						? 'Có thể sửa đơn giá và ghi chú. Muốn thay đổi số lượng, hãy thêm hoặc xóa từng bản ĐKCB.'
						: undefined
				}
			/>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Divider>Thông tin xếp giá bổ sung</Divider>
					</Col>
					<Col xs={24}>
						<Form.Item
							name='dotNhapSachId'
							label='Sổ đăng ký tổng quát'
							//  rules={[...rules.required]}
						>
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
							<SelectKhoSach selectMa disabled={record?.daXepGia} onChange={() => form.resetFields(['giaSachId'])} />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='giaSachId' label='Giá sách'>
							<SelectGiaSach condition={{ maKhoSach: maKhoSach }} />
						</Form.Item>
					</Col>
					{!record?.daXepGia && (
						<Col xs={24} md={12}>
							<Form.Item
								label='ĐKCB dự kiến tiếp theo'
								extra={
									dkcbPreview.failed
										? 'Chưa lấy được số dự kiến. Hệ thống vẫn tự cấp số khi xếp giá.'
										: 'Hệ thống tự cấp số khi xếp giá; số thực tế có thể thay đổi nếu có người khác cùng thao tác.'
								}
							>
								<Input
									value={dkcbPreview.value ?? ''}
									placeholder={dkcbPreview.loading ? 'Đang lấy số ĐKCB...' : 'Chọn kho để xem số dự kiến'}
									readOnly
									suffix={dkcbPreview.loading ? <LoadingOutlined /> : undefined}
								/>
							</Form.Item>
						</Col>
					)}
					<Col xs={24} md={12}>
						<Form.Item
							name='soLuong'
							label='Số lượng'
							rules={
								record?.daXepGia
									? []
									: [
											...rules.required,
											{ type: 'integer', min: 1, max: 5000, message: 'Số lượng phải là số nguyên từ 1 đến 5000' },
										]
							}
						>
							<InputNumber
								disabled={record?.daXepGia}
								min={1}
								max={5000}
								step={1}
								style={{ width: '100%' }}
								placeholder='Nhập số lượng'
							/>
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
						title='Xác nhận xếp giá và cấp số ĐKCB? Sau khi xếp giá, muốn thay đổi số lượng phải thêm hoặc xóa từng bản ĐKCB.'
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
