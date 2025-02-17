import {
	colorTrangThaiDuyeMuonSach,
	colorTrangThaiMuonSach,
	type ETrangThaiDuyetMuonSach,
	type ETrangThaiMuonSach,
} from '@/services/SachTaiLieu/constant';
import { Button, Card, Col, Descriptions, Row, Tag } from 'antd';
import moment from 'moment';
import { useIntl, useModel } from 'umi';

const ChiTietLichSu = () => {
	const intl = useIntl();
	const { record, setVisibleForm } = useModel('sachtailieu.muontra.lichsumuontra');

	return (
		<Card title='Chi tiết sinh viên mượn sách'>
			<Row gutter={[12, 0]}>
				<Col xs={24}>
					<Descriptions column={1}>
						<Descriptions.Item label='Mã định danh'>
							{record?.phieuMuonTra?.maDinhDanhNguoiMuon ?? '--'}
						</Descriptions.Item>
						<Descriptions.Item label='Họ tên'>{record?.phieuMuonTra?.hoTenNguoiMuon ?? '--'}</Descriptions.Item>

						<Descriptions.Item label='Nhan đề'>{record?.anPham?.nhanDe ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Tác giả'>{record?.anPham?.tacGia ?? '--'}</Descriptions.Item>

						<Descriptions.Item label='Đăng ký cá biệt'>{record?.soDangKyCaBiet ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Thời gian mượn'>
							{record?.thoiGianMuon ? moment(record?.thoiGianMuon).format('HH:mm DD/MM/YYYY') : '--'}
						</Descriptions.Item>
						<Descriptions.Item label='Hạn trả'>
							{record?.expired ? moment(record?.expired).format('HH:mm DD/MM/YYYY') : '--'}
						</Descriptions.Item>

						{/* <Descriptions.Item label='Trạng thái'>
							{record?.daLaySach ? <Tag color='green'>Đã lấy</Tag> : <Tag color='red'>Chưa lấy</Tag>}
						</Descriptions.Item>

						<Descriptions.Item label='Gia hạn'>
							{record?.giaHan ? <Tag color='green'>Có gian hạn</Tag> : <Tag color='red'>Không gia hạn</Tag>}
						</Descriptions.Item> */}

						<Descriptions.Item label='Thời gian gia hạn'>
							{record?.thoiGianGiaHan ? moment(record?.thoiGianGiaHan).format('HH:mm DD/MM/YYYY') : '--'}
						</Descriptions.Item>

						<Descriptions.Item label='Thời gian trả'>
							{record?.thoiGianTra ? moment(record?.thoiGianTra).format('HH:mm DD/MM/YYYY') : '--'}
						</Descriptions.Item>

						<Descriptions.Item label='Thời gian đăng ký'>
							{record?.phieuMuonTra?.thoiGianDangKy
								? moment(record?.phieuMuonTra?.thoiGianDangKy).format('HH:mm DD/MM/YYYY')
								: '--'}
						</Descriptions.Item>

						{/* <Descriptions.Item label='Ghi chú đăng ký'>{record?.ghiChuDangKy ?? '--'}</Descriptions.Item> */}

						<Descriptions.Item label='Ghi chú'>{record?.ghiChu ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Ghi chú trả'>{record?.ghiChuTra ?? '--'}</Descriptions.Item>

						<Descriptions.Item label='Trạng thái'>
							<Tag color={colorTrangThaiMuonSach[record?.trangThai as ETrangThaiMuonSach]}>{record?.trangThai}</Tag>
						</Descriptions.Item>

						<Descriptions.Item label='Trạng thái duyệt'>
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
