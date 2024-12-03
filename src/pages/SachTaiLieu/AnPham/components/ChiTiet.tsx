import { Card, Col, Descriptions, Row } from 'antd';
import { useModel } from 'umi';

const ChiTietAnPham = () => {
	const { record } = useModel('sachtailieu.anpham.anpham');
	return (
		<Card title='Chi tiết ấn phẩm'>
			<Row gutter={[12, 0]}>
				<Col span={24}>
					<Descriptions column={1}>
						<Descriptions.Item label='Ấn phẩm'>{record?.ten}</Descriptions.Item>
					</Descriptions>
				</Col>
			</Row>
		</Card>
	);
};

export default ChiTietAnPham;
