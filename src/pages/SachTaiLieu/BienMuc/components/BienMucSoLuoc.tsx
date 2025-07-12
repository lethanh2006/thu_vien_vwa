import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import SelectCapThuMuc from '@/pages/DanhMuc/CapThuMuc/components/Select';
import SelectDangTaiLieu from '@/pages/DanhMuc/DangTaiLieu/components/Select';
import SelectNgonNgu from '@/pages/DanhMuc/DanhMucNgonNgu/components/Select';
import SelectKieuBanGhi from '@/pages/DanhMuc/KieuBanGhi/components/Select';
import SelectMauBienMuc from '@/pages/DanhMuc/MauBienMuc/components/Select';
import SelectVatMangTin from '@/pages/DanhMuc/VatMangTin/components/Select';
import SelectDotNhapSach from '@/pages/SachTaiLieu/DotNhapSach/components/Select';
import rules from '@/utils/rules';
import { Alert, Checkbox, Col, Form, type FormInstance, Input, InputNumber, Row, Select } from 'antd';
import FormItemTaiLieuSo from '../DanhSachTaiLieu/FormItem';

const BienMucSoLuoc = (props: { form: FormInstance }) => {
	const { form } = props;
	const online: boolean = Form.useWatch('online', form);
	const isSachHay: boolean = Form.useWatch('isSachHay', form);

	return (
		<Row gutter={[12, 0]}>
			<Col span={24}>
				<Alert
					style={{ marginBottom: 12 }}
					type='info'
					showIcon
					message='Để tránh mất dữ liệu khi biên mục, lưu ý không tắt form hoặc tải lại trang trong khi chưa hoàn thành biên mục chi tiết!'
				/>
			</Col>
			<Col span={24}>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Row gutter={[12, 0]}>
							<Col xs={24} md={6}>
								<Form.Item name='urlScanBia' label=''>
									<UploadFile isPortraitAvatar buttonDescription='Thêm ảnh bìa' />
								</Form.Item>
							</Col>
							<Col xs={24} md={18}>
								<Row gutter={[12, 0]}>
									<Col xs={24} md={12}>
										<Form.Item name='dotNhapSachId' label='Sổ đăng ký tổng quát'>
											<SelectDotNhapSach />
										</Form.Item>
									</Col>
									<Col xs={24} md={12}>
										<Form.Item name='canBoBienMuc' label='Cán bộ biên mục [911]'>
											<Input placeholder='Nhập tên cán bộ' />
										</Form.Item>
									</Col>
									<Col xs={24} md={12}>
										<Form.Item name='maKieuBanGhi' label='Kiểu bản ghi' rules={[...rules.required]}>
											<SelectKieuBanGhi selectMa />
										</Form.Item>
									</Col>
									<Col xs={24} md={12}>
										<Form.Item name='maDangTaiLieu' label='Dạng tài liệu [927]' rules={[...rules.required]}>
											<SelectDangTaiLieu selectMa />
										</Form.Item>
									</Col>
									<Col xs={24} md={12}>
										<Form.Item name='maCapThuMuc' label='Cấp thư mục' rules={[...rules.required]}>
											<SelectCapThuMuc selectMa />
										</Form.Item>
									</Col>
								</Row>
							</Col>
						</Row>
					</Col>

					<Col xs={24} md={12}>
						<Form.Item name='maVatMangTin' label='Vật mang tin [925]' rules={[...rules.required]}>
							<SelectVatMangTin selectMa />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='mauBienMucId' label='Mẫu biên mục' rules={[...rules.required]}>
							<SelectMauBienMuc />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='doMat' label='Độ mật [926]' rules={[...rules.required]}>
							<Select placeholder='Chọn độ mật' style={{ width: '100%' }}>
								{Array.from({ length: 11 }, (_, i) => (
									<Select.Option key={i} value={i}>
										{i}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='maNgonNgu' label='Mã ngôn ngữ [041$a]' rules={[...rules.required]}>
							<SelectNgonNgu selectMa />
						</Form.Item>
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<Row gutter={[12, 0]}>
					<Col xs={24} md={12}>
						<Form.Item name='ISBN' label='ISBN [020$a]'>
							<Input placeholder='Nhập ISBN' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='ISSN' label='ISSN [022$a]'>
							<Input placeholder='Nhập ISSN' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='tacGia' label='Tác giả [100$a]' rules={[...rules.required]}>
							<Input placeholder='Nhập tác giả' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='nhanDe' label='Nhan đề chính [245$a]' rules={[...rules.required]}>
							<Input placeholder='Nhập nhan đề chính' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='soThuTuCuaTap' label='Số thứ tự của tập [245$n]'>
							<Input placeholder='Nhập số thứ tự của tập' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='tenTap' label='Tên tập [245$p]'>
							<Input placeholder='Nhập tên tập' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='phuDe' label='Phụ đề [245$b]'>
							<Input placeholder='Nhập phụ đề' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='thongTinTrachNhiem' label='Thông tin trách nhiệm [245$c]'>
							<Input placeholder='Nhập thông tin trách nhiệm' />
						</Form.Item>
					</Col>
					<Col xs={24} md={8}>
						<Form.Item name='lanXuatBan' label='Lần xuất bản [250$a]'>
							<Input placeholder='Nhập lần xuất bản' />
						</Form.Item>
					</Col>
					<Col xs={24} md={8}>
						<Form.Item name='noiXuatBan' label='Nơi xuất bản [260$a]'>
							<Input placeholder='Nhập nơi xuất bản' />
						</Form.Item>
					</Col>
					<Col xs={24} md={8}>
						<Form.Item name='namXuatBan' label='Năm xuất bản [260$c]'>
							<InputNumber style={{ width: '100%' }} placeholder='Nhập năm xuất bản' />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='nhaXuatBan' label='Nhà xuất bản [260$b]'>
							<Input placeholder='Nhập nhà xuất bản' />
						</Form.Item>
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<Row gutter={[12, 0]}>
					<Col xs={24} md={12}>
						<Form.Item name='soTrang' label='Số trang [300$a]'>
							<Input placeholder='Nhập số trang' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='dacDiemVatLy' label='Đặc điểm vật lý [300$b]'>
							<Input placeholder='Nhập đặc điểm vật lý' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='khuonKho' label='Khuôn khổ [300$c]'>
							<Input placeholder='Nhập khuôn khổ' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='tuLieuDiKem' label='Tư liệu đi kèm [300$e]'>
							<Input placeholder='Nhập tư liệu đi kèm' />
						</Form.Item>
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<Row gutter={[12, 0]}>
					<Col xs={24} md={12}>
						<Form.Item name='online' valuePropName='checked' initialValue={false}>
							<Checkbox>Ấn phẩm số</Checkbox>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='isSachHay' valuePropName='checked' initialValue={false}>
							<Checkbox>Sách hay</Checkbox>
						</Form.Item>
					</Col>
				</Row>
			</Col>

			{online && (
				<Col span={24}>
					<Form.Item name='thongTinAnPhamTrucTuyen' label='Danh sách tài liệu ấn phẩm số' rules={[...rules.required]}>
						<FormItemTaiLieuSo />
					</Form.Item>
				</Col>
			)}

			{isSachHay && (
				<Col xs={24}>
					<Form.Item name='moTa' label='Nội dung sách hay' rules={[...rules.text]}>
						<TinyEditor height={300} hideMenubar miniToolbar />
					</Form.Item>
				</Col>
			)}
		</Row>
	);
};

export default BienMucSoLuoc;
