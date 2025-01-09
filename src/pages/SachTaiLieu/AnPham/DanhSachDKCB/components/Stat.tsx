import { Card, Col, Row } from 'antd';

const StatDanhSachDKCB = () => {
	return (
		<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
			<Col span={24} md={8}>
				<Card className='card-stat-small'>
					<span className='num' style={{ color: 'blue' }}>
						--
					</span>
					<span>Tổng số đăng ký cá biệt</span>
				</Card>
			</Col>
			<Col span={24} md={8}>
				<Card className='card-stat-small'>
					<span className='num' style={{ color: 'rec' }}>
						--
					</span>
					<span>Số ĐKCB cho mượn</span>
				</Card>
			</Col>
			<Col span={24} md={8}>
				<Card className='card-stat-small'>
					<span className='num' style={{ color: 'green' }}>
						--
					</span>
					<span>Số ĐKCB khả dụng</span>
				</Card>
			</Col>
		</Row>
	);
};

export default StatDanhSachDKCB;
