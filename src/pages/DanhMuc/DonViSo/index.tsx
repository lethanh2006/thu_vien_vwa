import { Card, Col, Row } from 'antd';
import TreeLinhVuc from './components/TreeLinhVuc';

const DonViSo = () => {
	return (
		<Row gutter={[12, 12]} wrap>
			<Col xs={24}>
				<Card title='Đơn vị số & Bộ sưu tập' style={{ height: '100%' }}>
					<TreeLinhVuc />
				</Card>
			</Col>
		</Row>
	);
};

export default DonViSo;
