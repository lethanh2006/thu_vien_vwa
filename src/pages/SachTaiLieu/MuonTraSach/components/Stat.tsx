import { inputFormat } from '@/utils/utils';
import { Card, Col, Row, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const StatMuonTraSach = () => {
	const { thongKeMuonTraSachModel, dataThongKe, loadingThongKe } = useModel('sachtailieu.muontra.muontra');

	useEffect(() => {
		thongKeMuonTraSachModel();
	}, []);

	return (
		<Spin spinning={loadingThongKe}>
			<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
				<Col span={24} md={6}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: 'blue' }}>
							{inputFormat(dataThongKe?.choXuLy ?? 0)}
						</span>
						<span>Chờ xử lý</span>
					</Card>
				</Col>
				<Col span={24} md={6}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: 'orange' }}>
							{inputFormat(dataThongKe?.dangThueMuon ?? 0)}
						</span>
						<span>Đang mượn</span>
					</Card>
				</Col>
				<Col span={24} md={6}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: 'rec' }}>
							{inputFormat(dataThongKe?.quaHan ?? 0)}
						</span>
						<span>Quá hạn mượn</span>
					</Card>
				</Col>
				<Col span={24} md={6}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: 'green' }}>
							{inputFormat(dataThongKe?.daTra ?? 0)}
						</span>
						<span>Đã trả</span>
					</Card>
				</Col>
			</Row>
		</Spin>
	);
};

export default StatMuonTraSach;
