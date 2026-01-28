import { EOperatorType } from '@/components/Table/constant';
import { EVaiTroMuonTra } from '@/services/SachTaiLieu/constant';
import { colorTrangThaiHocSv, type ETrangThaiHocSv } from '@/services/SinhVien/constant';
import { type ETrangThaiNhanSu, MapColorETrangThaiNhanSu } from '@/services/ToChucNhanSu/constant';
import dayjs from '@/utils/dayjs';
import { resetFieldsForm } from '@/utils/utils';
import { Avatar, Button, Card, Descriptions, Form, Input, Modal, Tag } from 'antd';
import { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
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
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

	const { record, ghiTraThueMuonAnPhamModel, formSubmiting, getModel } = useModel('sachtailieu.muontra.muontra');

	const { record: recSinhVien, setRecord: setRecSinhVien } = useModel('sinhvien.sinhvien');
	const { record: recCanBo, setRecord: setRecCanBo } = useModel('tochucnhansu.nhansu');

	const isSinhVien = record?.phieuMuonTra?.vaiTro === EVaiTroMuonTra.SINHVIEN;
	const setBorrowerInfo = isSinhVien ? setRecSinhVien : setRecCanBo;

	const getBorrower = async () => {
		const filters = [
			{
				active: true,
				field: isSinhVien ? 'ma' : 'maCanBo',
				values: [record?.phieuMuonTra?.maDinhDanhNguoiMuon],
				operator: EOperatorType.CONTAIN,
			},
		];

		const nguoiMuon = await getModel(
			undefined,
			filters as any,
			undefined,
			undefined,
			undefined,
			`thong-ke/${isSinhVien ? 'sinh-vien' : 'can-bo'}`,
			undefined,
			false,
		);

		setBorrowerInfo(nguoiMuon[0] as any);
	};

	useEffect(() => {
		if (!visible) {
			resetFieldsForm(form);
		} else if (record?._id) {
			// Kiểm tra nếu chưa có hoặc sai mã định danh thì mới gọi getBorrower
			const currentMa = isSinhVien ? recSinhVien?.ma : recCanBo?.maCanBo;

			const targetMa = record?.phieuMuonTra?.maDinhDanhNguoiMuon;

			if (!currentMa || currentMa !== targetMa) {
				getBorrower();
			}

			// const handleKeyDown = (e: KeyboardEvent) => {
			// 	if (e.key === 'Enter') {
			// 		form.submit();
			// 	}
			// };

			// window.addEventListener('keydown', handleKeyDown);

			// return () => {
			// 	window.removeEventListener('keydown', handleKeyDown);
			// };
		}
	}, [visible, record?._id]);

	const onFinish = async (values: any) => {
		ghiTraThueMuonAnPhamModel(record?._id ?? '', values, getData)
			.then(() => {
				setVisible(false);
			})
			.catch((err) => console.log(err));
	};

	return (
		<Modal
			title={intl.formatMessage({ id: 'sachtailieu.ghitrasach.title' })}
			open={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			width={isThongTin ? 800 : 600}
		>
			<div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
				<Avatar
					size={132}
					src={isSinhVien ? recSinhVien?.anhDaiDienUrl : recCanBo?.urlAnhDaiDien}
					style={{
						border: '1px solid #f0f0f0',
						fontSize: '36px',
						flexShrink: 0,
					}}
				>
					{/* Hiển thị chữ cái đầu nếu không có avatar */}
					{isSinhVien
						? recSinhVien?.ten?.charAt(0)
						: [recCanBo?.hoDem, recCanBo?.ten]?.filter(Boolean).join(' ').charAt(0)}
				</Avatar>

				<Descriptions column={isMobile ? 1 : 2}>
					{isSinhVien ? (
						<>
							<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.sinhVien.maSV' })}>
								{record?.phieuMuonTra?.maDinhDanhNguoiMuon ?? '--'}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.muontra.column.hoten' })}>
								{record?.phieuMuonTra?.hoTenNguoiMuon ?? '--'}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.muontra.descriptions.ngaysinh' })}>
								{record?.phieuMuonTra?.ngaySinhNguoiMuon
									? dayjs(record?.phieuMuonTra?.ngaySinhNguoiMuon).format('DD/MM/YYYY')
									: '--'}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.muontra.descriptions.lophanhchinh' })}>
								{record?.phieuMuonTra?.tenLopHanhChinhNguoiMuon ?? '--'}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.muontra.descriptions.khoasinhvien' })}>
								{record?.phieuMuonTra?.tenKhoaNguoiMuon ?? '--'}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.muontra.descriptions.khoanganh' })}>
								{record?.phieuMuonTra?.tenNganhNguoiMuon ?? '--'}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.sinhvien.trangthaihoc' })}>
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
							<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.muontra.descriptions.macanbo' })}>
								{record?.phieuMuonTra?.maDinhDanhNguoiMuon ?? '--'}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.muontra.column.hoten' })}>
								{record?.phieuMuonTra?.hoTenNguoiMuon ?? '--'}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.muontra.descriptions.ngaysinh' })}>
								{record?.phieuMuonTra?.ngaySinhNguoiMuon
									? dayjs(record?.phieuMuonTra?.ngaySinhNguoiMuon).format('DD/MM/YYYY')
									: '--'}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.muontra.descriptions.donvi' })}>
								{record?.phieuMuonTra?.tenDonViNguoiMuon ?? '--'}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.muontra.column.trangthai' })}>
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
				</Descriptions>
			</div>

			<Card
				title={intl.formatMessage({ id: 'sachtailieu.ghitrasach.cardtitle' })}
				variant='borderless'
				style={{ marginBottom: '24px' }}
			>
				<Descriptions column={isMobile ? 1 : 2}>
					<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.ghitrasach.descriptions.nhande' })} span={24}>
						{record?.anPham?.nhanDe ?? '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.ghitrasach.descriptions.tacgia' })}>
						{record?.anPham?.tacGia ?? '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.ghitrasach.descriptions.dangkycabiet' })}>
						{record?.soDangKyCaBiet ?? '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.ghitrasach.descriptions.thoigianmuon' })}>
						{record?.thoiGianMuon ? dayjs(record?.thoiGianMuon).format('DD/MM/YYYY') : '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.ghitrasach.descriptions.hantra' })}>
						{record?.expired ? dayjs(record?.expired).format('DD/MM/YYYY') : '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.ghitrasach.descriptions.thoigiangiahan' })}>
						{record?.thoiGianGiaHan ? dayjs(record?.thoiGianGiaHan).format('DD/MM/YYYY') : '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.ghitrasach.descriptions.thoigiantra' })}>
						{record?.thoiGianTra ? dayjs(record?.thoiGianTra).format('DD/MM/YYYY') : '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.ghitrasach.descriptions.ghichu' })}>
						{record?.ghiChu ?? '--'}
					</Descriptions.Item>
				</Descriptions>
			</Card>

			<Form form={form} onFinish={onFinish} layout='vertical'>
				<Form.Item
					name='ghiChuTra'
					label={
						<span style={{ fontWeight: 'bold' }}>
							{intl.formatMessage({ id: 'sachtailieu.ghitrasach.form.ghichutra' })}
						</span>
					}
				>
					<Input placeholder={intl.formatMessage({ id: 'sachtailieu.ghitrasach.form.placeholder' })} />
				</Form.Item>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'sachtailieu.ghitrasach.button.ghitra' })}
					</Button>
					<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default GhiTraAnPham;
