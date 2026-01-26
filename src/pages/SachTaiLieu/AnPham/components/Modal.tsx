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
		<Card title={intl.formatMessage({ id: 'sachtailieu.anpham.chiTiet' })} loading={loading}>
			<Tabs tabPosition={isTabletOrMobile ? 'top' : 'left'}>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sachtailieu.anpham.thongTinChung' })} key='1'>
					<ChiTietBienMuc />
				</Tabs.TabPane>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sachtailieu.anpham.thongTinChiTiet' })} key='2'>
					<ChiTietAnPham />
				</Tabs.TabPane>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sachtailieu.anpham.danhSachDangKyCaBiet' })} key='3'>
					<DanhSachDKCB />
				</Tabs.TabPane>
				{recAnPham?.online ? (
					<Tabs.TabPane tab={intl.formatMessage({ id: 'sachtailieu.anpham.fileAnPhamSo' })} key='4'>
						<FormItemTaiLieuSo disabled value={recAnPham?.thongTinAnPhamTrucTuyen} />
					</Tabs.TabPane>
				) : (
					<Tabs.TabPane tab={intl.formatMessage({ id: 'sachtailieu.anpham.lichSuMuonTra' })} key='5'>
						<LichSuThueMuonPage condition={{ anPhamId: recAnPham?._id }} hideModal />
					</Tabs.TabPane>
				)}
				{recAnPham?.isSachHay ? (
					<Tabs.TabPane tab={intl.formatMessage({ id: 'sachtailieu.anpham.noiDungSachHay' })} key='6'>
						<NoiDungSachHay />
					</Tabs.TabPane>
				) : null}

				<Tabs.TabPane tab={intl.formatMessage({ id: 'sachtailieu.anpham.lichSuXepGia' })} key='7'>
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
