import { ETrangThaiMuonSach } from '@/services/SachTaiLieu/constant';
import { Card, Col, Row, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const StatMuonTraSach = (props: {
	setTrangThai: (val: ETrangThaiMuonSach) => void;
	setActiveKey: (val: string) => void;
}) => {
	const { setTrangThai, setActiveKey } = props;
	const { thongKeMuonTraSachModel, dataThongKe, loadingThongKe } = useModel('sachtailieu.muontra.muontra');

	useEffect(() => {
		thongKeMuonTraSachModel();
	}, []);

	const handleTrangThai = (item: ETrangThaiMuonSach) => {
		setTrangThai(item);
	};

	return (
		<Spin spinning={loadingThongKe}>
			<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
				<Col span={24} md={6}>
					<Card
						className='card-stat-small'
						style={{ cursor: 'pointer' }}
						onClick={() => handleTrangThai(ETrangThaiMuonSach.CHO_XU_LY)}
					>
						<span className='num' style={{ color: 'blue' }}>
							{dataThongKe?.choXuLy ?? 0}
						</span>
						<span>Chờ xử lý</span>
					</Card>
				</Col>
				<Col span={24} md={6}>
					<Card
						className='card-stat-small'
						style={{ cursor: 'pointer' }}
						onClick={() => {
							handleTrangThai(ETrangThaiMuonSach.DANG_THUE_MUON);
							setActiveKey('1');
						}}
					>
						<span className='num' style={{ color: 'orange' }}>
							{dataThongKe?.dangThueMuon ?? 0}
						</span>
						<span>Đang mượn</span>
					</Card>
				</Col>
				<Col span={24} md={6}>
					<Card
						className='card-stat-small'
						style={{ cursor: 'pointer' }}
						onClick={() => {
							handleTrangThai(ETrangThaiMuonSach.DANG_THUE_MUON);
							setActiveKey('3');
						}}
					>
						<span className='num' style={{ color: 'rec' }}>
							{dataThongKe?.quaHan ?? 0}
						</span>
						<span>Quá hạn mượn</span>
					</Card>
				</Col>
				<Col span={24} md={6}>
					<Card
						className='card-stat-small'
						style={{ cursor: 'pointer' }}
						onClick={() => handleTrangThai(ETrangThaiMuonSach.DA_TRA)}
					>
						<span className='num' style={{ color: 'green' }}>
							{dataThongKe?.daTra ?? 0}
						</span>
						<span>Đã trả</span>
					</Card>
				</Col>
			</Row>
		</Spin>
	);
};

export default StatMuonTraSach;
