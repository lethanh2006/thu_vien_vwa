import MyDatePicker from '@/components/MyDatePicker';
import ButtonExtend from '@/components/Table/ButtonExtend';
import useDkcbPreview from '@/hooks/useDkcbPreview';
import useRefreshLibraryInventory from '@/hooks/useRefreshLibraryInventory';
import SelectGiaSach from '@/pages/DanhMuc/GiaSach/components/Select';
import SelectKhoSach from '@/pages/DanhMuc/KhoSach/components/Select';
import SelectKieuTuLieu from '@/pages/DanhMuc/KieuTuLieu/components/Select';
import SelectNguonBoSung from '@/pages/DanhMuc/NguonBoSung/components/Select';
import SelectThuVien from '@/pages/DanhMuc/ThuVien/components/Select';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { LoadingOutlined } from '@ant-design/icons';
import {
	Button,
	Card,
	Col,
	Descriptions,
	Divider,
	Form,
	Input,
	InputNumber,
	Modal,
	Popconfirm,
	Row,
	Spin,
	Tabs,
} from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectDotNhapSach from '../../DotNhapSach/components/Select';
import LichSuXepGia from '../LichSuXepGia';

const ModalXepGia = ({ onChanged }: { onChanged?: () => unknown }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record } = useModel('sachtailieu.anpham.anpham');
	const {
		formSubmiting,
		postModel,
		record: recXepGia,
		visibleForm,
		setVisibleForm,
		thongKeXepGiaModel,
		loadingThongKe,
		datathongKeXepGia,
	} = useModel('sachtailieu.anpham.xepgia');
	const maKhoSach: string = Form.useWatch('maKhoSach', form);
	const [actionType, setActionType] = useState<'luu_lai' | 'xep_gia'>('luu_lai');
	const [tabActive, setTabActive] = useState<string>('1');
	const dkcbPreview = useDkcbPreview(maKhoSach, visibleForm && tabActive === '1');
	const refreshRelatedData = useRefreshLibraryInventory(onChanged);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setActionType('luu_lai');
		} else if (record?._id) {
			void thongKeXepGiaModel({ anPhamId: record?._id }).catch(() => undefined);
			form.setFieldsValue({
				dotNhapSachId: record?.dotNhapSachId,
			});
		}
	}, [visibleForm, record?._id]);

	const onFinish = async (values: AnPham.IXepGia) => {
		postModel(
			{
				...values,
				daXepGia: actionType === 'xep_gia',
				anPhamId: record?._id,
				dotNhapSachId: record?.dotNhapSachId,
			},
			() => {
				void refreshRelatedData(record?._id);
				resetFieldsForm(form);
				setTabActive('2');
			},
			false,
			'Lưu thành công',
		)
			.then()
			.catch((er) => console.log(er));
	};

	return (
		<Modal
			title='Xếp giá'
			open={visibleForm}
			onCancel={() => setVisibleForm(false)}
			footer={null}
			width={1000}
			destroyOnClose
		>
			<Spin spinning={loadingThongKe}>
				<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
					<Col span={12} md={12}>
						<Card className='card-stat-small'>
							<span className='num' style={{ color: 'blue' }}>
								{datathongKeXepGia?.chuaXepGia ?? '--'}
							</span>
							<span>Số dòng chưa xếp giá</span>
						</Card>
					</Col>
					<Col span={12} md={12}>
						<Card className='card-stat-small'>
							<span className='num' style={{ color: 'green' }}>
								{datathongKeXepGia?.daXepGia ?? '--'}
							</span>
							<span>Số dòng đã xếp giá</span>
						</Card>
					</Col>
				</Row>
			</Spin>

			<Tabs onChange={(tab) => setTabActive(tab)} activeKey={tabActive}>
				<Tabs.TabPane tab='Xếp giá' key='1' />
				<Tabs.TabPane tab='Lịch sử xếp giá' key='2' />
			</Tabs>

			{tabActive === '1' ? (
				<Form onFinish={onFinish} form={form} layout='vertical'>
					<Row gutter={[12, 0]}>
						<Col span={24}>
							<Descriptions column={1}>
								<Descriptions.Item label='Nhan đề'>{record?.nhanDe ?? recXepGia?.anPham?.nhanDe}</Descriptions.Item>
								<Descriptions.Item label='Tác giả'>{record?.tacGia ?? recXepGia?.anPham?.tacGia}</Descriptions.Item>
							</Descriptions>
						</Col>
						<Col span={24}>
							<Divider>Thông tin xếp giá bổ sung</Divider>
						</Col>
						<Col xs={24}>
							<Form.Item
								name='dotNhapSachId'
								label='Sổ đăng ký tổng quát'
								// rules={[...rules.required]}
							>
								<SelectDotNhapSach allowClear />
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
								<SelectKhoSach selectMa onChange={() => form.resetFields(['giaSachId'])} />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name='giaSachId' label='Giá sách'>
								<SelectGiaSach condition={{ maKhoSach: maKhoSach }} />
							</Form.Item>
						</Col>
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
						<Col xs={24} md={12}>
							<Form.Item
								name='soLuong'
								label='Số lượng'
								rules={[
									...rules.required,
									{ type: 'integer', min: 1, max: 5000, message: 'Số lượng phải là số nguyên từ 1 đến 5000' },
								]}
							>
								<InputNumber min={1} max={5000} step={1} style={{ width: '100%' }} placeholder='Nhập số lượng' />
							</Form.Item>
						</Col>

						<Col xs={24}>
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
							<ButtonExtend loading={formSubmiting} type='primary'>
								Xếp giá
							</ButtonExtend>
						</Popconfirm>
						<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
					</div>
				</Form>
			) : (
				<LichSuXepGia onChanged={onChanged} />
			)}
		</Modal>
	);
};

export default ModalXepGia;
