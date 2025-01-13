import { Button, Card, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ChiTietBienMuc from '../../BienMuc/components/ChiTiet';
import LichSuThueMuonPage from '../../MuonTraSach/LichSu';
import DanhSachDKCB from '../DanhSachDKCB';
import ChiTietAnPham from './ChiTiet';

const ModalAnPham = () => {
	const intl = useIntl();
	const { record: recAnPham, setVisibleForm } = useModel('sachtailieu.anpham.anpham');
	const { getAllModel, loading } = useModel('sachtailieu.anpham.thongtinanpham');
	const [tabActive, setTabActive] = useState<string>('1');

	const getData = () => {
		if (recAnPham?._id) getAllModel(undefined, undefined, { anPhamId: recAnPham?._id });
	};

	useEffect(() => {
		getData();
	}, [recAnPham?._id]);

	return (
		<Card title='Chi tiết ấn phẩm' loading={loading}>
			<Tabs onChange={(tab) => setTabActive(tab)} activeKey={tabActive}>
				<Tabs.TabPane tab='Thông tin chung' key='1' />
				<Tabs.TabPane tab='Thông tin chi tiết' key='2' />
				<Tabs.TabPane tab='Danh sách đăng ký cá biệt' key='3' />
				<Tabs.TabPane tab='Lịch sử mượn trả' key='4' />
			</Tabs>

			{tabActive === '1' ? (
				<ChiTietBienMuc />
			) : tabActive === '2' ? (
				<ChiTietAnPham />
			) : tabActive === '3' ? (
				<DanhSachDKCB />
			) : (
				<LichSuThueMuonPage condition={{ anPhamId: recAnPham?._id }} />
			)}

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Card>
	);
};

export default ModalAnPham;
