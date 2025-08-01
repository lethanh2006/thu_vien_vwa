import { Modal } from 'antd';

const ModalNguoiMuon = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const { visible, setVisible } = props;
	return (
		<Modal title='Tìm kiếm' visible={visible} onCancel={() => setVisible(false)} footer={null} width={800}>
			sss
		</Modal>
	);
};

export default ModalNguoiMuon;
