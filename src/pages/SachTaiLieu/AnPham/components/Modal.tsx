import { Card, Tabs } from 'antd';
import { useState } from 'react';
import DanhSachDKCB from '../DanhSachDKCB';
import LichSuAnPham from '../LichSuAnPham';
import ChiTietAnPham from './ChiTiet';

const ModalAnPham = () => {
	const [tabActive, setTabActive] = useState<string>('1');

	return (
		<Card title='Chi tiết ấn phẩm'>
			<Tabs onChange={(tab) => setTabActive(tab)} activeKey={tabActive}>
				<Tabs.TabPane tab='Thông tin chung' key='1' />
				<Tabs.TabPane tab='Danh sách đăng ký cá biệt' key='2' />
				<Tabs.TabPane tab='Lịch sử mượn trả' key='3' />
			</Tabs>

			{tabActive === '1' ? <ChiTietAnPham /> : tabActive === '2' ? <DanhSachDKCB /> : <LichSuAnPham />}
		</Card>
	);
};

export default ModalAnPham;
