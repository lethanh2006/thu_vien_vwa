import { Card, Col, Row } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import LichSuThueMuonPage from '../../LichSu';
import _ from 'lodash';

const StatNguoiDungAnPham = (props: { isSinhVien: boolean }) => {
	const { isSinhVien } = props;
	const { settingMuonTra } = useModel('sachtailieu.muontra.muontra');

	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const { record: recCanBo } = useModel('tochucnhansu.nhansu');

	const [visibleModal, setVisibleModal] = useState(false);

	const borrowerInfo = isSinhVien ? recSinhVien : recCanBo;

	// Tính toán số lượng còn mượn được
	const maxBorrowLimit = isSinhVien
		? settingMuonTra?.soLuongMuonToiDa ?? 7
		: settingMuonTra?.soLuongMuonToiDaCanBo ?? 5;
	const currentBorrowed = Number(borrowerInfo?.thongKe?.dangThueMuon ?? 0);
	const slConMuonDuoc = Math.max(0, maxBorrowLimit - currentBorrowed);

	if (!borrowerInfo) return null;

	return (
		<>
			<Row gutter={[12, 0]}>
				<Col span={24} md={4}>
					<Card className='card-stat-small pointer' onClick={() => setVisibleModal(true)}>
						<span className='num' style={{ color: 'purple' }}>
							{isSinhVien
								? _.sum(Object.values(recSinhVien?.thongKe ?? {}).map(Number))
								: _.sum(Object.values(recCanBo?.thongKe ?? {}).map(Number))}
						</span>
						<span>Tổng số</span>
					</Card>
				</Col>
				<Col span={24} md={5}>
					<Card className='card-stat-small pointer' onClick={() => setVisibleModal(true)}>
						<span className='num' style={{ color: 'blue' }}>
							{isSinhVien ? settingMuonTra?.soLuongMuonToiDa ?? 7 : settingMuonTra?.soLuongMuonToiDaCanBo ?? 5}
						</span>
						<span>Hạn ngạch mượn</span>
					</Card>
				</Col>
				<Col span={24} md={5}>
					<Card className='card-stat-small pointer' onClick={() => setVisibleModal(true)}>
						<span className='num' style={{ color: 'orange' }}>
							{(isSinhVien ? recSinhVien : recCanBo)?.thongKe?.dangThueMuon ?? 0}
						</span>
						<span>Đang mượn</span>
					</Card>
				</Col>
				<Col span={24} md={5}>
					<Card className='card-stat-small pointer' onClick={() => setVisibleModal(true)}>
						<span className='num' style={{ color: 'green' }}>
							{slConMuonDuoc}
						</span>
						<span>Còn mượn được</span>
					</Card>
				</Col>
				<Col span={24} md={5}>
					<Card className='card-stat-small pointer' onClick={() => setVisibleModal(true)}>
						<span className='num' style={{ color: 'red' }}>
							{(isSinhVien ? recSinhVien : recCanBo)?.thongKe?.quaHan ?? 0}
						</span>
						<span>Quá hạn mượn</span>
					</Card>
				</Col>
			</Row>

			<LichSuThueMuonPage
				visible={visibleModal}
				setVisible={setVisibleModal}
				title={`Danh sách lịch sử mượn trả sách người mượn ${
					isSinhVien ? recSinhVien?.ten : [recCanBo?.hoDem, recCanBo?.ten]?.filter(Boolean).join(' ')
				}`}
				width={1000}
				ssoId={borrowerInfo?.ssoId}
			/>
		</>
	);
};

export default StatNguoiDungAnPham;
