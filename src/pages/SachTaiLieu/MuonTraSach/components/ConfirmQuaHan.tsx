import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { useModel } from 'umi';

const ConfirmMuonQuaHan = (props: { visible: boolean; setVisible: (val: boolean) => void; onOk: () => void }) => {
	const { visible, setVisible, onOk } = props;

	const { formSubmiting } = useModel('sachtailieu.muontra.phieumuontra');

	const handleXacNhan = () => {
		onOk();
	};

	return (
		<Modal
			visible={visible}
			onCancel={() => setVisible(false)}
			width={600}
			footer={null}
			title='Xác nhận thuê mượn'
			maskClosable={false}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 8,
					alignItems: 'center',
					marginBottom: 24,
				}}
			>
				<div style={{ color: 'orange', fontSize: 48 }}>
					<ExclamationCircleFilled />
				</div>
				<div>Đã quá hạn ngạch mượn. Bạn có chắc chắn muốn ghi mượn?</div>
			</div>

			<div className='form-footer'>
				<Button type='primary' loading={formSubmiting} onClick={() => handleXacNhan()}>
					Xác nhận
				</Button>
				<Button onClick={() => setVisible(false)}>Hủy</Button>
			</div>
		</Modal>
	);
};

export default ConfirmMuonQuaHan;
