import { Card, Col, Row } from 'antd';
import { useIntl } from 'umi';
import TreeLinhVuc from './components/TreeLinhVuc';

const DonViSo = () => {
	const intl = useIntl();
	return (
		<Row gutter={[12, 12]} wrap>
			<Col xs={24}>
				<Card title={intl.formatMessage({ id: 'danhmuc.donviso.title' })} style={{ height: '100%' }}>
					<TreeLinhVuc />
				</Card>
			</Col>
		</Row>
	);
};

export default DonViSo;
