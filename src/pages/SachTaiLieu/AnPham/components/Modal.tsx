import { Button, Card, Tabs } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import ChiTietBienMuc from '../../BienMuc/components/ChiTiet';
import DanhSachDKCB from '../DanhSachDKCB';
import LichSuAnPham from '../LichSuAnPham';
import ChiTietAnPham from './ChiTiet';

const ModalAnPham = () => {
	const intl = useIntl();
	const { setVisibleForm } = useModel('sachtailieu.anpham.anpham');
	const [tabActive, setTabActive] = useState<string>('1');

	return (
		<Card title='Chi tiết ấn phẩm'>
			<Tabs onChange={(tab) => setTabActive(tab)} activeKey={tabActive}>
				<Tabs.TabPane tab='Thông tin chung' key='1' />
				<Tabs.TabPane tab='Thông tin chi tiết' key='2' />
				<Tabs.TabPane tab='Danh sách đăng ký cá biệt' key='3' />
				<Tabs.TabPane tab='Lịch sử mượn trả' key='4' />
			</Tabs>

			{tabActive === '1' ? (
				<ChiTietBienMuc isAnPham />
			) : tabActive === '2' ? (
				<ChiTietAnPham />
			) : tabActive === '3' ? (
				<DanhSachDKCB />
			) : (
				<LichSuAnPham />
			)}

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Card>
	);
};

export default ModalAnPham;
