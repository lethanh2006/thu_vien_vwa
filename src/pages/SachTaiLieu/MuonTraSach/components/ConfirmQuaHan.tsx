import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { useIntl, useModel } from 'umi';

const ConfirmMuonQuaHan = (props: { visible: boolean; setVisible: (val: boolean) => void; onOk: () => void }) => {
	const { visible, setVisible, onOk } = props;
	const intl = useIntl();

	const { formSubmiting } = useModel('sachtailieu.muontra.phieumuontra');

	const handleXacNhan = () => {
		onOk();
	};

	return (
		<Modal
			open={visible}
			onCancel={() => setVisible(false)}
			width={600}
			footer={null}
			title={intl.formatMessage({ id: 'sachtailieu.muontra.confirm.title' })}
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
				<div style={{ fontSize: 18, fontWeight: 600 }}>
					{intl.formatMessage({ id: 'sachtailieu.muontra.confirm.message' })}
				</div>
			</div>

			<div className='form-footer'>
				<Button type='primary' loading={formSubmiting} onClick={() => handleXacNhan()}>
					{intl.formatMessage({ id: 'global.button.xacnhan' })}
				</Button>
				<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Modal>
	);
};

export default ConfirmMuonQuaHan;
