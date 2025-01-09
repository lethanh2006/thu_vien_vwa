import { Card } from 'antd';
import ModalXepGia from '../AnPham/components/XepGia';
import LichSuXepGia from '../AnPham/LichSuXepGia';

const XepGiaPage = () => {
	return (
		<Card title='Danh sách ấn phẩm xếp giá'>
			<LichSuXepGia />

			<ModalXepGia />
		</Card>
	);
};

export default XepGiaPage;
