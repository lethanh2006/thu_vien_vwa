import { Card, Col, Row, Spin } from 'antd';
import { useModel } from 'umi';

const StatBienMuc = () => {
	const { loadingThongKe } = useModel('sachtailieu.anpham.anpham');

	return (
		<Spin spinning={loadingThongKe}>
			<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
				<Col span={24} md={8}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: 'blue' }}>
							0
						</span>
						<span>Tổng số ấn phẩm</span>
					</Card>
				</Col>
				<Col span={24} md={8}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: 'orange' }}>
							0
						</span>
						<span>Chờ biên mục chi tiết</span>
					</Card>
				</Col>
				<Col span={24} md={8}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: 'green' }}>
							0
						</span>
						<span>Đã biên mục chi tiết</span>
					</Card>
				</Col>
			</Row>
		</Spin>
	);
};

export default StatBienMuc;
