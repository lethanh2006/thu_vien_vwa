import { Button, Card, Tabs } from 'antd';
import { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useIntl, useModel } from 'umi';
import ChiTietBienMuc from '../../BienMuc/components/ChiTiet';
import NoiDungSachHay from '../../BienMuc/components/NoiDungSachHay';
import FormItemTaiLieuSo from '../../BienMuc/DanhSachTaiLieu/FormItem';
import LichSuThueMuonPage from '../../MuonTraSach/LichSu';
import DanhSachDKCB from '../DanhSachDKCB';
import LichSuXepGia from '../LichSuXepGia';
import ChiTietAnPham from './ChiTiet';

const ModalAnPham = () => {
	const intl = useIntl();
	const { record: recAnPham, setVisibleForm } = useModel('sachtailieu.anpham.anpham');
	const { getAllModel, loading } = useModel('sachtailieu.anpham.thongtinanpham');
	const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1200px)' });

	const getData = () => {
		if (recAnPham?._id) getAllModel(undefined, undefined, { anPhamId: recAnPham?._id });
	};

	useEffect(() => {
		getData();
	}, [recAnPham?._id]);

	return (
		<Card title='Chi tiết ấn phẩm' loading={loading}>
			<Tabs tabPosition={isTabletOrMobile ? 'top' : 'left'}>
				<Tabs.TabPane tab='Thông tin chung' key='1'>
					<ChiTietBienMuc />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Thông tin chi tiết' key='2'>
					<ChiTietAnPham />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Danh sách đăng ký cá biệt' key='3'>
					<DanhSachDKCB />
				</Tabs.TabPane>
				{recAnPham?.online ? (
					<Tabs.TabPane tab='File ấn phẩm số' key='4'>
						<FormItemTaiLieuSo disabled value={recAnPham?.thongTinAnPhamTrucTuyen} />
					</Tabs.TabPane>
				) : (
					<Tabs.TabPane tab='Lịch sử mượn trả' key='5'>
						<LichSuThueMuonPage condition={{ anPhamId: recAnPham?._id }} hideModal />
					</Tabs.TabPane>
				)}
				{recAnPham?.isSachHay ? (
					<Tabs.TabPane tab='Nội dung sách hay' key='6'>
						<NoiDungSachHay />
					</Tabs.TabPane>
				) : null}

				<Tabs.TabPane tab='Lịch sử xếp giá' key='7'>
					<LichSuXepGia />
				</Tabs.TabPane>
			</Tabs>

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Card>
	);
};

export default ModalAnPham;
