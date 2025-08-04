import MyDatePicker from '@/components/MyDatePicker';
import SelectKhoSach from '@/pages/DanhMuc/KhoSach/components/Select';
import SelectNguonBoSung from '@/pages/DanhMuc/NguonBoSung/components/Select';
import rules from '@/utils/rules';
import { Col, Form, Input, InputNumber } from 'antd';

const FormGhiNhanAnPham = () => {
	return (
		<>
			<Col xs={24} md={12}>
				<Form.Item name='nguonBoSungId' label='Nguồn bổ sung' rules={[...rules.required]}>
					<SelectNguonBoSung />
				</Form.Item>
			</Col>

			<Col xs={24} md={12}>
				<Form.Item name='ngayGhiNhan' label='Ngày bổ sung' rules={[...rules.required]}>
					<MyDatePicker />
				</Form.Item>
			</Col>

			<Col xs={24} md={12}>
				<Form.Item name='khoSachId' label='Kho' rules={[...rules.required]}>
					<SelectKhoSach />
				</Form.Item>
			</Col>

			<Col xs={24} md={12}>
				<Form.Item name='soAnPhamDinhKy' label='Số ấn phẩm định kỳ' rules={[...rules.required]}>
					<Input placeholder='Đăng số ấn phẩm định kỳ' />
				</Form.Item>
			</Col>
			<Col xs={24} md={12}>
				<Form.Item name='soLuong' label='Số lượng' rules={[...rules.required]}>
					<InputNumber style={{ width: '100%' }} placeholder='Nhập số lượng' />
				</Form.Item>
			</Col>

			<Col xs={24} md={12}>
				<Form.Item name='donGia' label='Đơn giá' rules={[...rules.required]}>
					<InputNumber style={{ width: '100%' }} placeholder='Nhập đơn giá' />
				</Form.Item>
			</Col>

			<Col xs={24}>
				<Form.Item name='ghiChu' label='Ghi chú'>
					<Input placeholder='Nhập ghi chú' />
				</Form.Item>
			</Col>
		</>
	);
};

export default FormGhiNhanAnPham;
