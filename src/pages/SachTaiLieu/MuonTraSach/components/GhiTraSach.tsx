import { EVaiTroMuonTra } from '@/services/SachTaiLieu/constant';
import { colorTrangThaiHocSv, type ETrangThaiHocSv } from '@/services/SinhVien/constant';
import { type ETrangThaiNhanSu, MapColorETrangThaiNhanSu } from '@/services/ToChucNhanSu/constant';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Descriptions, Form, Input, Modal, Row, Tag } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const GhiTraAnPham = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	getData?: () => void;
	isThongTin?: boolean;
}) => {
	const intl = useIntl();
	const { visible, setVisible, getData, isThongTin } = props;
	const [form] = Form.useForm();

	const { record, ghiTraThueMuonAnPhamModel, formSubmiting } = useModel('sachtailieu.muontra.muontra');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const { record: recCanBo } = useModel('tochucnhansu.nhansu');

	useEffect(() => {
		if (!visible) {
			resetFieldsForm(form);
		}
	}, [visible]);

	const onFinish = async (values: any) => {
		ghiTraThueMuonAnPhamModel(record?._id ?? '', values, getData)
			.then(() => {
				setVisible(false);
			})
			.catch((err) => console.log(err));
	};

	return (
		<Modal
			title='Ghi trả ấn phẩm'
			visible={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			width={isThongTin ? 800 : 600}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					{isThongTin ? (
						<Col xs={24}>
							<Descriptions column={{ xs: 1, md: 2 }}>
								{record?.phieuMuonTra?.vaiTro === EVaiTroMuonTra.SINHVIEN ? (
									<>
										<Descriptions.Item label='Mã SV'>
											{record?.phieuMuonTra?.maDinhDanhNguoiMuon ?? '--'}
										</Descriptions.Item>
										<Descriptions.Item label='Họ tên'>{record?.phieuMuonTra?.hoTenNguoiMuon ?? '--'}</Descriptions.Item>
										<Descriptions.Item label='Ngày sinh'>
											{record?.phieuMuonTra?.ngaySinhNguoiMuon
												? moment(record?.phieuMuonTra?.ngaySinhNguoiMuon).format('DD/MM/YYYY')
												: '--'}
										</Descriptions.Item>
										<Descriptions.Item label='Lớp'>
											{record?.phieuMuonTra?.tenLopHanhChinhNguoiMuon ?? '--'}
										</Descriptions.Item>
										<Descriptions.Item label='Khóa sinh viên'>
											{record?.phieuMuonTra?.tenKhoaNguoiMuon ?? '--'}
										</Descriptions.Item>
										<Descriptions.Item label='Khóa ngành'>
											{record?.phieuMuonTra?.tenNganhNguoiMuon ?? '--'}
										</Descriptions.Item>
										<Descriptions.Item label='Trạng thái học'>
											<Tag
												color={
													colorTrangThaiHocSv[
														(record?.phieuMuonTra?.trangThaiHoc ?? recSinhVien?.trangThaiHoc) as ETrangThaiHocSv
													]
												}
											>
												{record?.phieuMuonTra?.trangThaiHoc ?? recSinhVien?.trangThaiHoc}
											</Tag>
										</Descriptions.Item>
									</>
								) : (
									<>
										<Descriptions.Item label='Mã cán bộ'>
											{record?.phieuMuonTra?.maDinhDanhNguoiMuon ?? '--'}
										</Descriptions.Item>
										<Descriptions.Item label='Họ tên'>{record?.phieuMuonTra?.hoTenNguoiMuon ?? '--'}</Descriptions.Item>
										<Descriptions.Item label='Ngày sinh'>
											{record?.phieuMuonTra?.ngaySinhNguoiMuon
												? moment(record?.phieuMuonTra?.ngaySinhNguoiMuon).format('DD/MM/YYYY')
												: '--'}
										</Descriptions.Item>
										<Descriptions.Item label='Đơn vị'>
											{record?.phieuMuonTra?.tenDonViNguoiMuon ?? '--'}
										</Descriptions.Item>
										<Descriptions.Item label='Trạng thái'>
											<Tag
												color={
													MapColorETrangThaiNhanSu[
														(record?.phieuMuonTra?.trangThaiLamViec ?? recCanBo?.trangThai) as ETrangThaiNhanSu
													]
												}
											>
												{record?.phieuMuonTra?.trangThaiLamViec ?? recCanBo?.trangThai}
											</Tag>
										</Descriptions.Item>
									</>
								)}

								<Descriptions.Item label='Nhan đề' span={24}>
									{record?.anPham?.nhanDe ?? '--'}
								</Descriptions.Item>
								<Descriptions.Item label='Tác giả'>{record?.anPham?.tacGia ?? '--'}</Descriptions.Item>
								<Descriptions.Item label='Đăng ký cá biệt'>{record?.soDangKyCaBiet ?? '--'}</Descriptions.Item>
								<Descriptions.Item label='Thời gian mượn'>
									{record?.thoiGianMuon ? moment(record?.thoiGianMuon).format('DD/MM/YYYY') : '--'}
								</Descriptions.Item>
								<Descriptions.Item label='Hạn trả'>
									{record?.expired ? moment(record?.expired).format('DD/MM/YYYY') : '--'}
								</Descriptions.Item>
								<Descriptions.Item label='Thời gian gia hạn'>
									{record?.thoiGianGiaHan ? moment(record?.thoiGianGiaHan).format('DD/MM/YYYY') : '--'}
								</Descriptions.Item>
								<Descriptions.Item label='Thời gian trả'>
									{record?.thoiGianTra ? moment(record?.thoiGianTra).format('DD/MM/YYYY') : '--'}
								</Descriptions.Item>
								<Descriptions.Item label='Ghi chú'>{record?.ghiChu ?? '--'}</Descriptions.Item>
								<Descriptions.Item label='Ghi chú trả'>{record?.ghiChuTra ?? '--'}</Descriptions.Item>
							</Descriptions>
						</Col>
					) : null}
					<Col xs={24}>
						<Form.Item name='ghiChuTra' label='Ghi chú trả'>
							<Input placeholder='Nhập ghi chú' />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Ghi trả
					</Button>
					<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default GhiTraAnPham;
