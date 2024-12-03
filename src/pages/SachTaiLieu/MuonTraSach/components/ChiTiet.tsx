import { Button, Col, Descriptions, Modal, Row, Tag } from 'antd';
import { useIntl, useModel } from 'umi';

const ChiTietMuonTraSach = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const intl = useIntl();
	const { record } = useModel('sachtailieu.muontra.muontra');
	const { visible, setVisible } = props;

	return (
		<Modal
			title='Chi tiết sinh viên mượn sách'
			visible={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			width={600}
		>
			<Row gutter={[12, 0]}>
				<Col xs={24}>
					<Descriptions column={1}>
						<Descriptions.Item label='Mã sinh viên'>B23DCCC112</Descriptions.Item>
						<Descriptions.Item label='Họ tên'>Nguyễn văn a</Descriptions.Item>
						<Descriptions.Item label='ĐKCB'>VG/9881</Descriptions.Item>
						<Descriptions.Item label='Tên sách'>Chủ nghĩa xã hội</Descriptions.Item>
						<Descriptions.Item label='Ngày mượn'>10/7/2024</Descriptions.Item>
						<Descriptions.Item label='Hạn trả'>10/12/2024</Descriptions.Item>
						<Descriptions.Item label='Trạng thái'>
							<Tag color='blue'>Chưa trả</Tag>
						</Descriptions.Item>
					</Descriptions>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button>In phiếu</Button>
				<Button>Thu hồi</Button>
				<Button>Ghi trả</Button>
				<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Modal>
	);
};

export default ChiTietMuonTraSach;
