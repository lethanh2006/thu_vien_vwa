import {
	colorTrangThaiDuyeMuonSach,
	colorTrangThaiMuonSach,
	mapNameTrangThaiMuonSach,
	type ETrangThaiDuyetMuonSach,
	type ETrangThaiMuonSach,
} from '@/services/SachTaiLieu/constant';
import dayjs from '@/utils/dayjs';
import { Button, Card, Col, Descriptions, Row, Tag } from 'antd';
import { useIntl, useModel } from 'umi';

const ChiTietLichSu = () => {
	const intl = useIntl();
	const { record, setVisibleForm } = useModel('sachtailieu.muontra.lichsumuontra');

	return (
		<Card title={intl.formatMessage({ id: 'sachtailieu.muontra.chitiet.title' })}>
			<Row gutter={[12, 0]}>
				<Col xs={24}>
					<Descriptions column={1}>
						<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.muontra.chitiet.madinhdanh' })}>
							{record?.phieuMuonTra?.maDinhDanhNguoiMuon ?? '--'}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.muontra.chitiet.hoten' })}>
							{record?.phieuMuonTra?.hoTenNguoiMuon ?? '--'}
						</Descriptions.Item>

						<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.muontra.chitiet.nhande' })}>
							{record?.anPham?.nhanDe ?? '--'}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.muontra.chitiet.tacgia' })}>
							{record?.anPham?.tacGia ?? '--'}
						</Descriptions.Item>

						<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.muontra.chitiet.dangkycabiet' })}>
							{record?.soDangKyCaBiet ?? '--'}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.muontra.chitiet.thoigianmuon' })}>
							{record?.thoiGianMuon ? dayjs(record?.thoiGianMuon).format('HH:mm DD/MM/YYYY') : '--'}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.muontra.chitiet.hantra' })}>
							{record?.expired ? dayjs(record?.expired).format('HH:mm DD/MM/YYYY') : '--'}
						</Descriptions.Item>

						{/* <Descriptions.Item label='Trạng thái'>
							{record?.daLaySach ? <Tag color='green'>Đã lấy</Tag> : <Tag color='red'>Chưa lấy</Tag>}
						</Descriptions.Item>

						<Descriptions.Item label='Gia hạn'>
							{record?.giaHan ? <Tag color='green'>Có gian hạn</Tag> : <Tag color='red'>Không gia hạn</Tag>}
						</Descriptions.Item> */}

						<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.muontra.chitiet.thoigiangiahan' })}>
							{record?.thoiGianGiaHan ? dayjs(record?.thoiGianGiaHan).format('HH:mm DD/MM/YYYY') : '--'}
						</Descriptions.Item>

						<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.muontra.chitiet.thoigiantra' })}>
							{record?.thoiGianTra ? dayjs(record?.thoiGianTra).format('HH:mm DD/MM/YYYY') : '--'}
						</Descriptions.Item>

						<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.muontra.chitiet.thoigiandangky' })}>
							{record?.phieuMuonTra?.thoiGianDangKy
								? dayjs(record?.phieuMuonTra?.thoiGianDangKy).format('HH:mm DD/MM/YYYY')
								: '--'}
						</Descriptions.Item>

						{/* <Descriptions.Item label='Ghi chú đăng ký'>{record?.ghiChuDangKy ?? '--'}</Descriptions.Item> */}

						<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.muontra.chitiet.ghichu' })}>
							{record?.ghiChu ?? '--'}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.muontra.chitiet.ghichutra' })}>
							{record?.ghiChuTra ?? '--'}
						</Descriptions.Item>

						<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.muontra.chitiet.trangthai' })}>
							<Tag color={colorTrangThaiMuonSach[record?.trangThai as ETrangThaiMuonSach]}>
								{mapNameTrangThaiMuonSach[record?.trangThai as ETrangThaiMuonSach]}
							</Tag>
						</Descriptions.Item>

						<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.muontra.chitiet.trangthaiduyet' })}>
							<Tag color={colorTrangThaiDuyeMuonSach[record?.phieuMuonTra?.trangThaiDuyet as ETrangThaiDuyetMuonSach]}>
								{record?.phieuMuonTra?.trangThaiDuyet}
							</Tag>
						</Descriptions.Item>
					</Descriptions>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Card>
	);
};

export default ChiTietLichSu;
